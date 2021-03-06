class Preloader extends Phaser.State {

  constructor() {
    super();
    this.asset = null;
    this.ready = false;
  }

  preload() {
    this.asset = this.add.sprite(this.game.width * 0.5 - 110, this.game.height * 0.5 - 10, 'preloader');
    this.load.setPreloadSprite(this.asset);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.loadResources();
  }

  loadResources() {
    this.load.image('Background', 'assets/Background.png');
    this.load.spritesheet('Dinosaur', 'assets/Dinosaur.png', 128, 68);
    this.load.image('Text', 'assets/Text.png');
    this.load.image('Astroid', 'assets/Astroid.png');
    this.load.image('Github', 'assets/blacktocat-32.png');
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.state.start('game');
  }

  update() {
    // if (this.ready) {
    //   this.game.state.start('menu');
    // }
  }

  onLoadComplete() {
    this.ready = true;
  }
}

export default Preloader;
