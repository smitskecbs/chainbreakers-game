// Eenvoudige Phaser-config voor een testcanvas
const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 500,
  backgroundColor: "#020617",
  parent: null, // Phaser voegt zelf een canvas toe aan <body>
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
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
let titleText;

window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

function preload() {
  // hier later afbeeldingen / sprites laden
}

function create() {
  // Simpele testtekst in het midden
  const { width, height } = this.scale;

  titleText = this.add.text(width / 2, height / 2, "ChainBreakers – Game Test", {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "28px",
    color: "#e5e7eb"
  });
  titleText.setOrigin(0.5);

  const infoText = this.add.text(width / 2, height / 2 + 40, "Canvas werkt. Runner komt hier straks in.", {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "16px",
    color: "#9ca3af"
  });
  infoText.setOrigin(0.5);
}

function update() {
  // later gebruiken voor movement, runner, etc.
}
