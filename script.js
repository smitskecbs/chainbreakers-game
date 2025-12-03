// ====== CHAINBREAKERS – STORY INTRO MET PRINSES ======

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 400,
  parent: "game-container",
  backgroundColor: "#020617",
  scene: { preload, create }
};

let game;
let storyLines;
let currentLineIndex = 0;
let storyText;
let hintText;

window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

function preload() {
  // Achtergrond (optioneel – 900x400 is mooi)
  // Als je nog geen background.png hebt, haal deze regel weg.
  this.load.image("background", "background.png");

  // Jouw prinses – player.png (zoals jij ’m hebt gemaakt)
  this.load.image("playerSprite", "player.png");
}

function create() {
  const { width, height } = this.scale;

  // ===== Achtergrond =====
  if (this.textures.exists("background")) {
    const bg = this.add.image(width / 2, height / 2, "background");
    bg.setOrigin(0.5, 0.5);
    bg.setDisplaySize(width, height);
  }

  // ===== Prinses =====
  const player = this.add.image(width * 0.22, height * 0.7, "playerSprite");
  player.setOrigin(0.5, 1);
  player.setScale(0.55); // pas aan naar smaak

  // Kleine idle-animatie (heel zacht op en neer)
  this.tweens.add({
    targets: player,
    y: player.y - 6,
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: "Sine.inOut"
  });

  // ===== Story tekst =====
  storyLines = [
    "In een vergeten hoekje van de Solana-keten\nwordt een prinses wakker met een vreemd gevoel.",
    "Ze voelt dat er iets vastzit in de wereld...\nalsof onzichtbare ketens iedereen tegenhouden.",
    "Maar ergens diep vanbinnen weet ze:\nketens zijn er om gebroken te worden.",
    "Ze hoort gefluister over een munt...\nCBS Coin – Community Builds Sovereignty.",
    "Niet gemaakt door koningen of banken,\nmaar door gewone mensen die samen bouwen.",
    "Onze prinses besluit één ding:\nze gaat op pad om de ketens te breken.",
    "Dit is nog geen game.\nDit is het begin van het verhaal.",
    "Druk later opnieuw op ‘Start’\nom de echte ChainBreakers-game te spelen.\n\nVoor nu: onthoud dit…\n\nJe hebt geen kroon nodig om vrij te zijn."
  ];

  currentLineIndex = 0;

  storyText = this.add.text(width * 0.4, height * 0.2, "", {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "18px",
    color: "#e5e7eb",
    wordWrap: { width: width * 0.52 },
    lineSpacing: 6
  });
  storyText.setOrigin(0, 0);

  hintText = this.add.text(width - 20, height - 16, "Klik of druk op SPATIE om verder te gaan", {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "13px",
    color: "#9ca3af"
  });
  hintText.setOrigin(1, 1);

  // Eerste regel tonen
  showCurrentLine(this);

  // Input: spatie + klik/tap
  const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  this.input.on("pointerdown", () => advanceStory(this));
  spaceKey.on("down", () => advanceStory(this));
}

// ===== HELPER FUNCTIES =====

function showCurrentLine(scene) {
  const line = storyLines[currentLineIndex] || "";
  storyText.setText(line);
}

function advanceStory(scene) {
  currentLineIndex++;

  if (currentLineIndex >= storyLines.length) {
    // Einde verhaal – kleine boodschap en hint
    currentLineIndex = storyLines.length - 1;

    storyText.setText(
      "Dit was de proloog van ChainBreakers.\n\n" +
      "Straks gaan we haar echt laten rennen,\nobstakels ontwijken en ketens breken.\n\n" +
      "Voor nu kun je de pagina verversen\nom het verhaal opnieuw te lezen."
    );

    hintText.setText("Einde verhaal – ververs de pagina om opnieuw te beginnen");
    return;
  }

  showCurrentLine(scene);
}
