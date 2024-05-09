import { Game } from './game';
import { Tick } from './tick';

document.addEventListener('DOMContentLoaded', () => {
  const gameCanvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
  if (!gameCanvas) {
    throw new Error('game-canvas element not found');
  }

  const tick = new Tick(gameCanvas);
  tick.run();
  tick.setGame(new Game());
});
