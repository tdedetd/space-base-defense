import { Game } from './game';
import { GameRenderer } from './render/game-renderer';
import { Tick } from './tick';
import { initDomEvents } from './dom/dom-events';
import { getHtmlElement } from './dom/get-html-element';
import { levelDefault } from './level/const/level-default';

document.addEventListener('DOMContentLoaded', (event) => {
  const container = getHtmlElement<HTMLDivElement>('container');
  const fullscreenButton = getHtmlElement<HTMLButtonElement>('fullscreen-button');

  const game = new Game(levelDefault);
  const gameRenderer = new GameRenderer({
    effects: getHtmlElement<HTMLCanvasElement>('layer-effects'),
    mainStatic: getHtmlElement<HTMLCanvasElement>('layer-main-static'),
    main: getHtmlElement<HTMLCanvasElement>('layer-main'),
  }, game, container);

  gameRenderer.updateSceneMeasures();

  initDomEvents({ container, game, gameRenderer, fullscreenButton });

  const tick = new Tick();
  tick.run(event.timeStamp);
  tick.setGameRenderer(gameRenderer);
});
