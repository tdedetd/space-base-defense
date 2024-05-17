import { DomEventsOptions } from './models/dom-events-options.interface';

export function initDomEvents(domEventsOptions: DomEventsOptions): void {
  const uiFunctions: ((domEventsOptions: DomEventsOptions) => void)[] = [
    containerOnMousedown,
    containerOnMouseup,
    containerOnMousemove,
    fullscreenButtonClick,
    windowOnKeydown,
    windowOnKeyup,
    windowOnResize
  ];

  uiFunctions.forEach((func) => {
    func(domEventsOptions);
  });
}

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

function fullscreenButtonClick({ container, fullscreenButton }: DomEventsOptions): void {
  fullscreenButton.addEventListener('click', () => {
    container.requestFullscreen();
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
