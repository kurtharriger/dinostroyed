import {
  buildAstroids,
  buildBackground,
  buildDinosaurs,
  enableiOSKeyboardHack,
  respawnDinosaur,
  respawnRock,
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

    this.playing = false;
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
    const {game, dinosaurs, astroids, ground, physics} = this;

    dinosaurs.children.forEach(dino => {
      if(dino.killedTime && !this.playing) {
         if(game.time.totalElapsedSeconds() > dino.killedTime + 5) {
           respawnDinosaur(dino);
         }
      } else {
        dino.scale.x = (dino.body.velocity.x > 0) ? 1 : -1;
      }
    });

    physics.arcade.overlap(astroids, dinosaurs, (rock, dino) => {
      rockSmash(rock);
      squashDino(dino);
    });

    physics.arcade.overlap(astroids, ground, (rock) => {
      rockSmash(rock);
    });

    astroids.children.forEach(rock => {
      rock.text.x = rock.x;
      rock.text.y = rock.y;
    });

    let stillAlive = false;
    dinosaurs.children.forEach(dino => {
        if(!dino.killedTime) stillAlive = true;
    });
    if(!stillAlive) this.endGame();
  }

  keyPress(char) {
    if(char === ' ') {
      this.startGame();
    }
    this.astroids.children.forEach(rock => {
      if(rock.character === char.toUpperCase()) {
        rockSmash(rock);
      }
    });
  }

  onInputDown () {
    this.startGame();
  }

  startGame() {
    this.playing = true;
    this.dinosaurs.children.forEach(respawnDinosaur);
    this.astroids.children.forEach(respawnRock);
    this.text.kill();
  }

  endGame() {
    this.playing = false;
    this.dinosaurs.children.forEach(respawnDinosaur);
    this.astroids.children.forEach(respawnRock);
    this.text.revive();
  }

}

export default Menu;
