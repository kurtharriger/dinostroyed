
export function enableiOSKeyboardHack(game) {
  // crappy hack to get keyboard to work on ios
  if(game.device.iOS) {
    var inputField = global.document.createElement("input");
    inputField.type = "text";
    inputField.style.cssText = "position:absolute; left:0; top: 0; width:100%; height:100%; opacity:0; cursor: none";

    global.document.getElementById('dinostroyed-game').appendChild(inputField);
    inputField.addEventListener('focus', () => {
       inputField.style.cssText = "position:absolute; left:0; top: 0; width:100%; height:1px; opacity:0; cursor: none";
    });
  }
}

export function buildBackground(game) {
  const height = 100;
  const groundColor = "#8C6239"
  const { world, physics } = game;

  game.stage.backgroundColor = '000';

  const bitmapData = game.add.bitmapData(world.width, height);
  bitmapData.ctx.beginPath();
  bitmapData.ctx.rect(0,0, world.width, height);
  bitmapData.ctx.fillStyle = groundColor;
  bitmapData.ctx.fill();

  const ground = game.add.group();
  const dirt = ground.create(0, world.height - height, bitmapData);
  physics.arcade.enable(dirt);
  dirt.enableBody = true;
  dirt.body.immovable = true;

  game.add.image(0, 0, 'Background');

  return ground;
}

export function buildDinosaurs(game, count = 5) {
  const dinosaurs = game.add.group();
  for(let i = 0; i < count; ++i) {
    buildDinosaur(game, dinosaurs);
  }
  return dinosaurs;
}

function buildDinosaur(game, group) {
  const dinoY = 650;
  const {physics, world: {width}} = game;
  const dinoVelocity = game.rnd.integerInRange(200, 500);
  const dino = group.create(0, dinoY, 'Dinosaur');
  dino.anchor.set(0.5);
  dino.animations.add('Run', [0,1], 4, true);
  dino.animations.play('Run');

  dino.x = game.rnd.integerInRange(dino.width / 2, width - dino.width / 2);
  dino.mydirection = 1;
  dino.scale.x = dino.mydirection;

  physics.arcade.enable(dino);

  dino.enableBody = true;
  dino.body.velocity.x = dinoVelocity;
  dino.body.collideWorldBounds = true;
  dino.body.bounce.set(1);

  return dino;
}

export function buildAstroids(game, totalRocks) {
  const {
    world: {width},
    rnd,
    physics,
    ground,
    dino
  } = game;

  const rockGroup = game.add.group();
  for(let i = 0; i < totalRocks; ++i) {
    const {xpos, ypos, scale, speed, character} = randomRockParameters(game);

    const rock = rockGroup.create(xpos, ypos, 'Astroid');
    rock.anchor.set(0.5, 0.6);
    rock.enableBody = true;
    physics.arcade.enable(rock);

    rock.scale.x = scale;
    rock.scale.y = scale;
    rock.initialVelocity = speed;
    rock.character = character;

    rock.text = game.add.text(rock.centerX, rock.centerY, rock.character, {
      font: "28px Arial",
      fill: "#FFF",
      align: "center"
    });
    rock.text.anchor.set(0.5);
    rock.smash = buildSmash(game, scale);
  }
  return rockGroup;
}
export function updateAstroidVelocities(astroids, percentage) {
  astroids.children.forEach(rock => {
    rock.body.velocity.y = rock.initialVelocity * percentage;
  });
}

function randomRockParameters(game) {
  const { rnd, world: {width}} = game;
  return {
    xpos: rnd.integerInRange(0, width),
    ypos: rnd.integerInRange(-100, 0),
    scale: rnd.realInRange(0.7, 1),
    speed: rnd.integerInRange(10, 15),
    character: String.fromCharCode('A'.charCodeAt() + rnd.integerInRange(0, 25))
  }
}

function buildSmash(game, scale) {
  const smash = game.add.emitter(0, 0, 10);
  smash.minParticleScale = 0.1*scale;
  smash.maxParticleScale = 0.3*scale;
  smash.minParticleSpeed.setTo(-30, 30);
  smash.maxParticleSpeed.setTo(30, -30);
  smash.makeParticles('Astroid');
  return smash;
}

export function rockSmash(rock) {
  rock.smash.emitX = rock.x;
  rock.smash.emitY = rock.bottom;
  rock.smash.start(true, 1000, null, 20);

  respawnRock(rock);
}
export function respawnRock(rock) {
  const {xpos, ypos, scale, speed, character} = randomRockParameters(rock.game);
  rock.reset(xpos,ypos);
  rock.scale.x = scale;
  rock.scale.y = scale;
  rock.initialVelocity = speed;
  rock.character = character;
  rock.text.setText(rock.character);
}

export function respawnDinosaur(dino) {
  const game = dino.game;
  dino.x = game.rnd.integerInRange(dino.width / 2, game.world.width - dino.width / 2 )
  dino.revive();
  dino.killedTime = null;
}

export function squashDino(dino) {
  const game = dino.game;
  if(dino.killedTime) return;

  dino.kill();
  dino.killedTime = game.time.totalElapsedSeconds();
}
