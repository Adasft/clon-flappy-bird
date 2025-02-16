export default class Animator {
  rAF = null;

  constructor(canvasContext, frameRate = 60) {
    this.canvasContext = canvasContext;
    this.frameRate = frameRate;
    this.frameDuration = 1000 / frameRate;
    this.lastFrame = performance.now();
    this.accumulator = 0;
    this.isRunning = false;
  }

  animateFrame = () => {
    if (!this.isRunning) {
      cancelAnimationFrame(this.rAF);
      return;
    }

    const currentFrame = performance.now();
    const delta = currentFrame - this.lastFrame;
    this.lastFrame = currentFrame;
    this.accumulator += delta;

    while (this.accumulator >= this.frameDuration) {
      this.canvasContext.render();
      this.accumulator -= this.frameDuration;
    }

    this.rAF = requestAnimationFrame(this.animateFrame);
  };

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastFrame = performance.now();
    this.accumulator = 0;
    this.animateFrame();
  }

  stop() {
    this.isRunning = false;
  }
}
