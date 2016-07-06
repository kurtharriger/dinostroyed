class Game extends Phaser.State {


  create() {
    this.input.onDown.add(this.onInputDown, this);
    this.background = this.add.sprite(1024, 768, 'Background');
  }

  update() {}

  onInputDown() {
    this.game.state.start('menu');
  }

}

export default Game;
