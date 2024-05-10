import { Game } from './game';
import { GameRenderer } from './game-renderer';
import { Tick } from './tick';

document.addEventListener('DOMContentLoaded', (event) => {
  const gameCanvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
  if (!gameCanvas) {
    throw new Error('game-canvas element not found');
  }

  const container = document.querySelector<HTMLDivElement>('#container');
  if (!container) {
    throw new Error('container element not found');
  }

  const game = new Game();
  const gameRenderer = new GameRenderer(gameCanvas);

  updateSceneMeasuresOnResize(gameRenderer);
  rotateCannonOnMousemove(container, gameRenderer, game);
  fireOnClick(container, game);

  const tick = new Tick(gameRenderer);
  tick.run(event.timeStamp);
  tick.setGame(game);
});

function fireOnClick(container: HTMLDivElement, game: Game): void {
  container.addEventListener('click', () => {
    game.fire();
  });

  window.addEventListener('keydown', (event) => {
    if (['f', 'а'].includes(event.key.toLowerCase())) {
      game.fire();
    }
  });
}

function rotateCannonOnMousemove(
  container: HTMLDivElement,
  gameRenderer: GameRenderer,
  game: Game,
): void {
  container.addEventListener('mousemove', (event) => {
    gameRenderer.rotateCannon(event.offsetX, event.offsetY, game);
  });
}

function updateSceneMeasuresOnResize(gameRenderer: GameRenderer): void {
  window.addEventListener('resize', () => {
    gameRenderer.updateSceneMeasures();
  });
  gameRenderer.updateSceneMeasures();
}
