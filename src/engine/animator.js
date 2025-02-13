export default class Animator {
  rAF = null;

  constructor(canvasContext, frameRate = 60) {
    this.canvasContext = canvasContext;
    this.frameRate = frameRate;
    this.frameDuration = 1000 / frameRate;
    this.lastFrame = 0;
    this.isRunning = false;
  }

  animateFrame = () => {
    if (!this.isRunning) {
      cancelAnimationFrame(this.rAF);

      return;
    }

    const currentFrame = performance.now();
    const delta = currentFrame - this.lastFrame;

    if (delta > this.frameDuration) {
      this.lastFrame = currentFrame;
      this.canvasContext.render();
    }

    this.rAF = requestAnimationFrame(this.animateFrame);
  };

  start() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    this.lastFrame = performance.now();
    this.animateFrame();
  }

  stop() {
    this.isRunning = false;
  }
}
