class Menu extends Phaser.State {

  create() {

    this.background = this.add.image(0, 0, 'Background');


    this.dino = this.buildDinosaur();
    this.astroids = this.buildAstroids();
    // this.astroid = this.add.sprite(80+64, 50, 'Astroid');
    // this.astroid.anchor.set(0.5);


    this.text = this.add.image(this.game.width * 0.5, this.game.height * 0.5, 'Text');
    this.text.anchor.set(0.5);

    this.input.onDown.add(this.onInputDown, this);
  }

  update() {

  }

  onInputDown () {
    this.game.state.start('game');
  }

  buildDinosaur() {
    const {physics, add} = this;

    const dino = add.sprite(80+64, 650, 'Dinosaur');
    dino.anchor.set(0.5);
    dino.animations.add('Run', [0,1], 4, true);
    dino.animations.play('Run');

    dino.mydirection = 1;
    dino.scale.x = dino.mydirection;

    physics.arcade.enable(dino);
    dino.enableBody = true;
    dino.body.velocity.x = 60 * dino.mydirection;

    return dino;
  }

  buildAstroids () {

    const {
      totalRocks = 10,
      world: {width},
      rnd,
      physics
    } = this;

    const rockGroup = this.add.group();
    for(let i = 0; i < totalRocks; ++i) {
      const xpos = rnd.integerInRange(0, width);
      const ypos = 0; rnd.integerInRange(-1500, 0);
      const scale = rnd.realInRange(0.3, 1);
      const speed = rnd.integerInRange(100, 300);

      const rock = rockGroup.create(xpos, ypos, 'Astroid');
      rock.scale.x = scale;
      rock.scale.y = scale;
      rock.enableBody = true;

      physics.enable(rock);
      rock.body.velocity.y = speed;
    }
    return rockGroup;
  }

}

export default Menu;
