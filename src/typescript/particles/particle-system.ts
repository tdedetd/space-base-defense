import { getRandomPointBetween } from '../utils/get-random-point-between';
import { Random } from '../utils/random';
import { ParticlesEmitOptions } from './models/particles-emit-options.interface';
import { Particle } from './particle';

export class ParticleSystem {
  private _particles: Particle[] = [];

  public get particles(): Particle[] {
    return this._particles;
  }

  public emit(options: ParticlesEmitOptions): void {
    const newParticles: Particle[] = [];

    for (let i = 0; i < options.count; i++) {
      const particle = new Particle({
        lifetime: typeof options.lifetime === 'number'
          ? options.lifetime
          : Random.interval(options.lifetime[0], options.lifetime[1]),
        origin: 'x' in options.spawnPosition
          ? options.spawnPosition
          : getRandomPointBetween(...options.spawnPosition),
        position: {
          radians: options.angle + (
            typeof options.angleAmplitude === 'undefined' ? 0 : Random.interval(-options.angleAmplitude, options.angleAmplitude)
          ),
          radius: 0,
        },
        radius: options.radius,
        speed: options.speed.average + (
          options.speed.deviation ? Random.interval(-options.speed.deviation, options.speed.deviation) : 0
        ),
        color: options.color,
        opacity: options.opacity,
      });
      newParticles.push(particle);
    }

    this.particles.push(...newParticles);
  }

  public update(ms: number): void {
    const particlesToClear: typeof this._particles = [];

    this._particles.forEach((particle) => {
      particle.move(ms);
      if (particle.isDead()) {
        particlesToClear.push(particle);
      }
    });

    this._particles = this._particles.filter((particle) => {
      return !particlesToClear.includes(particle);
    });
  }
}
