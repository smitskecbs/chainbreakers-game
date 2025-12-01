// ====== CHAINBREAKERS RUNNER – RUNNER.PNG + OBSTAKEL ======

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 400,
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
let obstacle;
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
  // Jouw prinses sprite
  this.load.image("runner", "runner.png");

  // Obstakel texture (simple blok)
  this.textures.generate("obstacleTex", {
    data: ["11", "11", "11", "11"],
    pixelWidth: 16
  });
}

function create() {
  const { width, height } = this.scale;

  gameOver = false;
  score = 0;
  scoreTimer = 0;

  const groundHeight = 40;

  // Grond
  ground = this.add.rectangle(
    width / 2,
    height - groundHeight / 2,
    width,
    groundHeight
  );
  this.physics.add.existing(ground, true); // static

  // Speler
  player = this.physics.add.sprite(
    140,
    height - groundHeight - 60,
    "runner"
  );
  player.setScale(0.4);
  player.setCollideWorldBounds(true);
  this.physics.add.collider(player, ground);

  // Kleine bounce zodat ze "loopt"
  this.tweens.add({
    targets: player,
    duration: 260,
    y: player.y - 6,
    yoyo: true,
    repeat: -1,
    ease: "Sine.inOut"
  });

  // Obstakel
  obstacle = this.physics.add.sprite(
    width + 40,
    height - groundHeight - 30,
    "obstacleTex"
  );
  obstacle.setScale(3, 4);
  obstacle.setImmovable(true);
  obstacle.body.allowGravity = false;
  obstacle.body.setVelocityX(-260);

  // Collider speler ↔ obstakel
  this.physics.add.collider(player, obstacle, hitObstacle, null, this);

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
}

function update(time, delta) {
  if (gameOver) return;

  // Springen
  if (
    (Phaser.Input.Keyboard.JustDown(spaceKey) ||
      Phaser.Input.Keyboard.JustDown(cursors.up)) &&
    player.body.blocked.down
  ) {
    jump();
  }

  // Score langzaam laten oplopen
  scoreTimer += delta;
  if (scoreTimer >= 250) {
    score++;
    scoreText.setText("Score: " + score);
    scoreTimer = 0;
  }

  // Obstakel resetten als hij uit beeld is
  if (obstacle.x < -50) {
    const { width, height } = this.scale;
    const groundHeight = 40;

    obstacle.x = width + Phaser.Math.Between(60, 220);
    obstacle.y = height - groundHeight - 30;
    obstacle.body.setVelocityX(-260);
  }
}

function jump() {
  if (!player || !player.body) return;
  if (player.body.blocked.down) {
    player.setVelocityY(-520);
  }
}

function hitObstacle(playerObj, obstacleObj) {
  if (gameOver) return;
  gameOver = true;

  playerObj.setTint(0xff4b4b);
  playerObj.setVelocityX(0);
  obstacleObj.body.setVelocityX(0);

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

