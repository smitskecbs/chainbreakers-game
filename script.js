// ====== CHAINBREAKERS – VERHAAL MET PRINSES ======

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
  // Achtergrond (900x400). Heb je die niet, haal deze regel weg.
  this.load.image("background", "background.png");

  // Jouw prinses (player.png)
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

  // ===== Prinses – nóg verder naar beneden =====
  const floorY = height - 10; // bijna helemaal onderin

  const player = this.add.image(width * 0.22, floorY, "playerSprite");
  player.setOrigin(0.5, 1);   // onderkant van de sprite staat op floorY
  player.setScale(0.45);      // eventueel 0.42 maken als ze nét te groot is

  // Heel lichte “adem”-animatie
  this.tweens.add({
    targets: player,
    y: floorY - 6,
    duration: 1400,
    yoyo: true,
    repeat: -1,
    ease: "Sine.inOut"
  });

  // ===== Verhaalregels =====
  storyLines = [
    "In een vergeten hoekje van de Solana-keten\nwordt een prinses wakker met een vreemd gevoel.",
    "Ze voelt dat er iets vastzit in de wereld...\nalsof onzichtbare ketens iedereen tegenhouden.",
    "Maar ergens diep vanbinnen weet ze:\nketens zijn er om gebroken te worden.",
    "Ze hoort gefluister over een munt...\nCBS Coin – Community Builds Sovereignty.",
    "Niet gemaakt door koningen of banken,\nmaar door gewone mensen die samen bouwen.",
    "Onze prinses besluit één ding:\nze gaat op pad om de ketens te breken.",
    "Dit is nog geen game.\nDit is het begin van het verhaal.",
    "Later komt hier de echte ChainBreakers-game.\n\nVoor nu: onthoud dit…\n\nJe hebt geen kroon nodig om vrij te zijn."
  ];

  currentLineIndex = 0;

  // ===== Tekstblok rechts =====
  storyText = this.add.text(width * 0.42, height * 0.16, "", {
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: "18px",
    color: "#f9fafb",
    wordWrap: { width: width * 0.5 },
    lineSpacing: 6,
    shadow: {
      offsetX: 1,
      offsetY: 1,
      color: "#000000",
      blur: 2,
      fill: true
    }
  });
  storyText.setOrigin(0, 0);

  // ===== Hint onderin – nu gecentreerd =====
  hintText = this.add.text(width / 2, height - 20,
    "Klik of druk op SPATIE om verder te gaan", {
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "13px",
      color: "#e5e7eb",
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: "#000000",
        blur: 2,
        fill: true
      }
    }
  );
  hintText.setOrigin(0.5, 1);

  // Eerste regel tonen
  showCurrentLine();

  // Input: spatie + klik/tap
  const spaceKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  this.input.on("pointerdown", advanceStory);
  spaceKey.on("down", advanceStory);
}

// ===== HELPER FUNCTIES =====

function showCurrentLine() {
  const line = storyLines[currentLineIndex] || "";
  storyText.setText(line);
}

function advanceStory() {
  currentLineIndex++;

  if (currentLineIndex >= storyLines.length) {
    currentLineIndex = storyLines.length - 1;

    storyText.setText(
      "Dit was de proloog van ChainBreakers.\n\n" +
      "Straks laten we haar echt spelen\nin een simpele card- of strategy-game.\n\n" +
      "Ververs de pagina om het verhaal\nvanaf het begin opnieuw te lezen."
    );

    hintText.setText("Einde verhaal – ververs de pagina om opnieuw te beginnen");
    return;
  }

  showCurrentLine();
}
