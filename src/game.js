import {
  buildAstroids,
  buildBackground,
  buildDinosaurs,
  enableiOSKeyboardHack,
  respawnDinosaur,
  respawnRock,
  rockSmash,
  squashDino,
  updateAstroidVelocities
} from './shared';


function buildWelcomeText(game) {
  const text = game.add.image(game.width * 0.5, game.height * 0.35, 'Text');
  text.anchor.set(0.5);
  return text;
}

const numberOfAstroids = 5;
const numberOfDinosaurs = 3;

class Game extends Phaser.State {
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

    this.lastDurationText = game.add.text(
      game.world.centerX,
      game.world.centerY * 1.2, '', {
      font: "28px Arial",
      fill: "#FFF",
      align: "center"
    });
    this.lastDurationText.anchor.set(0.5);
    this.lastDurationText.kill();



    this.input.onDown.add(this.onInputDown, this);
    //  Capture all key presses
    this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);


    this.astroids.children.forEach(rock => {
      rock.inputEnabled = true;
      rock.events.onInputDown.add(rock => {
        this.keysPressed++;
        rockSmash(rock);

      });

    });
    enableiOSKeyboardHack(this.game);

    const github = this.add.image(960, 700, 'Github');
    github.inputEnabled = true;
    github.events.onInputDown.add(() => {
      window.open('https://github.com/kurtharriger/dinostroyed');
    });

    this.reset();
  }

  update() {
    const {game, dinosaurs, astroids, ground, physics} = this;

    this.adjustDifficulty();

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
    if(!this.playing && char === ' ') {
      this.startGame();
    } else {
      this.keysPressed++;
      this.astroids.children.forEach(rock => {
        if(rock.character === char.toUpperCase()) {
          rockSmash(rock);
        }
      });
    }
  }

  onInputDown () {
    const { playing } = this;
    if(!this.playing) this.startGame();
  }

  reset() {
    const { dinosaurs, astroids } = this;

    dinosaurs.children.forEach(respawnDinosaur);
    astroids.children.forEach(respawnRock);
  }

  startGame() {
    const { game: { time } } = this;
    this.playing = true;
    this.startTime = time.totalElapsedSeconds();
    this.keysPressed = 0;
    this.text.kill();
    this.lastDurationText.kill();
    this.reset();
  }

  endGame() {
    const {game: {time}, startTime} = this;
    this.playing = false;
    this.lastDuration = time.totalElapsedSeconds() - startTime;
    this.lastDurationText.setText('You survived ' + this.lastDuration.toFixed(2) + ' seconds!');
    this.lastDurationText.revive();
    this.text.revive();
    this.lastDurationText.revive();
    this.reset();
  }

  adjustDifficulty() {
    const {playing, astroids, game: {time}, startTime} = this;

    // increase the velocity of the astroids based on the duration of play
    // demo screen speed should be faster than inital game play
    const percentageIncrease = !playing ? 3.0 : Math.pow(1.02, this.keysPressed);
    updateAstroidVelocities(astroids, percentageIncrease);
  }
}

export default Game;
