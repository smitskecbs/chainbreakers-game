// ====== CHAINBREAKERS RUNNER – PLAYER.PNG + 1 OBSTAKEL ======

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
  scene: {
    preload,
    create,
    update
  }
};

let game;
let player;
let ground;
let cursors;
let spaceKey;
let obstacle;
let score = 0;
let scoreText;
let scoreTimer = 0;
let gameOver = false;

window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

function preload() {
  // Laad jouw character (staat in root van repo)
  this.load.image("playerSprite", "player.png");
}

function create() {
  const { width, height } = this.scale;

  gameOver = false;
  score = 0;
  scoreTimer = 0;

  // ===== Grond =====
  const groundHeight = 40;
  ground = this.add.rectangle(
    width / 2,
    height - groundHeight / 2,
    width,
    groundHeight,
    0x111827
  );
  this.physics.add.existing(ground, true); // static body

  // ===== Speler =====
  player = this.physics.add.sprite(
    140,
    height - groundHeight - 60,
    "playerSprite"
  );

  // Schaal speler kleiner als ze te groot is
  // (eventueel later aanpassen, bv. 0.2 of 0.3)
  player.setScale(0.25);

  player.clearTint();
  player.setCollideWorldBounds(true);
  player.setBounce(0);
  this.physics.add.collider(player, ground);

  // ===== Obstakel =====
  const obstacleHeight = 60;
  obstacle = this.add.rectangle(
    width + 60,
    height - groundHeight - obstacleHeight / 2,
    30,
    obstacleHeight,
    0xff3333
  );
  this.physics.add.existing(obstacle);
  obstacle.body.setImmovable(true);
  obstacle.body.allowGravity = false;
  obstacle.body.setVelocityX(-260);

  // Collider speler ↔ obstakel
  this.physics.add.collider(player, obstacle, hitObstacle, null, this);

  // Input
  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );

  this.input.on("pointerdown", () => {
    jump();
  });

  // Score tekst
  scoreText = this.add.text(20, 20, "Score: 0", {
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "20px",
    color: "#e5e7eb"
  });

  // Helpertekst rechtsonder
  this.add
    .text(width - 20, height - 20, "Spring: spatie / klik", {
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "14px",
      color: "#9ca3af"
    })
    .setOrigin(1, 1);
}

function update(time, delta) {
  if (gameOver) return;

  // Springen met spatie of pijl omhoog
  if (
    (Phaser.Input.Keyboard.JustDown(spaceKey) ||
      Phaser.Input.Keyboard.JustDown(cursors.up)) &&
    player.body.blocked.down
  ) {
    jump();
  }

  // Score elke ~250 ms +1
  scoreTimer += delta;
  if (scoreTimer >= 250) {
    score += 1;
    scoreText.setText("Score: " + score);
    scoreTimer = 0;
  }

  // Obstakel resetten als hij uit beeld is
  if (obstacle.x < -50) {
    resetObstacle(this);
  }
}

// ===== HELPER FUNCTIES =====

function jump() {
  if (!player || !player.body) return;
  if (player.body.blocked.down) {
    player.setVelocityY(-520);
  }
}

function resetObstacle(scene) {
  const { width, height } = scene.scale;
  const groundHeight = 40;
  const obstacleHeight = Phaser.Math.Between(40, 80);

  obstacle.x = width + Phaser.Math.Between(80, 220);
  obstacle.y = height - groundHeight - obstacleHeight / 2;
  obstacle.width = 30;
  obstacle.height = obstacleHeight;

  obstacle.body.reset(obstacle.x, obstacle.y);
  obstacle.body.setVelocityX(-260);
  obstacle.body.allowGravity = false;
  obstacle.body.setImmovable(true);
}

function hitObstacle(playerObj, obstacleObj) {
  if (gameOver) return;
  gameOver = true;

  playerObj.setTint(0xff4b4b);
  playerObj.setVelocityX(0);
  obstacleObj.body.setVelocityX(0);

  const scene = playerObj.scene;
  const { width, height } = scene.scale;

  scene.add
    .text(width / 2, height / 2, "GAME OVER", {
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "36px",
      color: "#fca5a5"
    })
    .setOrigin(0.5);

  scene.add
    .text(width / 2, height / 2 + 40, "Refresh om opnieuw te spelen", {
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "16px",
      color: "#9ca3af"
    })
    .setOrigin(0.5);
}
