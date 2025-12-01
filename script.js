// ====== CHAINBREAKERS RUNNER – SIMPELE DINO-STYLE ======

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
  // Simpele "dino" via pixel data
  this.textures.generate("playerDino", {
    data: [
      ".33.....",
      "3333....",
      ".3333...",
      ".3333...",
      ".333333.",
      ".33.33..",
      ".33.33..",
      "..3..3.."
    ],
    pixelWidth: 6
  });

  // Obstakel-blok
  this.textures.generate("obstacleBlock", {
    data: [
      "4444",
      "4444",
      "4444",
      "4444"
    ],
    pixelWidth: 10
  });
}

function create() {
  const { width, height } = this.scale;

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

  // ===== Speler (dino) =====
  player = this.physics.add
    .sprite(140, height - groundHeight - 40, "playerDino")
    .setScale(2);

  player.setCollideWorldBounds(true);
  player.setBounce(0.0);

  // Collider met de grond
  this.physics.add.collider(player, ground);

  // ===== Obstakels =====
  obstacles = this.physics.add.group();
  this.physics.add.collider(player, obstacles, hitObstacle, null, this);

  // Input
  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );

  // Springen via muis/tap
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

  // Obstakels spawnen om de ~1.7s
  this.time.addEvent({
    delay: 1700,
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

  // Score elke ~250ms +1
  scoreTimer += delta;
  if (scoreTimer >= 250) {
    score += 1;
    scoreText.setText("Score: " + score);
    scoreTimer = 0;
  }

  // Obstakels opruimen die uit beeld zijn
  obstacles.getChildren().forEach((o) => {
    if (o.x < -50) {
      o.destroy();
    }
  });
}

// ====== HELPER FUNCTIES ======

function jump() {
  if (!player || !player.body) return;
  if (player.body.blocked.down) {
    player.setVelocityY(-520);
  }
}

function spawnObstacle(scene) {
  const { width, height } = scene.scale;

  const groundHeight = 40;
  const obstacleHeight = Phaser.Math.Between(30, 60);

  const obstacle = scene.physics.add
    .sprite(width + 40, height - groundHeight - obstacleHeight / 2, "obstacleBlock")
    .setScale(obstacleHeight / 40);

  obstacle.setVelocityX(-260);
  obstacle.setImmovable(true);
  obstacle.body.allowGravity = false;

  obstacles.add(obstacle);
}

function hitObstacle(playerObj, obstacle) {
  if (gameOver) return;
  gameOver = true;

  playerObj.setTint(0xff4b4b);
  playerObj.setVelocityX(0);

  // Obstakels stoppen
  obstacles.getChildren().forEach((o) => {
    o.setVelocityX(0);
  });

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
