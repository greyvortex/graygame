import * as Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { 
            gravity: { y: 800 },
            debug: false 
        }
    },
    parent: 'app',
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
    this.load.image('bg', 'assets/temp/background.png');
    this.load.image('player', 'assets/temp/soldier.png');
    this.load.image('scrap', 'assets/temp/scrap.png');
    this.load.image('powerUp', 'assets/temp/powerup.png');
    this.load.image('spark', 'assets/spark.png');
    this.load.image('water', 'assets/temp/water.png');
    
    // Audio - Using .wav as discussed
    this.load.audio('levelUpSfx', 'assets/levelup.wav');
    this.load.audio('bgMusic', 'assets/bg_music.mp3');
    this.load.audio('scrapSfx', 'assets/pickup.wav');
    this.load.audio('energySfx', 'assets/energy.wav'); 
}

function create() {
    // --- 1. RESUME AUDIO CONTEXT (FIX FOR MUSIC STOPPING) ---
    this.input.once('pointerdown', () => {
        if (this.sound.context.state === 'suspended') {
            this.sound.context.resume();
        }
    });

    // --- 2. VARIABLES & GROUPS ---
    this.lives = 2;
    this.energy = 100;
    this.scrapCollected = 0;
    this.isInvincible = false;

    this.scraps = this.physics.add.group();
    this.cores = this.physics.add.group();
    this.hazards = this.physics.add.group();
    this.platforms = this.physics.add.staticGroup();

    // Visuals
    this.add.image(0, 0, 'bg').setOrigin(0, 0).setDisplaySize(800, 600);
    this.sparks = this.add.particles(0, 0, 'spark', {
        speed: { min: -100, max: 100 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        blendMode: 'ADD',
        lifespan: 800,
        emitting: false
    });

    // Ground
    let ground = this.add.rectangle(400, 580, 800, 40, 0x333333);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    // Player
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.platforms);

    // UI
    this.scrapText = this.add.text(20, 20, 'SCRAP: 0', { fontSize: '24px', fill: '#fff' });
    this.livesText = this.add.text(20, 50, 'LIVES: 2', { fontSize: '24px', fill: '#f00' });
    this.energyText = this.add.text(780, 20, 'ENERGY: 100%', { fontSize: '24px', fill: '#0f0' }).setOrigin(1, 0);

    // --- 3. SPAWNERS ---
    this.time.addEvent({
        delay: 3000,
        callback: () => {
            let s = this.scraps.create(Phaser.Math.Between(50, 750), -50, 'scrap');
            s.setGravityY(300);
            this.physics.add.collider(s, this.platforms);
        },
        loop: true
    });

    this.time.addEvent({
        delay: 5000,
        callback: () => {
            let core = this.cores.create(Phaser.Math.Between(50, 750), -50, 'powerUp');
            core.setGravityY(200);
            this.physics.add.collider(core, this.platforms);
            this.time.delayedCall(7000, () => { if (core.active) core.destroy(); });
        },
        loop: true
    });

    this.time.addEvent({
        delay: 10000,
        callback: () => {
            let water = this.hazards.create(Phaser.Math.Between(50, 750), -50, 'water');
            water.setTint(0x0000ff);
            water.setGravityY(500);
            this.time.delayedCall(2000, () => { if (water.active) water.destroy(); });
        },
        loop: true
    });

    // --- 4. OVERLAPS (CLEANED UP) ---
    this.physics.add.overlap(this.player, this.scraps, (p, s) => {
        s.destroy();
        this.scrapCollected++;
        this.scrapText.setText(`SCRAP: ${this.scrapCollected}`);
        
        // Play sound - Moved inside check for safety
        if (this.sound.get('scrapSfx')) {
            this.sound.play('scrapSfx', { volume: 0.6 });
        }

        if ([10, 100, 1000].includes(this.scrapCollected)) {
            triggerLevelUp.call(this);
        }
    }, null, this);

    this.physics.add.overlap(this.player, this.cores, (p, c) => {
        c.destroy();
        this.energy = Math.min(this.energy + 15, 100);
        if (this.sound.get('energySfx')) {
            this.sound.play('energySfx', { volume: 0.4 });
        }
    }, null, this);

    this.physics.add.overlap(this.player, this.hazards, (p, w) => {
        if (!this.isInvincible) {
            w.destroy();
            this.lives--;
            this.livesText.setText(`LIVES: ${this.lives}`);
            if (this.lives <= 0) handleGameOver.call(this);
            else triggerInvincibility.call(this);
        }
    }, null, this);

    // --- 5. INPUT & MUSIC ---
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // Background Music Setup
    this.bgm = this.sound.add('bgMusic', { volume: 0.3, loop: true });
    this.bgm.play();
}

function update(time, delta) {
    if (this.lives <= 0 || this.energy <= 0) return;

    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
    } else {
        this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.setVelocityY(-450);
    }

    // Energy Logic
    this.energy -= 0.01 * (delta / 16.6);
    this.energyText.setText(`ENERGY: ${Math.max(0, Math.floor(this.energy))}%`);
    this.energyText.setFill(this.energy < 30 ? '#f00' : '#0f0');

    if (this.energy <= 0) handleGameOver.call(this);
}

// --- HELPERS ---

function triggerInvincibility() {
    this.isInvincible = true;
    this.cameras.main.shake(200, 0.01);
    this.player.setAlpha(0.5);
    this.time.delayedCall(1500, () => {
        this.isInvincible = false;
        this.player.setAlpha(1);
    });
}

function triggerLevelUp() {
    if (this.sound.get('levelUpSfx')) this.sound.play('levelUpSfx');
    this.sparks.emitParticleAt(this.player.x, this.player.y, 20);
    this.cameras.main.flash(500, 0, 255, 0);
    this.cameras.main.shake(500, 0.005);

    let lvlText = this.add.text(this.player.x, this.player.y - 50, 'LEVEL UP!', { fontSize: '32px', fill: '#ff0' }).setOrigin(0.5);
    this.tweens.add({
        targets: lvlText,
        y: lvlText.y - 100,
        alpha: 0,
        duration: 2000,
        onComplete: () => lvlText.destroy()
    });
}

function handleGameOver() {
    this.physics.pause();
    this.sound.stopAll(); // Stop everything cleaner
    this.player.setTint(0xff0000);

    this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7).setDepth(10);
    this.add.text(400, 250, 'SYSTEM CRITICAL', { fontSize: '64px', fill: '#f00' }).setOrigin(0.5).setDepth(11);
    this.add.text(400, 330, `FINAL SCORE: ${this.scrapCollected}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setDepth(11);
    
    let btn = this.add.text(400, 450, 'CLICK TO REBOOT', { fontSize: '24px', fill: '#0f0' }).setOrigin(0.5).setDepth(11).setInteractive();
    btn.on('pointerdown', () => this.scene.restart());
}