import { Cannon } from '../../cannon/cannon';
import { Game } from '../../game';
import { Measures } from './utils/measures';
import { BlasterProjectile } from '../../projectile/blaster-projectile';
import { CoordinateSystemConverter } from '../../utils/coordinate-system-converter.class';
import { DebugRenderer } from './utils/debug-renderer';
import { LayerRenderer } from './layer-renderer';
import { RenderLayerOptions } from '../models/render-layer-options.interface';
import { UiRenderer } from './utils/ui-renderer';
import { clearContext } from '../utils/clear-context';

export class GameMainLayerRenderer extends LayerRenderer {
  private readonly debugRenderer: DebugRenderer;
  private readonly uiRenderer: UiRenderer;
  public displayDebug = true;

  constructor(ctx: CanvasRenderingContext2D, game: Game, measures: Measures) {
    super(ctx, game, measures);

    this.debugRenderer = new DebugRenderer(this.ctx, this.measures);
    this.uiRenderer = new UiRenderer(this.ctx, this.measures);
  }

  public render({ activeScenePosition, pause, msDiff }: RenderLayerOptions): void {
    clearContext(this.ctx);

    this.renderBlasterProjectiles(this.game.enemyProjectiles);
    this.renderBlasterProjectiles(this.game.allyProjectiles);
    this.renderCannons(this.game.cannons);

    this.uiRenderer.render(this.game);

    if (this.displayDebug) {
      this.debugRenderer.render(this.game, activeScenePosition, pause, msDiff);
    }
  }

  private renderBlasterProjectiles(projectiles: BlasterProjectile[]): void {
    projectiles.forEach((projectile) => {
      const line = projectile.getLine();
      const point1Px = this.measures.convertPointToPx(line[0]);
      const point2Px = this.measures.convertPointToPx(line[1]);

      this.ctx.strokeStyle = projectile.color;
      this.ctx.beginPath();
      this.ctx.moveTo(point1Px.x, point1Px.y);
      this.ctx.lineTo(point2Px.x, point2Px.y);
      this.ctx.stroke();
    });
  }

  private renderCannons(cannons: Cannon[]): void {
    cannons.forEach((cannon) => {
      const point2 = CoordinateSystemConverter.toCartesian(
        {
          radians: cannon.rotationRadians,
          radius: cannon.barrelLength,
        },
        cannon.position
      );
      const point1Px = this.measures.convertPointToPx(cannon.position);
      const point2Px = this.measures.convertPointToPx(point2);

      this.ctx.strokeStyle = '#d19c13';
      this.ctx.beginPath();
      this.ctx.moveTo(point1Px.x, point1Px.y);
      this.ctx.lineTo(point2Px.x, point2Px.y);
      this.ctx.stroke();
    });
  }

  public toggleDisplayDebug(): void {
    this.displayDebug = !this.displayDebug;
  }
}
