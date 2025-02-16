import Engine from "./engine/index.js";

const { game, render } = Engine.createGame({
  parentRenderer: document.getElementById("render"),
  aspectRatio: 9 / 16,
  scale: 1,
  frameRate: 60,
  angleMode: Engine.AngleMode.RADIANS,
  background: {
    image: {
      url: "../assets/images/background-day.png",
      positions: {
        x: Engine.BackgroundPosition.CENTER,
        y: Engine.BackgroundPosition.CENTER,
      },
      fit: Engine.BackgroundFit.CONTAIN,
    },
  },
  onPreload() {
    game.load.image("base", "../assets/images/base.png");
    game.load.image("tierra", "https://cdn.phaser.io/sandbox/square-earth.png");
    game.load.spritesheet("bird", "../assets/sprites/bird-flap-sprites.png", {
      frameWidth: 17.66,
      frameHeight: 12,
    });
  },
  onRender() {
    game.scene.start("main");
    // game.scene.start("menu");
  },
  onLoadingProgress(progress) {
    console.log(progress);
  },
});

class MainScene extends Engine.Scene {
  scale = 1;
  onCreate() {
    this.text = this.add.text("Hola mundo", 150, 200);
    this.bird = this.add
      .sprite("bird", 100, 100)
      .scale(3)
      .origin(0.5)
      .rotate(45);
    // .setRotation(0.1);
    this.base = this.add
      .image("base", 100, 100, 50, 50)
      .origin(0)
      .scale(this.scale);

    console.log(this.bird);

    this.tileBase = this.add.tileSprite("base", 0, 600, 400, 100);

    // this.tile = this.add.tileSprite("tierra", 0, 300, 300, 600);
    // this.tile.tilePositionX = 0;
    // this.tile.tilePositionY = 0;

    // console.log(this.bird._x);

    // this.bird.scale.x = 5;
    // this.bird.scale.y = 5;
  }

  onUpdate() {
    // this.tile.tilePositionX += 0.5;
    // this.tile.tilePositionY += 1.5;
    this.tileBase.tilePositionX -= 3;
  }
}

game.scene.add("main", MainScene, Engine.SceneBehavior.PARALLEL);
game.scene.add(
  "menu",
  {
    onCreate() {
      this.base = this.add.image("base", 100, 100);
    },
  },
  Engine.SceneBehavior.PARALLEL
);

render();

document.body.addEventListener("click", () => {
  game.pause();
});

document.addEventListener("keypress", (e) => {
  if (e.key === "a") {
    game.play();
  }
});
