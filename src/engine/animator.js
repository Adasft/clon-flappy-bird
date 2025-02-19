export default class Animator {
  rAF = null;

  /**
   * @param {Object} canvasContext - Objeto que contiene el método render().
   * @param {Object} options - Opciones de configuración.
   * @param {boolean} [options.limitFps=true] - Indica si se debe limitar los FPS.
   * @param {number} [options.frameRate=60] - FPS objetivo si se limita la animación.
   */
  constructor(canvasContext, { limitFps = false, frameRate = 60 } = {}) {
    this.canvasContext = canvasContext;
    this.limitFps = limitFps;
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

    if (this.limitFps) {
      if (delta >= this.frameDuration) {
        this.lastFrame = currentFrame - (delta % this.frameDuration);
        this.canvasContext.render();
      }
    } else {
      this.lastFrame = currentFrame;
      this.canvasContext.render();
    }

    this.rAF = requestAnimationFrame(this.animateFrame);
  };

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrame = performance.now();
    this.animateFrame();
  }

  stop() {
    this.isRunning = false;
  }
}
