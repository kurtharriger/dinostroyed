class Boot extends Phaser.State {

  preload() {
    this.load.image('preloader', 'assets/preloader.gif');
  }

  create() {

    this.game.input.maxPointers = 1;
    this.game.scale.pageAlignHorizontally = true;
    // if (!this.game.device.desktop) {
    //   this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //   this.game.scale.minWidth =  480;
    //   this.game.scale.minHeight = 260;
    //   this.game.scale.maxWidth = 1024;
    //   this.game.scale.maxHeight = 768;
    //   this.game.scale.forceOrientation(true);
    // //  this.game.scale.setScreenSize(true);
    // }
    this.game.state.start('preloader');
  }

}

export default Boot;
