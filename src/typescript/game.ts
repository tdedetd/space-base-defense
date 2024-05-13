import { Base } from './base/base';
import { BaseModule } from './base/base-module';
import { Cannon } from './cannon/cannon';
import { EnemyProjectileSpawner } from './enemy-projectile-spawner/enemy-projectile-spawner';
import { Rectangle } from './models/geometry/rectangle.interface';
import { BlasterProjectile } from './projectile/blaster-projectile';
import { Projectile } from './projectile/projectile';
import { isPointInsideIntervals } from './utils/is-point-inside-intervals';
import { toRadians } from './utils/to-radians';

export class Game {
  private _msFromStart = 0;
  private _allyProjectiles: BlasterProjectile[] = [];
  private _enemyProjectiles: BlasterProjectile[] = [];
  private _enemyProjectileSpawner: EnemyProjectileSpawner;

  private _cannons: Cannon[] = [
    new Cannon({
      barrelLength: 30,
      rotationRadians: toRadians(45),
      position: { x: 100, y: 100 },
      reloadingTimeMs: 2000,
      projectileOptions: {
        speed: 1000,
        color: 'rgb(0, 255, 0)',
        length: 50
      },
    }),
    new Cannon({
      barrelLength: 30,
      rotationRadians: toRadians(135),
      position: { x: 900, y: 100 },
      reloadingTimeMs: 2000,
      projectileOptions: {
        speed: 1000,
        color: 'rgb(0, 255, 0)',
        length: 50
      },
    }),
  ];

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

  public get msFromStart(): number {
    return this._msFromStart;
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

  public get base(): Base {
    return this._base;
  }

  public get baseModules(): BaseModule[] {
    return this.base.modules;
  }

  constructor() {
    this._enemyProjectileSpawner = new EnemyProjectileSpawner(
      this.base.modules.map(({ rectangle }) => rectangle),
      1,
      {
        length: 100,
        speed: 100,
        color: 'rgb(255, 128, 0)'
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

  public clearProjectilesOutside(borders: Rectangle): void {
    this._allyProjectiles = Game.getBlasterProjectilesInside(borders, this._allyProjectiles);
    this._enemyProjectiles = Game.getBlasterProjectilesInside(borders, this._enemyProjectiles);
  }

  public fire(): void {
    const newProjectiles = this._cannons.reduce<BlasterProjectile[]>((acc, cannon) => {
      return [...acc, cannon.fire()];
    }, []);

    this._allyProjectiles.push(...newProjectiles);
  }

  public update(ms: number): void {
    this._msFromStart += ms;

    this.moveProjectiles(ms);
    const newEnemyProjectiles = this._enemyProjectileSpawner.requestForSpawn(ms, this._msFromStart);
    if (newEnemyProjectiles) {
      this._enemyProjectiles.push(...newEnemyProjectiles);
    }
  }

  private moveProjectiles(ms: number): void {
    Game.moveProjectilesGroup(this._allyProjectiles, ms);
    Game.moveProjectilesGroup(this._enemyProjectiles, ms);
  }
}
