import { Game } from './game';
import { GameRenderer } from './render/game-renderer';
import { Tick } from './tick';
import { initDomEvents } from './dom/dom-events';
import { getHtmlElement } from './dom/get-html-element';

document.addEventListener('DOMContentLoaded', (event) => {
  const container = getHtmlElement<HTMLDivElement>('container');
  const fullscreenButton = getHtmlElement<HTMLButtonElement>('fullscreen-button');

  const game = new Game();
  const gameRenderer = new GameRenderer({
    mainStatic: getHtmlElement<HTMLCanvasElement>('canvas-main-static'),
    main: getHtmlElement<HTMLCanvasElement>('canvas-main'),
  }, game, container);

  gameRenderer.updateSceneMeasures();

  initDomEvents({ container, game, gameRenderer, fullscreenButton });

  const tick = new Tick();
  tick.run(event.timeStamp);
  tick.setGameRenderer(gameRenderer);
});
