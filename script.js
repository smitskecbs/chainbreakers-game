// ====== CHAINBREAKERS – STORY MODE (DROOM + WERELD 1) ======

const config = {
  type: Phaser.AUTO,
  width: 900,
  height: 400,
  parent: "game-container",
  backgroundColor: "#020617",
  scene: [DreamScene, WorldScene]
};

let game;

window.addEventListener("load", () => {
  game = new Phaser.Game(config);
});

// ========== SCENE 1 – DROOM TUSSEN DE WOLKEN ==========

class DreamScene extends Phaser.Scene {
  constructor() {
    super("DreamScene");
  }

  preload() {
    // Vredige wolken
    this.load.image("backgroundDream", "background.png");
    // Prinses
    this.load.image("princess", "player.png");
  }

  create() {
    const { width, height } = this.scale;

    // Achtergrond
    const bg = this.add.image(width / 2, height / 2, "backgroundDream");
    bg.setOrigin(0.5);
    bg.setDisplaySize(width, height);

    // Prinses links onder
    const floorY = height + 4; // net onder de rand, zodat ze visueel laag zit
    const princess = this.add.image(width * 0.22, floorY, "princess");
    princess.setOrigin(0.5, 1);
    princess.setScale(0.40);

    // zachte idle-animatie
    this.tweens.add({
      targets: princess,
      y: floorY - 6,
      duration: 1400,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    // Titel
    this.add.text(width * 0.42, height * 0.10, "🌥️ Droom tussen de wolken 🌥️", {
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "20px",
      color: "#ffffff",
      shadow: { offsetX: 1, offsetY: 1, color: "#000", blur: 3, fill: true }
    });

    // Verhaalregels
    this.storyLines = [
      "Ze is niet in een kasteel.\nNiet in een stad.\nNiet in een oorlog.",
      "Ze is in een droom.\nHoog boven alles uit,\nzwevend tussen de wolken.",
      "Hier zijn geen verplichtingen.\nGeen regels, geen drukte,\nalleen stilte en zachte lucht.",
      "Voor even is ze ontsnapt\naan de zwaarte van de wereld hieronder.",
      "Geen stemmen die zeggen wat moet.\nAlleen haar eigen gevoel dat fluistert:",
      "“Hier mag ik gewoon zijn.\nZonder angst, zonder schaamte,\nzonder iemand iets te moeten bewijzen.”",
      "Maar ergens ver weg\nbegint de wereld weer te roepen…"
    ];

    this.currentLineIndex = 0;

    this.storyText = this.add.text(width * 0.42, height * 0.18, this.storyLines[0], {
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "17px",
      color: "#f9fafb",
      wordWrap: { width: width * 0.5 },
      lineSpacing: 6,
      shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 3, fill: true }
    });
    this.storyText.setOrigin(0, 0);

    // Hint onderin
    this.hintText = this.add.text(width / 2, height - 20,
      "Klik of druk op SPATIE om verder te gaan", {
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "13px",
        color: "#e5e7eb",
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true }
      }
    );
    this.hintText.setOrigin(0.5, 1);

    // Input
    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.on("down", () => this.advanceStory());
    this.input.on("pointerdown", () => this.advanceStory());
  }

  advanceStory() {
    this.currentLineIndex++;

    if (this.currentLineIndex >= this.storyLines.length) {
      // Naar de volgende scene (wereld 1)
      this.scene.start("WorldScene");
      return;
    }

    this.storyText.setText(this.storyLines[this.currentLineIndex]);
  }
}

// ========== SCENE 2 – WERELD 1 (MINDER VREDIG) ==========

class WorldScene extends Phaser.Scene {
  constructor() {
    super("WorldScene");
  }

  preload() {
    this.load.image("backgroundWorld1", "background-world1.png");
    this.load.image("princess", "player.png");
  }

  create() {
    const { width, height } = this.scale;

    const bg = this.add.image(width / 2, height / 2, "backgroundWorld1");
    bg.setOrigin(0.5);
    bg.setDisplaySize(width, height);

    const floorY = height + 4;
    const princess = this.add.image(width * 0.18, floorY, "princess");
    princess.setOrigin(0.5, 1);
    princess.setScale(0.38);

    this.tweens.add({
      targets: princess,
      y: floorY - 4,
      duration: 1300,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut"
    });

    this.add.text(width * 0.42, height * 0.10, "☁️ Terug naar de wereld ☁️", {
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "20px",
      color: "#fecaca",
      shadow: { offsetX: 1, offsetY: 1, color: "#000", blur: 3, fill: true }
    });

    this.storyLines = [
      "De wolken trekken langzaam weg.\nDe droom wordt dunner, kouder.",
      "Ze voelt weer gewicht op haar schouders:\nverwachtingen, verplichtingen, blikken van anderen.",
      "De wereld hier beneden is niet zacht,\nmaar ergens diep vanbinnen draagt ze\nnog steeds het gevoel van de wolken.",
      "Niemand kan zien wat ze daarboven voelde.\nMaar ze weet nu:\nVrijheid begint vanbinnen.",
      "Dit is het begin.\nLater komt hier de echte ChainBreakers-game,\nwaar jij mee beslist hoe haar pad verder gaat."
    ];

    this.currentLineIndex = 0;

    this.storyText = this.add.text(width * 0.42, height * 0.20, this.storyLines[0], {
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "17px",
      color: "#f9fafb",
      wordWrap: { width: width * 0.5 },
      lineSpacing: 6,
      shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 3, fill: true }
    });
    this.storyText.setOrigin(0, 0);

    this.hintText = this.add.text(width / 2, height - 20,
      "Klik of druk op SPATIE om verder te gaan", {
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "13px",
        color: "#e5e7eb",
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true }
      }
    );
    this.hintText.setOrigin(0.5, 1);

    const spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    spaceKey.on("down", () => this.advanceStory());
    this.input.on("pointerdown", () => this.advanceStory());
  }

  advanceStory() {
    this.currentLineIndex++;

    if (this.currentLineIndex >= this.storyLines.length) {
      this.storyText.setText(
        "Dit was de eerste proloog van ChainBreakers.\n\n" +
        "Ververs de pagina om het verhaal opnieuw te beleven,\n" +
        "of bouw verder aan de volgende level: cards & choices."
      );
      this.hintText.setText("Einde verhaal – ververs de pagina om opnieuw te beginnen");
      this.input.removeAllListeners();
      this.input.keyboard.removeAllListeners();
      return;
    }

    this.storyText.setText(this.storyLines[this.currentLineIndex]);
  }
}
