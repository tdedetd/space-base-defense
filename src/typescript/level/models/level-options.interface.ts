import { CannonOptions } from '../../cannon/models/cannon-options.interface';
import { Rectangle } from '../../models/geometry/rectangle.interface';
import { TimestampToNumberFunction } from '../../models/timestamp-to-number-function.type';
import { BlasterProjectileCharacteristics } from '../../projectile/models/blaster-projectile-characteristics.type';
import { StaticShieldOptions } from '../../shield/models/static-shield-options.type';

export interface LevelOptions {
  baseModules?: Rectangle[];
  cannons: CannonOptions[];
  enemyProjectile: {
    frequency: number | TimestampToNumberFunction;
    options: BlasterProjectileCharacteristics;
  };
  staticShields?: StaticShieldOptions[];
}
