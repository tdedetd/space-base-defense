import { Game } from '../../game';
import { ParticleSystem } from '../../particles/particle-system';
import { toRadians } from '../../utils/to-radians';
import { RenderLayerOptions } from '../models/render-layer-options.interface';
import { LayerRenderer } from './layer-renderer';
import { Measures } from './utils/measures';

export class EffectsLayerRenderer extends LayerRenderer {
  private particleSystem = new ParticleSystem();

  constructor(ctx: CanvasRenderingContext2D, game: Game, measures: Measures) {
    super(ctx, game, measures);

    this.game.events.listen('blasterProjectilesIntersect', ({ projectiles }) => {
      this.particleSystem.emit({
        angle: toRadians(45),
        angleAmplitude: toRadians(15),
        color: '#fa0',
        count: 10,
        lifetime: 4000,
        position: { x: 0, y: 0 },
        radius: 1,
        speed: {
          average: 500,
          deviation: 499,
        }
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

        // TODO: opacity
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
