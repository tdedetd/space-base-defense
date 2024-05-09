import { Game } from './game';
import { BlasterProjectile } from './projectile/blaster-projectile';
import { CoordinateSystemConverter } from './utils/coordinate-system-converter.class';

export class GameRenderer {
  private readonly aspectRatio = 3 / 4;
  private readonly ctx: CanvasRenderingContext2D;

  constructor(private readonly container: HTMLCanvasElement) {
    this.container.width = this.container.clientWidth;
    this.container.height = this.container.clientHeight;

    const ctx = this.container.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get context 2d');
    }
    this.ctx = ctx;
  }

  public render(game: Game): void {
    this.ctx.clearRect(0, 0, this.container.width, this.container.height);
    this.renderBlasterProjectiles(game.allyProjectiles);
    this.renderBlasterProjectiles(game.enemyProjectiles);
  }

  private renderBlasterProjectiles(projectiles: BlasterProjectile[]): void {
    projectiles.forEach((projectile) => {
      const point1 = CoordinateSystemConverter.toCartesian(projectile.position, projectile.origin);
      const point2 = CoordinateSystemConverter.toCartesian({
        radians: projectile.position.radians,
        radius: projectile.position.radius + (
          projectile.direction === 'fromCenter' ? -projectile.length : projectile.length
        ),
      }, projectile.origin);

      this.ctx.strokeStyle = projectile.color;
      this.ctx.beginPath();
      this.ctx.moveTo(point1.x, point1.y);
      this.ctx.lineTo(point2.x, point2.y);
      this.ctx.stroke();
    });
  }
}
