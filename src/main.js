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
    game.load.image("earth", "https://cdn.phaser.io/sandbox/square-earth.png");
    game.load.spritesheet("bird", "../assets/sprites/bird-flap-sprites.png", {
      frameWidth: 21,
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

let vy = 0;
class MainScene extends Engine.Scene {
  scale = 1;
  onCreate() {
    this.physics.enable();

    // this.bird =

    this.bird = this.add
      .sprite("bird", 100, 100)
      .scale(3.2)
      .origin(0.5)
      // .rotate(0.7)
      .setPhysics({
        gravity: { y: 1000, x: 0 },
        drag: 0.2,
        mass: 100,
      });

    console.log(this.bird);

    this.anims.create({
      key: "fly",
      sprite: this.bird,
      frames: this.anims.frameRanges({ start: 0, end: 2 }),
      frameRate: 9, // -> [0, 1,2,3,5]
      repeat: -1,
    });

    this.anims.play("fly");

    // this.earth = this.add.image("earth", 200, 300).origin(0.5);
  }

  onUpdate(time) {
    if (vy < 0) {
      this.bird.body.velocity.y = vy;
      vy = 0;
    }

    // this.earth.plusRotate(0.005);
    // this.earth.y = this.earth.y + Math.sin((time / 1000) * 2);
    // this.bird.y = this.bird.y + Math.sin((time / 500) * 2);
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

console.log(render);
render();

document.body.addEventListener("click", () => {
  vy = -500;
});

document.addEventListener("keypress", (e) => {
  if (e.key === "a") {
    game.play();
  } else if (e.key === "s") {
    game.pause();
  } else if (e.key === "j") {
    vy = -400;
  }
});
