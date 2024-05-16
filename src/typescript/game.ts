import { Base } from './base/base';
import { BaseModule } from './base/base-module';
import { Cannon } from './cannon/cannon';
import { EnemyProjectileSpawner } from './enemy-projectile-spawner/enemy-projectile-spawner';
import { GameStatistics } from './game-statistics';
import { Rectangle } from './models/geometry/rectangle.interface';
import { BlasterProjectile } from './projectile/blaster-projectile';
import { Projectile } from './projectile/projectile';
import { isPointInsideIntervals } from './utils/is-point-inside-intervals';
import { toRadians } from './utils/to-radians';

export class Game {
  private _timestamp = 0;
  private _allyProjectiles: BlasterProjectile[] = [];
  private _enemyProjectiles: BlasterProjectile[] = [];
  private _enemyProjectileSpawner: EnemyProjectileSpawner;
  private _statistics = new GameStatistics();

  private _cannons: Cannon[] = [
    new Cannon({
      barrelLength: 30,
      rotationRadians: toRadians(45),
      position: { x: 100, y: 100 },
      reloadingMs: 500,
      projectileOptions: {
        speed: 1000,
        color: '#dd8eff',
        length: 50
      },
    }),
    new Cannon({
      barrelLength: 30,
      rotationRadians: toRadians(135),
      position: { x: 900, y: 100 },
      reloadingMs: 500,
      projectileOptions: {
        speed: 1000,
        color: '#dd8eff',
        length: 50
      },
    }),
  ];
  private _cannonsAreActive = false;

  private _base = new Base([
    new BaseModule({
      x: 420,
      y: 20,
      width: 30,
      height: 16,
    }),
    new BaseModule({
      x: 500,
      y: 30,
      width: 30,
      height: 18,
    }),
    new BaseModule({
      x: 580,
      y: 26,
      width: 30,
      height: 16,
    }),
  ]);

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

  constructor() {
    this._enemyProjectileSpawner = new EnemyProjectileSpawner(
      this.base.modules.map(({ rectangle }) => rectangle),
      1,
      {
        length: 100,
        speed: 100,
        color: 'rgb(0, 255, 0)'
      },
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
    this.statistics.addShots(newProjectiles.length);
  }

  public update(ms: number): void {
    this._timestamp += ms;

    this.moveProjectiles(ms);
    this.requestForSpawEnemyProjectiles(ms);

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
  }

  private checkBaseModuleIntersections(): void {
    const enemyProjectilesToClear: BlasterProjectile[] = [];
    const baseRectangle = this.base.getBorders();

    this._enemyProjectiles.forEach((enemyProjectile) => {
      if (enemyProjectile.intersects(baseRectangle)) {
        this.base.getUndestroyedModules().forEach((module) => {
          if (enemyProjectile.intersects(module.rectangle)) {
            module.destroy();
            enemyProjectilesToClear.push(enemyProjectile);
            this.enemyProjectilesSpawner.removeTarget(module.rectangle);
          }
        });
      }
    });

    this._enemyProjectiles = this._enemyProjectiles
      .filter((projectile) => !enemyProjectilesToClear.includes(projectile));
  }

  private moveProjectiles(ms: number): void {
    Game.moveProjectilesGroup(this._allyProjectiles, ms);
    Game.moveProjectilesGroup(this._enemyProjectiles, ms);
  }

  private requestForSpawEnemyProjectiles(ms: number): void {
    const newEnemyProjectiles = this._enemyProjectileSpawner.requestForSpawn(ms, this._timestamp);
    this._enemyProjectiles.push(...newEnemyProjectiles);
    this.statistics.addEnemyProjectiles(newEnemyProjectiles.length);
  }
}
