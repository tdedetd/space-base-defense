import { Cannon } from './cannon/cannon';
import { BlasterProjectile } from './projectile/blaster-projectile';
import { Projectile } from './projectile/projectile';

export class Game {
  private _allyProjectiles: BlasterProjectile[] = [];
  private _enemyProjectiles: BlasterProjectile[] = [];
  private _cannon = new Cannon({
    barrelLength: 30,
    position: { x: 100, y: 100 },
    reloadingTimeMs: 2000,
    rotationRadians: 15,
    projectileOptions: {
      speed: 400,
      color: 'rgb(255, 100, 100)',
      length: 25
    },
  });

  public get allyProjectiles(): BlasterProjectile[] {
    return this._allyProjectiles;
  }

  public get enemyProjectiles(): BlasterProjectile[] {
    return this._enemyProjectiles;
  }

  public get cannon(): Cannon {
    return this._cannon;
  }

  public fire(): void {
    this._allyProjectiles.push(
      this._cannon.fire()
    );
  }

  private static moveProjectilesGroup(projectiles: Projectile[], ms: number): void {
    projectiles.forEach(projectile => {
      projectile.move(ms);
    });
  }

  public moveProjectiles(ms: number): void {
    Game.moveProjectilesGroup(this._allyProjectiles, ms);
    Game.moveProjectilesGroup(this._enemyProjectiles, ms);
  }

  public setCannonRotation(radians: number): void {
    this._cannon.setRotation(radians);
  }
}
