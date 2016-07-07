import {
  buildAstroids,
  buildBackground,
  buildDinosaurs,
  enableiOSKeyboardHack,
  rockSmash,
  squashDino
} from './shared';


function buildWelcomeText(game) {
  const text = game.add.image(game.width * 0.5, game.height * 0.35, 'Text');
  text.anchor.set(0.5);
  return text;
}

const numberOfAstroids = 5;
const numberOfDinosaurs = 3;

class Menu extends Phaser.State {
  constructor() {
    super();
  }

  create() {
    const { game } = this;

    this.ground = buildBackground(game);
    this.dinosaurs = buildDinosaurs(game, numberOfDinosaurs);
    this.astroids = buildAstroids(game, numberOfAstroids);
    this.text = buildWelcomeText(game);

    this.input.onDown.add(this.onInputDown, this);
    //  Capture all key presses
    this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);

    enableiOSKeyboardHack(this.game);
  }

  update() {
    const {dinosaurs, astroids, ground, physics} = this;

    dinosaurs.children.forEach(dino => {
      dino.scale.x = (dino.body.velocity.x > 0) ? 1 : -1;
    });

    physics.arcade.overlap(astroids, dinosaurs, (rock, dino) => {
      rockSmash(rock);
      squashDino(dino, true);
    });

    physics.arcade.overlap(astroids, ground, (rock) => {
      rockSmash(rock);
    });

    astroids.children.forEach(rock => {
      rock.text.x = rock.x;
      rock.text.y = rock.y;
    });
  }

  keyPress(char) {
    this.astroids.children.forEach(rock => {
      if(rock.character === char.toUpperCase()) {
        rockSmash(rock);
      }
    });
  }

  onInputDown () {
     this.game.state.start('game');
  }

}

export default Menu;
