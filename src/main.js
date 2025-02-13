import {
  CanvasBackgroundImageFit,
  CanvasBackgroundImagePosition,
  SceneBehavior,
} from "./engine/enums.js";
import Engine from "./engine/index.js";

const { game, render } = Engine.createGame({
  parentRenderer: document.getElementById("render"),
  aspectRatio: 9 / 16,
  scale: 1,
  frameRate: 60,
  background: {
    image: {
      url: "../assets/images/background-day.png",
      positions: {
        x: CanvasBackgroundImagePosition.CENTER,
        y: CanvasBackgroundImagePosition.CENTER,
      },
      fit: CanvasBackgroundImageFit.CONTAIN,
    },
  },
  preload() {
    game.load.image("base", "../assets/images/base.png");
    game.load.spritesheet("bird", "../assets/sprites/bird-flap-sprites.png", {
      frameWidth: 17.66,
      frameHeight: 12,
    });
  },
});

class MainScene extends Engine.Scene {
  onCreate() {
    this.text = this.add.text("Hola mundo", 150, 200);
    this.bird = this.add.sprite("bird", 0, 0, 17.66, 12).setScale(3);

    // this.bird.scale.x = 5;
    // this.bird.scale.y = 5;
  }

  onUpdate() {
    // this.base.x += 1;
    this.text.rotate += 0.001;
  }
}

game.scene.add("main", MainScene, SceneBehavior.DESTROY);
game.scene.add(
  "menu",
  {
    onCreate() {
      this.base = this.add.image("base", 0, 0, 100, 200);
    },
  },
  SceneBehavior.PARALLEL
);

render(() => {
  game.scene.start("main");
});

document.body.addEventListener("click", () => {
  game.pause();
});

document.addEventListener("keypress", (e) => {
  if (e.key === "a") {
    game.play();
  }
});
