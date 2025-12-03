// ====== CHAINBREAKERS – DROOMVERHAAL MET PRINSES ======

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
  // Achtergrond (900x400)
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

  // ===== Prinses – iets kleiner en lager =====
  const floorY = height + 4;  // net onder de canvas-lijn, zodat ze visueel lager hangt

  const player = this.add.image(width * 0.22, floorY, "playerSprite");
  player.setOrigin(0.5, 1);   // onderkant van de sprite staat op floorY
  player.setScale(0.40);      // kleiner dan eerst (was 0.43)

  // Zachte “adem”-animatie
  this.tweens.add({
    targets: player,
    y: floorY - 6,
    duration: 1400,
    yoyo: true,
    repeat: -1,
    ease: "Sine.inOut"
  });

  // ===== Nieuw droom-verhaal =====
  storyLines = [
    "Ze is niet in een kasteel.\nNiet in een stad.\nNiet in een oorlog.",
    "Ze is in een droom.\nHoog boven alles uit,\nzwevend tussen de wolken.",
    "Hier is geen klok die tikt.\nGeen verplichtingen, geen regels,\nalleen stilte en zachte lucht.",
    "Voor heel even is ze ontsnapt\naan de zwaarte van de wereld hieronder.",
    "Geen verwachtingen.\nGeen stemmen die zeggen wat moet.\nAlleen haar eigen gevoel.",
    "In deze droom is er vrede.\nZe hoeft niets te presteren,\nalleen te ademen en te zijn.",
    "Misschien is dit geen vlucht,\nmaar een herinnering:\nzo vrij mág je jezelf voelen.",
    "Als ze straks wakker wordt,\nneemt ze één ding mee terug:\n\nVrijheid begint vanbinnen."
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

  // ===== Hint onderin – gecentreerd =====
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
      "De droom vervaagt langzaam,\nmaar het gevoel van vrijheid blijft.\n\n" +
      "Ververs de pagina om opnieuw\nmet haar de wolken in te gaan."
    );

    hintText.setText("Einde droom – ververs de pagina om opnieuw te beginnen");
    return;
  }

  showCurrentLine();
}
