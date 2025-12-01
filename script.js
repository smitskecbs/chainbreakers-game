// ====== CHAINBREAKERS RUNNER – PRINSES + OBSTAKELS ======

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
let obstacles;
let score = 0;
let scoreText;
let scoreTimer = 0;
let gameOver = false;

window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

function preload() {
  // Laad jouw prinses (player.png staat in de root van de repo)
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

  // ===== Speler (prinses) =====
  player = this.physics.add.sprite(
    140,
    height - groundHeight - 60,
    "playerSprite"
  );

  // Pas schaal aan als ze te groot/klein is
  player.setScale(0.25);

  player.clearTint();
  player.setCollideWorldBounds(true);
  player.setBounce(0);
  this.physics.add.collider(player, ground);

  // Kleine “ren-animatie” (op en neer bouncen)
  this.tweens.add({
    targets: player,
    duration: 260,
    y: player.y - 6,
    yoyo: true,
    repeat: -1,
    ease: "Sine.inOut"
  });

  // ===== Obstakels-groep =====
  obstacles = this.physics.add.group();
  this.physics.add.collider(player, obstacles, hitObstacle, null, this);

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

  // Helper tekst rechtsonder
  this.add
    .text(width - 20, height - 20, "Spring: spatie / klik", {
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "14px",
      color: "#9ca3af"
    })
    .setOrigin(1, 1);

  // Om de X tijd een obstakel spawnen
  this.time.addEvent({
    delay: 1800,
    loop: true,
    callback: () => {
      if (gameOver) return;
      spawnObstacle(this);
    }
  });
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

  // Rood rechthoekig obstakel
  const obstacle = scene.add.rectangle(
    width + 40,
    height - groundHeight - obstacleHeight / 2,
    30,
    obstacleHeight,
    0xff4040
  );

  scene.physics.add.existing(obstacle);
  obstacle.body.setVelocityX(-260);
  obstacle.body.setImmovable(true);
  obstacle.body.allowGravity = false;

  obstacles.add(obstacle);
}

function hitObstacle(playerObj, obstacleObj) {
  if (gameOver) return;
  gameOver = true;

  playerObj.setTint(0xff4b4b);
  playerObj.setVelocityX(0);
  obstacleObj.body.setVelocityX(0);

  const scene = playerObj.scene;
  const { width, height } = scene.scale;

  // Stop alle obstakels
  obstacles.getChildren().forEach((o) => {
    if (o.body) o.body.setVelocityX(0);
  });

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

