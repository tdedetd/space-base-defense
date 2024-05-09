import { Game } from './game';
import { GameRenderer } from './game-renderer';
import { Tick } from './tick';

document.addEventListener('DOMContentLoaded', (event) => {
  const gameCanvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
  if (!gameCanvas) {
    throw new Error('game-canvas element not found');
  }

  const gameRenderer = new GameRenderer(gameCanvas);
  handleWindowResize(gameRenderer);

  const tick = new Tick(gameRenderer);
  tick.run(event.timeStamp);
  tick.setGame(new Game());
});

function handleWindowResize(gameRenderer: GameRenderer): void {
  window.addEventListener('resize', () => {
    gameRenderer.updateSceneMeasures();
  });
  gameRenderer.updateSceneMeasures();
}
