import { Anims } from "../enums.js";

export default class Animation {
  constructor({
    key,
    sprite,
    frames,
    frameRate = 60,
    limitFrames = false,
    repeat = Anims.INFINITY,
    onPlay,
    onPause,
  }) {
    this.key = key;
    this.sprite = sprite;
    this.frames = frames;
    this.frameRate = frameRate;
    this.repeat = repeat;
    this.frameDuration = frameRate === 0 ? 1000 : 1000 / frameRate;
    this.lastFrame = 0;
    this.limitFrames = limitFrames;
    this.isRunning = false;
    this.onPlay = onPlay;
    this.onPause = onPause;
    this._currentFrameIndex = 0;
  }

  run(time) {
    if (!this.isRunning) {
      return;
    }

    const currentFrame = time;
    const delta = currentFrame - this.lastFrame;

    if (this.limitFrames) {
      if (delta >= this.frameDuration) {
        this.lastFrame = currentFrame - (delta % this.frameDuration);
        this._animate();
      }
    } else {
      this.lastFrame = currentFrame;
      this._animate();
    }
  }

  play() {
    this.onPlay();
    this.isRunning = true;
  }

  pause() {
    this.onPause();
    this.isRunning = false;
  }

  restart() {
    this.sprite.currentFrame = 0;
    this._currentFrameIndex = 0;
  }

  _animate() {
    const currentFrame = this.frames[this._currentFrameIndex];

    this.sprite.currentFrame = currentFrame;

    this._currentFrameIndex++;

    if (this._currentFrameIndex < this.frames.length) {
      return;
    }

    switch (this.repeat) {
      case Anims.INFINITY:
        this._currentFrameIndex = 0;
        break;
      case Anims.ONCE:
        this.pause();
    }
  }
}
