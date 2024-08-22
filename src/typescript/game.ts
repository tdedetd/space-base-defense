import { Base } from './base/base';
import { BaseModule } from './base/base-module';
import { Cannon } from './cannon/cannon';
import { EnemyProjectileSpawner } from './enemy-projectile-spawner/enemy-projectile-spawner';
import { GameEvents } from './game-events/game-events';
import { GameStatistics } from './game-statistics';
import { LevelOptions } from './level/models/level-options.interface';
import { Rectangle } from './models/geometry/rectangle.interface';
import { BlasterProjectile } from './projectile/blaster-projectile';
import { Projectile } from './projectile/projectile';
import { isPointInsideIntervals } from './utils/is-point-inside-intervals';

export class Game {
  private _events = new GameEvents();
  private _timestamp = 0;
  private _allyProjectiles: BlasterProjectile[] = [];
  private _enemyProjectiles: BlasterProjectile[] = [];
  private _enemyProjectileSpawner: EnemyProjectileSpawner;
  private _statistics = new GameStatistics();
  private _cannons: Cannon[];
  private _cannonsAreActive = false;
  private _base: Base;

  public get timestamp(): number {
    return this._timestamp;
  }

  public get allyProjectiles(): BlasterProjectile[] {
    return this._allyProjectiles;
  }

  public get enemyProjectiles(): BlasterProjectile[] {
    return this._enemyProjectiles;
  }

  public get enemyProjectilesSpawner(): EnemyProjectileSpawner {
    return this._enemyProjectileSpawner;
  }

  public get cannons(): Cannon[] {
    return this._cannons;
  }

  public get cannonsAreActive(): boolean {
    return this._cannonsAreActive;
  }

  public get base(): Base {
    return this._base;
  }

  public get baseModules(): BaseModule[] {
    return this.base.modules;
  }

  public get currentProjectilesSpawnFrequency(): number {
    return this.enemyProjectilesSpawner.getCurrentSpawnFrequency(this.timestamp);
  }

  public get statistics(): GameStatistics {
    return this._statistics;
  }

  public get events(): GameEvents {
    return this._events;
  }

  constructor(level: LevelOptions) {
    this._cannons = level.cannons.map((options) => new Cannon(options));
    this._base = new Base(
      level.baseModules?.map((rectangle) => new BaseModule(rectangle)) ?? []
    );
    this._enemyProjectileSpawner = new EnemyProjectileSpawner(
      this.base.modules.map(({ rectangle }) => rectangle),
      level.enemyProjectile.frequency,
      level.enemyProjectile.options,
    );
  }

  private static getBlasterProjectilesInside(
    borders: Rectangle,
    projectiles: BlasterProjectile[]
  ): BlasterProjectile[] {
    const xMin = borders.x;
    const xMax = borders.x + borders.width;
    const yMin = borders.y;
    const yMax = borders.y + borders.height;

    return projectiles.filter((projectile) => {
      const line = projectile.getLine();
      return isPointInsideIntervals(line[0], xMin, xMax, yMin, yMax)
        || isPointInsideIntervals(line[1], xMin, xMax, yMin, yMax);
    });
  }

  private static moveProjectilesGroup(projectiles: Projectile[], ms: number): void {
    projectiles.forEach(projectile => {
      projectile.move(ms);
    });
  }

  public activateCannons(): void {
    this._cannonsAreActive = true;
  }

  public clearProjectilesOutside(borders: Rectangle): void {
    this._allyProjectiles = Game.getBlasterProjectilesInside(borders, this._allyProjectiles);
    this._enemyProjectiles = Game.getBlasterProjectilesInside(borders, this._enemyProjectiles);
  }

  public deactivateCannons(): void {
    this._cannonsAreActive = false;
  }

  public fire(): void {
    const newProjectiles = this._cannons.reduce<BlasterProjectile[]>((acc, cannon) => {
      try {
        return [...acc, cannon.tryToFire(this.timestamp)];
      } catch (error) {
        if (error instanceof Error && error.name === 'FireWhileReloadingCannonError') {
          return acc;
        }

        throw error;
      }
    }, []);

    this._allyProjectiles.push(...newProjectiles);
    this.statistics.addShots(newProjectiles.length ? 1 : 0);
  }

  public update(msDiff: number): void {
    this._timestamp += msDiff;

    this.moveProjectiles(msDiff);
    this.requestSpawEnemyProjectiles(msDiff);

    this.checkProjectilesIntersections();
    this.checkBaseModuleIntersections();

    if (this._cannonsAreActive) {
      this.fire();
    }
  }

  private checkProjectilesIntersections(): void {
    const allyProjectilesToClear: BlasterProjectile[] = [];
    const enemyProjectilesToClear: BlasterProjectile[] = [];

    this.allyProjectiles.forEach((allyProjectile) => {
      this.enemyProjectiles.forEach((enemyProjectile) => {
        const enemyProjectileLine = enemyProjectile.getLine();

        if (allyProjectile.intersects(enemyProjectileLine)) {
          allyProjectilesToClear.push(allyProjectile);
          enemyProjectilesToClear.push(enemyProjectile);
        }
      });
    });

    this._allyProjectiles = this._allyProjectiles
      .filter((projectile) => !allyProjectilesToClear.includes(projectile));

    this._enemyProjectiles = this._enemyProjectiles
      .filter((projectile) => !enemyProjectilesToClear.includes(projectile));

    this.statistics.addHits(allyProjectilesToClear.length);

    if (allyProjectilesToClear.length || enemyProjectilesToClear.length) {
      this.events.dispatch('blasterProjectilesIntersect', {
        projectiles: [...allyProjectilesToClear, ...enemyProjectilesToClear],
      });
    }
  }

  private checkBaseModuleIntersections(): void {
    const enemyProjectilesToClear: BlasterProjectile[] = [];
    const baseRectangle = this.base.getBorders();
    let needDispatch = false;

    this._enemyProjectiles.forEach((enemyProjectile) => {
      if (enemyProjectile.intersects(baseRectangle)) {
        this.base.getUndestroyedModules().forEach((module) => {
          if (enemyProjectile.intersects(module.rectangle)) {
            module.destroy();
            enemyProjectilesToClear.push(enemyProjectile);
            this.enemyProjectilesSpawner.removeTarget(module.rectangle);
            needDispatch = true;
          }
        });
      }
    });

    if (needDispatch) {
      this.events.dispatch('destroyModule', undefined);
    }

    this._enemyProjectiles = this._enemyProjectiles
      .filter((projectile) => !enemyProjectilesToClear.includes(projectile));
  }

  private moveProjectiles(msDiff: number): void {
    Game.moveProjectilesGroup(this._allyProjectiles, msDiff);
    Game.moveProjectilesGroup(this._enemyProjectiles, msDiff);
  }

  private requestSpawEnemyProjectiles(msDiff: number): void {
    const newEnemyProjectiles = this._enemyProjectileSpawner.requestSpawn(msDiff, this._timestamp);
    if (newEnemyProjectiles.length) {
      this._enemyProjectiles.push(...newEnemyProjectiles);
      this.statistics.addEnemyProjectiles(newEnemyProjectiles.length);
    }
  }
}
