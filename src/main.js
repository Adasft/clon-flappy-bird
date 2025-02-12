import {
  CanvasBackgroundImageFit,
  CanvasBackgroundImagePosition,
} from "./engine/enums.js";
import { createGame } from "./engine/game-engine.js";

const { game, render } = createGame({
  parentRenderer: document.getElementById("render"),
  aspectRatio: 9 / 16,
  scale: 0.7,
  frameRate: 60,
  background: {
    image: {
      url: "../assets/images/background-day.png",
      positions: {
        x: CanvasBackgroundImagePosition.CENTER,
        y: CanvasBackgroundImagePosition.CENTER,
      },
      fit: CanvasBackgroundImageFit.FILL,
    },
  },
  preload() {
    this.load.image("base", "../assets/images/base.png");
  },
});

game.scene.add("main", {
  onCreate() {
    this.add.image("base", 0, 0, 100, 200);
  },
});

render(() => {
  game.scene.start("main");
});
