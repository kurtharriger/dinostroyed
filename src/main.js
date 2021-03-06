import Boot from './boot';
import Game from './game';
import Preloader from './preloader';

const game = new Phaser.Game(1024, 768, Phaser.AUTO, 'dinostroyed-game');
game.state.add('boot', new Boot());
game.state.add('preloader', new Preloader());
game.state.add('game', new Game());
game.state.start('boot');
