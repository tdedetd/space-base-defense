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

  containerOnClick(container, game, gameRenderer);
  containerOnMousemove(container, gameRenderer);
  windowOnKeydown(gameRenderer, game);
  windowOnResize(gameRenderer);

  gameRenderer.updateSceneMeasures();

  const tick = new Tick();
  tick.run(event.timeStamp);
  tick.setGameRenderer(gameRenderer);
});

function containerOnClick(container: HTMLDivElement, game: Game, gameRenderer: GameRenderer): void {
  container.addEventListener('click', () => {
    if (!gameRenderer.pause) {
      game.fire();
    }
  });
}

function containerOnMousemove(container: HTMLDivElement, gameRenderer: GameRenderer): void {
  container.addEventListener('mousemove', (event) => {
    gameRenderer.setActiveScenePosition(event.offsetX, event.offsetY);
    gameRenderer.updateCannonRotation();
  });
}

function windowOnKeydown(gameRenderer: GameRenderer, game: Game): void {
  window.addEventListener('keydown', (event) => {
    if (['f', 'а'].includes(event.key.toLowerCase())) {
      if (!gameRenderer.pause) {
        game.fire();
      }
    }

    if (['d', 'в'].includes(event.key.toLowerCase())) {
      gameRenderer.toggleDisplayDebug();
    }

    if (event.key === 'Escape') {
      gameRenderer.togglePause();

      if (!gameRenderer.pause) {
        gameRenderer.updateCannonRotation();
      }
    }
  });
}

function windowOnResize(gameRenderer: GameRenderer): void {
  window.addEventListener('resize', () => {
    gameRenderer.updateSceneMeasures();
  });
}
