import { CanvasFrame } from "./engine/canvas-frame.js";

let bird;

class Bird extends CanvasFrame.DrawableSprite {
  constructor() {
    super("bird.png", { frameWidth: 32, frameHeight: 32 });
  }
}

const frame = new CanvasFrame({
  parentRenderer: document.body,
  aspectRadio: { width: 288, height: 512 },
  scale: window.innerHeight / 512,
  background: "../assets/images/background-day.png",
  frameRate: 60,
  paths: {
    images: "../assets/images",
    sounds: "../assets/sounds",
    fonts: "../assets/fonts",
    sprites: "../assets/sprites",
  },
  physics: {
    gravity: 0.5,
    jumpImpulse: 0.5,
    jumpDuration: 0.5,
    maxSpeed: 5,
    minSpeed: 0.5,
  },
  scene: {
    preload() {
      this.load.image("base", "base.png");
      this.load.sound("jump", "jump.mp3");
      this.load.sprite("bird", "bird.png", { frameWidth: 32, frameHeight: 32 });
    },
    create() {
      this.base = this.add.image("base", 0, 0, 288, 512);

      this.sounds.play("jump");
    },
    update() {},
  },
});

frame.addScenes(new MainScene());

frame.start();
