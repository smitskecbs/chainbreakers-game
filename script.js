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

    // ---- ⭐ vallende sterren texture genereren (eenmalig) ----
    if (!this.textures.exists("star")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0xffffcc, 1);
      g.fillCircle(4, 4, 3);
      g.generateTexture("star", 8, 8);
      g.destroy();
    }

    // sterren aanmaken
    this.starSprites = [];
    for (let i = 0; i < 30; i++) {
      const s = this.add.sprite(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(-height, 0),
        "star"
      );
      s.setAlpha(Phaser.Math.FloatBetween(0.4, 0.9));
      s.setScale(Phaser.Math.FloatBetween(0.7, 1.2));
      s.speed = Phaser.Math.FloatBetween(40, 90); // pixels per seconde
      this.starSprites.push(s);
    }

    // Titel
    this.add.text(width * 0.42, height * 0.10, "🌥️ Droom tussen de wolken 🌥️", {
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
      "Maar ergens ver weg\nbegint de wereld weer te roepen…\n\n(klik of spatie om wakker te worden)"
    ];

    this.currentLineIndex = 0;

    this.storyText = this.add.text(
      width * 0.42,
      height * 0.18,
      this.storyLines[0],
      {
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "17px",
        color: "#f9fafb",
        wordWrap: { width: width * 0.5 },
        lineSpacing: 6,
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 3, fill: true }
      }
    );
    this.storyText.setOrigin(0, 0);

    // Hint onderin
    this.hintText = this.add.text(
      width / 2,
      height - 20,
      "Klik of druk op SPATIE om verder te gaan",
      {
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "13px",
        color: "#e5e7eb",
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true }
      }
    );
    this.hintText.setOrigin(0.5, 1);

    // Input
    const spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    spaceKey.on("down", () => this.advanceStory());
    this.input.on("pointerdown", () => this.advanceStory());
  }

  advanceStory() {
    this.currentLineIndex++;

    // als we voorbij de laatste regel zijn → naar WorldScene
    if (this.currentLineIndex >= this.storyLines.length) {
      this.scene.start("WorldScene");
      return;
    }

    this.storyText.setText(this.storyLines[this.currentLineIndex]);
  }

  update(time, delta) {
    // vallende sterren updaten
    if (!this.starSprites) return;
    const { height, width } = this.scale;
    const dt = delta / 1000;

    this.starSprites.forEach((s) => {
      s.y += s.speed * dt;
      s.x += Phaser.Math.FloatBetween(-10, 10) * dt; // klein dwarrelen
      if (s.y > height + 10) {
        s.y = -10;
        s.x = Phaser.Math.Between(0, width);
      }
    });
  }
}

// ========== SCENE 2 – WERELD 1 (VLINDERS) ==========

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

    // ---- 🦋 vlinder-texture genereren ----
    if (!this.textures.exists("butterfly")) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      // linker vleugel
      g.fillStyle(0xffa7c4, 1);
      g.fillEllipse(5, 7, 5, 7);
      // rechter vleugel
      g.fillStyle(0xffcfe3, 1);
      g.fillEllipse(11, 7, 5, 7);
      // lijfje
      g.fillStyle(0x333333, 1);
      g.fillRect(7.5, 4, 2, 8);
      g.generateTexture("butterfly", 16, 14);
      g.destroy();
    }

    // vlinders aanmaken
    this.butterflies = [];
    for (let i = 0; i < 16; i++) {
      const b = this.add.sprite(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height / 2),
        "butterfly"
      );
      b.setScale(Phaser.Math.FloatBetween(0.8, 1.3));
      b.baseY = b.y;
      b.speedX = Phaser.Math.FloatBetween(20, 50) * (Math.random() < 0.5 ? -1 : 1);
      b.waveSpeed = Phaser.Math.FloatBetween(2, 4);
      b.waveHeight = Phaser.Math.FloatBetween(5, 14);
      b.t = Math.random() * Math.PI * 2;
      this.butterflies.push(b);
    }

    this.add.text(width * 0.42, height * 0.10, "☁️ Terug naar de wereld ☁️", {
      fontFamily:
        "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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

    this.storyText = this.add.text(
      width * 0.42,
      height * 0.20,
      this.storyLines[0],
      {
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "17px",
        color: "#f9fafb",
        wordWrap: { width: width * 0.5 },
        lineSpacing: 6,
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 3, fill: true }
      }
    );
    this.storyText.setOrigin(0, 0);

    this.hintText = this.add.text(
      width / 2,
      height - 20,
      "Klik of druk op SPATIE om verder te gaan",
      {
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: "13px",
        color: "#e5e7eb",
        shadow: { offsetX: 1, offsetY: 1, color: "#000000", blur: 2, fill: true }
      }
    );
    this.hintText.setOrigin(0.5, 1);

    const spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
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
      this.hintText.setText(
        "Einde verhaal – ververs de pagina om opnieuw te beginnen"
      );
      this.input.removeAllListeners();
      this.input.keyboard.removeAllListeners();
      return;
    }

    this.storyText.setText(this.storyLines[this.currentLineIndex]);
  }

  update(time, delta) {
    // vlinders laten fladderen
    if (!this.butterflies) return;
    const { width, height } = this.scale;
    const dt = delta / 1000;

    this.butterflies.forEach((b) => {
      b.t += b.waveSpeed * dt;
      b.x += b.speedX * dt;
      b.y = b.baseY + Math.sin(b.t) * b.waveHeight;
      b.setRotation(Math.sin(b.t) * 0.25);

      // scherm uit? -> aan andere kant weer binnen laten komen
      if (b.x < -20) b.x = width + 20;
      if (b.x > width + 20) b.x = -20;
      if (b.y < 0) b.y = height * 0.2;
      if (b.y > height * 0.8) b.y = height * 0.6;
    });
  }
}

// ========== GAME CONFIG & STARTUP ==========

let game;

window.addEventListener("load", () => {
  const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 400,
    parent: "game-container",
    backgroundColor: "#020617",
    scene: [DreamScene, WorldScene]
  };

  game = new Phaser.Game(config);
});
