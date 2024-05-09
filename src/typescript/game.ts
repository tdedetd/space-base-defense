import { BlasterProjectile } from './projectile/blaster-projectile';
import { Projectile } from './projectile/projectile';

export class Game {
  public readonly mapLength = 500;

  private _allyProjectiles: BlasterProjectile[] = [];
  private _enemyProjectiles: BlasterProjectile[] = [];

  public get allyProjectiles(): BlasterProjectile[] {
    return this._allyProjectiles;
  }

  public get enemyProjectiles(): BlasterProjectile[] {
    return this._enemyProjectiles;
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
}
