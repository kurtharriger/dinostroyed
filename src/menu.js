const dinoVelocity = 400;
const dinoY = 650;

class Menu extends Phaser.State {

  create() {
    this.stage.backgroundColor = '000';
    this.background = this.add.image(0, 0, 'Background');
    this.ground = this.buildGround();

    this.dino = this.buildDinosaur();
    this.astroids = this.buildAstroids();

    this.text = this.add.image(this.game.width * 0.5, this.game.height * 0.35, 'Text');
    this.text.anchor.set(0.5);

    this.input.onDown.add(this.onInputDown, this);
  }

  onInputDown () {
    this.game.state.start('game');
  }

  buildGround() {
    const height = 100;
    const groundColor = "#8C6239"

    const { game, world, physics } = this;
    const bitmapData = this.add.bitmapData(world.width, height);
    bitmapData.ctx.beginPath();
    bitmapData.ctx.rect(0,0, world.width, height);
    bitmapData.ctx.fillStyle = groundColor;
    bitmapData.ctx.fill();

    const ground = this.add.group();
    const dirt = ground.create(0, world.height - height, bitmapData);

    physics.arcade.enable(dirt);
    dirt.enableBody = true;
    dirt.body.immovable = true;

    return ground;
  }

  buildDinosaur() {
    const {physics, add} = this;

    const dino = add.sprite(80+64, dinoY, 'Dinosaur');
    dino.anchor.set(0.5);
    dino.animations.add('Run', [0,1], 4, true);
    dino.animations.play('Run');

    dino.mydirection = 1;
    dino.scale.x = dino.mydirection;

    physics.arcade.enable(dino);

    dino.enableBody = true;
    dino.body.velocity.x = dinoVelocity;
    dino.body.collideWorldBounds = true;
    dino.body.bounce.set(1);

    return dino;
  }

  buildAstroids () {

    const {
      totalRocks = 20,
      world: {width},
      rnd,
      physics,
      ground,
      dino
    } = this;

    const rockGroup = this.add.group();
    for(let i = 0; i < totalRocks; ++i) {
      const {xpos, ypos, scale, speed} = this.randomRockParameters();

      const rock = rockGroup.create(xpos, ypos, 'Astroid');
      rock.enableBody = true;
      physics.arcade.enable(rock);
      rock.scale.x = scale;
      rock.scale.y = scale;
      rock.body.velocity.y = speed;

      rock.smash = this.buildSmash(scale);
    }


    return rockGroup;
  }

  randomRockParameters () {
    const { rnd, world: {width}} = this;
    return {
      xpos: rnd.integerInRange(0, width),
      ypos: rnd.integerInRange(-1500, 0),
      scale: rnd.realInRange(0.5, 1),
      speed: rnd.integerInRange(100, 300)
    }
  }

  buildSmash(scale) {
    const smash = this.add.emitter(0, 0, 10);
    smash.minParticleScale = 0.1*scale;
    smash.maxParticleScale = 0.3*scale;
    smash.minParticleSpeed.setTo(-30, 30);
    smash.maxParticleSpeed.setTo(30, -30);
    smash.makeParticles('Astroid');
    return smash;
  }
  update() {
    const {dino, astroids, ground, physics} = this;

    dino.scale.x = (dino.body.velocity.x > 0) ? 1 : -1;

    this.physics.arcade.overlap(astroids, dino, () => {
      this.squashDino(dino);
    });

    this.physics.arcade.overlap(astroids, ground, (rock) => {
      this.rockSmash(rock);
    });
  }

  squashDino(dino) {
    if(dino.squashed) return;
    console.log('squashing');
    dino.squashed = true;

    const originalY =  dino.y;
    const originalScale = dino.scale;
    const originalVelocity = dino.body.velocity.x;

    // this.dino.body.velocity.x = this.dino.body.velocity.x * 0.8;
    // this.add.tween(dino).to({y:dino.y+50}, 200, Phaser.Easing.Linear.None, true);
    // this.add.tween(dino.scale).to({y:0}, 100, Phaser.Easing.Linear.None, true);
    dino.kill();
    const timer = this.time.create(true);

    timer.add(5000, () => {
      dino.revive();
      // dino.body.velocity.x = originalVelocity;
      // for some reason this causes a stack overflow
      // dino.scale.y = originalScale;
      // dino.y = originalY;
      dino.squashed = false;
    });
    timer.start();
  }

  rockSmash(rock) {

    rock.smash.emitX = rock.x;
    rock.smash.emitY = rock.bottom;
    rock.smash.start(true, 1000, null, 20);
    
    const {xpos, ypos, scale, speed} = this.randomRockParameters();
    rock.reset(xpos,ypos);
    rock.scale.x = scale;
    rock.scale.y = scale;
    rock.body.velocity.y = speed;

  }

}

export default Menu;
