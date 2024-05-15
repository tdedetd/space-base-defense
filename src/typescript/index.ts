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
    containerOnMousedown,
    containerOnMouseup,
    containerOnMousemove,
    windowOnKeydown,
    windowOnKeyup,
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

function containerOnMousedown({ container, game, gameRenderer }: DomEventsOptions): void {
  container.addEventListener('mousedown', (event) => {
    if (event.button === 0 && !gameRenderer.pause) {
      game.fire();
      game.activateCannons();
    }
  });
}

function containerOnMouseup({ container, game }: DomEventsOptions): void {
  container.addEventListener('mouseup', (event) => {
    if (event.button === 0) {
      game.deactivateCannons();
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
    if (['f', 'а'].includes(event.key.toLowerCase()) && !gameRenderer.pause) {
      game.activateCannons();
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

function windowOnKeyup({ game }: DomEventsOptions): void {
  window.addEventListener('keyup', (event) => {
    if (['f', 'а'].includes(event.key.toLowerCase())) {
      game.deactivateCannons();
    }
  });
}

function windowOnResize({ gameRenderer }: DomEventsOptions): void {
  window.addEventListener('resize', () => {
    gameRenderer.updateSceneMeasures();
  });
}
