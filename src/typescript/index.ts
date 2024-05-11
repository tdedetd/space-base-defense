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
  const gameRenderer = new GameRenderer(gameCanvas, game);

  containerOnClick(container, game);
  containerOnMousemove(container, gameRenderer, game);
  windowOnKeydown(gameRenderer, game);
  windowOnResize(gameRenderer);

  gameRenderer.updateSceneMeasures();

  const tick = new Tick();
  tick.run(event.timeStamp);
  tick.setGameRenderer(gameRenderer);
});

function containerOnClick(container: HTMLDivElement, game: Game): void {
  container.addEventListener('click', () => {
    game.fire();
  });
}

function containerOnMousemove(
  container: HTMLDivElement,
  gameRenderer: GameRenderer,
  game: Game,
): void {
  container.addEventListener('mousemove', (event) => {
    gameRenderer.rotateCannon(event.offsetX, event.offsetY, game);
  });
}

function windowOnKeydown(gameRenderer: GameRenderer, game: Game): void {
  window.addEventListener('keydown', (event) => {
    if (['f', 'а'].includes(event.key.toLowerCase())) {
      game.fire();
    }

    if (['d', 'в'].includes(event.key.toLowerCase())) {
      gameRenderer.toggleDisplayDebug();
    }
  });
}

function windowOnResize(gameRenderer: GameRenderer): void {
  window.addEventListener('resize', () => {
    gameRenderer.updateSceneMeasures();
  });
}
