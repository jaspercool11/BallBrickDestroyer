import { Game } from './Game';
import './style.css';
// Optional styling
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game('gameCanvas');
  game.start();
});