// ====== CHAINBREAKERS RUNNER – PRINSES + OBSTAKELS (4-frame spritesheet) ======

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 400,
  parent: "game-container",
  backgroundColor: "#020617",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 900 },
      debug: false
    }
  },
  scene: { preload, create, update }
};

let game;
let player;
let ground;
let obstacles;
let cursors;
let spaceKey;
let score = 0;
let scoreText;
let scoreTimer = 0;
let gameOver = false;

window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

function preload() {
  // Achtergrond (zelfde map als index.html)
  this.load.image("background", "background.png");

  // 512x512 spritesheet met 2x2 frames (4 prinsesjes)
  this.load.spritesheet("playerRun", "run-player.png", {
    frameWidth: 256,  // 512 / 2
    frameHeight: 256  // 512 / 2
  });

  // Simpele rode blok-texture voor obstakels
  this.textures.generate("obstacleTex", {
    data: ["11", "11", "11", "11"],
    pixelWidth: 16
  });
}

function create() {
  const { width, height } = this.scale;
  const groundHeight = 40;

  gameOver = false;
  score = 0;
  scoreTimer = 0;

  // ===== Achtergrond =====
  const bg = this.add.image(width / 2, height / 2, "background");
  bg.setOrigin(0.5, 0.5);
  bg.setDisplaySize(width, height);

  // ===== Grond =====
  const groundRect = this.add.rectangle(
    width / 2,
    height - groundHeight / 2,
    width,
    groundHeight
  );
  this.physics.add.existing(groundRect, true);
  ground = groundRect;

  // ===== RUN-ANIMATIE AANMAKEN (4 frames) =====
  this.anims.create({
    key: "run",
    frames: this.anims.generateFrameNumbers("playerRun", {
      start: 0,
      end: 3   // 4 frames
    }),
    frameRate: 6,    // iets rustiger rennen
    repeat: -1
  });

  // ===== Speler =====
  player = this.physics.add.sprite(
    200,
    height - groundHeight,
    "playerRun",
    0
  );

  // voeten op de grond
  player.setOrigin(0.5, 1);

  // HIER: bovenste rand eraf croppen (bijv. 24px)
  // (x, y, width, height) in pixels binnen elk frame (256x256)
  player.setCrop(0, 24, 256, 256 - 24);

  // schaal aanpassen
  player.setScale(1.2);     // pas aan naar smaak
  player.setCollideWorldBounds(true);
  player.setBounce(0);
  this.physics.add.collider(player, ground);

  // Start run-animatie
  player.play("run");

  // ===== Obstakels-groep =====
  obstacles = this.physics.add.group();
  this.physics.add.collider(player, obstacles, hitObstacle, null, this);

  // Input
  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  this.input.on("pointerdown", () => jump());

  // Score
  scoreText = this.add.text(20, 20, "Score: 0", {
    fontSize: "20px",
    color: "#e5e7eb"
  });

  this.add
    .text(width - 20, height - 20, "Spring: spatie / klik", {
      fontSize: "14px",
      color: "#9ca3af"
    })
    .setOrigin(1, 1);

  // Elke 1.8s een obstakel spawnen
  this.time.addEvent({
    delay: 1800,
    loop: true,
    callback: () => {
      if (!gameOver) spawnObstacle(this);
    }
  });
}

function update(time, delta) {
  if (gameOver) return;

  if (
    (Phaser.Input.Keyboard.JustDown(spaceKey) ||
      Phaser.Input.Keyboard.JustDown(cursors.up)) &&
    player.body.blocked.down
  ) {
    jump();
  }

  // Score elke 250ms +1
  scoreTimer += delta;
  if (scoreTimer >= 250) {
    score++;
    scoreText.setText("Score: " + score);
    scoreTimer = 0;
  }

  // Obstakels opruimen die uit beeld zijn
  obstacles.getChildren().forEach((o) => {
    if (o.x < -60) {
      o.destroy();
    }
  });
}

// ===== HELPER FUNCTIES =====

function jump() {
  if (!player || !player.body) return;
  if (player.body.blocked.down) {
    player.setVelocityY(-520);
  }
}

function spawnObstacle(scene) {
  const { width, height } = scene.scale;
  const groundHeight = 40;
  const obstacleHeight = Phaser.Math.Between(30, 70);

  const obs = scene.physics.add.sprite(
    width + 40,
    height - groundHeight - obstacleHeight / 2,
    "obstacleTex"
  );

  obs.setScale(2, obstacleHeight / 32);
  obs.setImmovable(true);
  obs.body.allowGravity = false;
  obs.body.setVelocityX(-260);

  obstacles.add(obs);
}

function hitObstacle(playerObj, obstacleObj) {
  if (gameOver) return;
  gameOver = true;

  playerObj.setTint(0xff4b4b);
  playerObj.setVelocityX(0);
  obstacleObj.body.setVelocityX(0);

  if (playerObj.anims) {
    playerObj.anims.pause();
  }

  const { width, height } = playerObj.scene.scale;

  playerObj.scene.add
    .text(width / 2, height / 2, "GAME OVER", {
      fontSize: "36px",
      color: "#fca5a5"
    })
    .setOrigin(0.5);

  playerObj.scene.add
    .text(width / 2, height / 2 + 40, "Refresh om opnieuw te spelen", {
      fontSize: "16px",
      color: "#9ca3af"
    })
    .setOrigin(0.5);
}
