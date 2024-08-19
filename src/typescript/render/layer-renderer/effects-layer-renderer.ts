import { Game } from '../../game';
import { ParticleSystem } from '../../particles/particle-system';
import { getDistance } from '../../utils/get-distance';
import { toRadians } from '../../utils/to-radians';
import { RenderLayerOptions } from '../models/render-layer-options.interface';
import { LayerRenderer } from './layer-renderer';
import { Measures } from './utils/measures';

export class EffectsLayerRenderer extends LayerRenderer {
  private particleSystem = new ParticleSystem();

  constructor(ctx: CanvasRenderingContext2D, game: Game, measures: Measures) {
    super(ctx, game, measures);

    this.game.events.listen('blasterProjectilesIntersect', ({ projectiles }) => {
      projectiles.forEach((projectile) => {
        const line = projectile.getLine();
        const lineLength = getDistance(line[0], line[1]);
        const lifetime = 2000;

        this.particleSystem.emit({
          angle: projectile.position.radians + (projectile.direction === 'fromCenter' ? 0 : Math.PI),
          angleAmplitude: toRadians(25),
          color: projectile.color,
          count: Math.round(lineLength / 10),
          lifetime,
          spawnPosition: line,
          radius: 1,
          speed: {
            average: projectile.getSpeed(),
            deviation: 10,
          },
          opacity: (age) => (1 - age / lifetime) * 0.8,
        });
      });
    });
  }

  public render({ pause, msDiff }: RenderLayerOptions): void {
    if (!pause) {
      this.clearContext();
      this.particleSystem.update(msDiff);
      this.renderParticles();
    }
  }

  private renderParticles(): void {
    this.particleSystem.particles
      .filter((particle) => !particle.isDead())
      .forEach((particle) => {
        const position = this.measures.convertPointToPx(particle.getPosition());
        const radius = this.measures.convertSizeToPx(particle.radius);

        this.ctx.globalAlpha = particle.getOpacity();
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.ellipse(
          position.x,
          position.y,
          radius,
          radius,
          0, 0, Math.PI * 2
        );
        this.ctx.closePath();
        this.ctx.fill();
      });
  }
}
