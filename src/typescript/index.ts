import { Game } from './game';
import { GameRenderer } from './game-renderer';
import { DomEventsOptions } from './models/dom-events-options.interface';
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

  const domEventsOptions: DomEventsOptions = { container, game, gameRenderer };
  const uiFunctions: ((domEventsOptions: DomEventsOptions) => void)[] = [
    containerOnClick,
    containerOnMousemove,
    windowOnKeydown,
    windowOnResize
  ];

  uiFunctions.forEach((func) => {
    func(domEventsOptions);
  });

  gameRenderer.updateSceneMeasures();

  const tick = new Tick();
  tick.run(event.timeStamp);
  tick.setGameRenderer(gameRenderer);
});

function containerOnClick({ container, gameRenderer, game }: DomEventsOptions): void {
  container.addEventListener('click', () => {
    if (!gameRenderer.pause) {
      game.fire();
    }
  });
}

function containerOnMousemove({ container, gameRenderer }: DomEventsOptions): void {
  container.addEventListener('mousemove', (event) => {
    gameRenderer.setActiveScenePosition(event.offsetX, event.offsetY);
    gameRenderer.updateCannonRotation();
  });
}

function windowOnKeydown({ gameRenderer, game }: DomEventsOptions): void {
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

function windowOnResize({ gameRenderer }: DomEventsOptions): void {
  window.addEventListener('resize', () => {
    gameRenderer.updateSceneMeasures();
  });
}
