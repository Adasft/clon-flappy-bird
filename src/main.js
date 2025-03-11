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

let vy = 0,
  xx = 0;
class MainScene extends Engine.Scene {
  scale = 1;
  onCreate() {
    this.physics.enable();

    // this.bird =

    // this.earth = this.add.image("earth", 200, 300).origin(0.5);
    // this.tile = this.add.tileSprite("earth", 0, 300, 400, 400);

    this.bird = this.add
      .sprite("bird", 100, 100)
      .scale(3.2)
      .origin(0)
      // .rotate(0.7)
      .setPhysics({
        gravity: { y: 4200, x: 0 },
      });

    console.log(this.bird);

    // this.anims.create({
    //   key: "fly",
    //   sprite: this.bird,
    //   frames: this.anims.frameRanges({ start: 0, end: 2 }),
    //   frameRate: 9, // -> [0, 1,2,3,5]
    //   repeat: -1,
    // });

    // this.anims.play("fly");
    const { keyboard } = this.game.input;

    this.keys = keyboard.getKeys();

    keyboard.on("KeyA", "pressed", () => {
      console.log("KeyA");
    });

    keyboard.on("KeyA", "released", () => {
      console.log("KeyA+KeyB Relased");
    });

    // this.jumpCommand = keyboard.compine(
    //   this.keys.ArrowLeft,
    //   this.keys.KeyA
    // )

    // keyboard.on(this.jumpCommand, "pressed", () => {
    //   console.log("ArrowLeft");
    // })

    // this.keys.ArrowLeft.onPressed(() => {
    //   console.log("ArrowLeft");
    // })

    // this.jumpCursor = this.cursor.combine(
    //   this.cursor.CtrlLeft,
    //   this.cursor.KeyA
    // );

    // this.cursor.Digit1.targetKey

    // // in update()
    // if (this.jumpCursor.isPressed) {
    //   this.person.velocity.y = -2;
    // }
  }

  onUpdate(time) {
    // if(this.jumpCommand.isPressed) {
    //   this.bird.body.velocity.y = -1000;
    // }
    if (this.keys.ArrowUp.isPressed) {
      // console.log(this.keys.ArrowUp);
      this.bird.body.velocity.y = -1000;
      // this.bird.body.velocity.x = -10;
    }

    if (this.keys.ArrowRight.isPressed) {
      this.bird.x += 2;
      // this.bird.body.velocity.x = -10;
    }

    if (this.keys.ArrowLeft.isPressed) {
      this.bird.x -= 2;
      // this.bird.body.velocity.x = -10;
    }

    // this.jumpCursor.isPressed;

    // if (xx > 0) {
    // this.bird.x += 1;
    // xx = 0;
    // }
    // this.tile.tilePositionX += 3;
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
  // vy = -500;
  xx = 10;
});

// document.addEventListener("keyup", (e) => {
//   e.preventDefault();
//   // console.log("up", e);
// });

document.addEventListener("keydown", (e) => {
  e.preventDefault();
  if (e.key === "a") {
    game.play();
  } else if (e.key === "s") {
    game.pause();
  } else if (e.key === "j") {
    vy = -600;
  } else if (e.key === "k") {
    xx = 1;
  }
});
