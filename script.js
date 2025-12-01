// ====== BASIS CONFIG ======
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
let gameOver = false;

window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

function preload() {
  // Eenvoudige blokjes i.p.v. echte sprites (later vervangen door art)
  this.textures.generate("playerBlock", {
    data: ["2222", "2222", "2222", "2222"],
    pixelWidth: 16
  });

  this.textures.generate("obstacleBlock", {
    data: ["3333", "3333", "3333", "3333"],
    pixelWidth: 16
  });
}

function create() {
  const { width, height } = this.scale;

  // Grond
  ground = this.add.rectangle(width / 2, height - 30, width, 40, 0x1f2933);
  this.physics.add.existing(ground, true); // static body

  // Speler
  player = this.physics.add
    .sprite(120, height - 120, "playerBlock")
    .setScale(2)
    .setCollideWorldBounds(true);

  player.setBounce(0.1);

  // Obstakel-groep
  obstacles = this.physics.add.group();

  // Collision speler ↔ grond + obstakels
  this.physics.add.collider(player, ground);
  this.physics.add.collider(player, obstacles, hitObstacle, null, this);

  // Input
  cursors = this.input.keyboard.createCursorKeys();
  spaceKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );

  // Jump ook op muisklik/tap
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

  // Om de X tijd een obstakel spawnen
  this.time.addEvent({
    delay: 1400,
    loop: true,
    callback: () => {
      if (gameOver) return;
      spawnObstacle(this);
    }
  });
}

function update() {
  if (gameOver) return;

  // Springen met spatie of ↑
  if (
    (Phaser.Input.Keyboard.JustDown(spaceKey) ||
      Phaser.Input.Keyboard.JustDown(cursors.up)) &&
    player.body.blocked.down
  ) {
    jump();
  }

  // Score langzaam laten oplopen
  score += 1;
  scoreText.setText("Score: " + score);
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

  const size = Phaser.Math.Between(30, 60);
  const obstacle = scene.physics.add
    .sprite(width + size, height - 80, "obstacleBlock")
    .setScale(size / 16);

  obstacle.setVelocityX(-260);
  obstacle.setImmovable(true);
  obstacle.body.allowGravity = false;

  obstacles.add(obstacle);

  // Verwijder obstacle als hij uit beeld is
  obstacle.checkWorldBounds = true;
  obstacle.outOfBoundsKill = true;
}

function hitObstacle(playerObj, obstacle) {
  if (gameOver) return;
  gameOver = true;

  playerObj.setTint(0xff4b4b);
  playerObj.setVelocityX(0);

  // Alles stoppen
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
