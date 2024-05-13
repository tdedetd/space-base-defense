import { BlasterProjectileOptions } from './blaster-projectile-options.interface';

export type BlasterProjectileCharacteristics = Pick<BlasterProjectileOptions, 'color' | 'speed' | 'length'>;
