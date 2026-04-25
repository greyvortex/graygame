import * as Phaser from 'phaser'; 

const config = {
    type: Phaser.AUTO, // Uses WebGL if available, otherwise Canvas
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 800 },
        debug: true
        }
    },
    parent: 'app', // Make sure you have a <div id="app"></div> in index.html
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
const game = new Phaser.Game(config);

function preload() {
    this.load.image('bg', 'assets/background.png');
    this.load.image('player', 'assets/soldier.png');
}

function create() {
    let background = this.add.image(0, 0, 'bg');
    background.displayWidth = this.sys.canvas.width;
    background.displayHeight = this.sys.canvas.height;
    background.setOrigin(0, 0);
    this.player = this.physics.add.sprite(100, 400, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();


    this.platforms = this.physics.add.staticGroup();
    let floor = this.add.rectangle(400, 450, 800, 40, 0x00ff00);
    this.platforms.add(floor);
    this.physics.add.existing(floor, true);
    this.physics.add.collider(this.player, this.platforms);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setLerp(0.1, 0.1);

}

function update() {
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-120);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(120);
    } else {
        this.player.setVelocityX(0);
    }

    // Jump logic: Only jump if touching the "floor"
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-300);
    }
}
