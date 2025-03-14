export default class StepFrame {
  rAF = null;

  static _frameTimeoutCallbacks = new Map();

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

  step = (time) => {
    const currentFrame = performance.now();
    const delta = currentFrame - this.lastFrame;

    if (this.limitFps) {
      if (delta >= this.frameDuration) {
        this.lastFrame = currentFrame - (delta % this.frameDuration);
        this.canvasContext.render(time, delta);
      }
    } else {
      this.lastFrame = currentFrame;
      this.canvasContext.render(time, delta);
    }

    this._executeExpiredFrameTimeouts(time);

    this.rAF = requestAnimationFrame(this.step);
  };

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastFrame = performance.now();
    this.step();
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.rAF);
  }

  static createTimeout(cb, duration) {
    return StepFrame._registerFrameTimeout({
      cb,
      duration,
      createdAt: performance.now(),
    });
  }

  static cleatTimeout(id) {
    StepFrame._unregisterFrameTimeout(id);
  }

  _executeExpiredFrameTimeouts(time) {
    if (StepFrame._frameTimeoutCallbacks.size === 0) return;

    for (const [
      id,
      { cb, duration, createdAt },
    ] of StepFrame._frameTimeoutCallbacks) {
      const elapsedTime = time - createdAt;

      if (elapsedTime >= duration) {
        cb(time);
        StepFrame.cleatTimeout(id);
      }
    }
  }

  static _registerFrameTimeout(frameTimeout) {
    const id = this._frameTimeoutCallbacks.size;
    this._frameTimeoutCallbacks.set(id, frameTimeout);
    return id;
  }

  static _unregisterFrameTimeout(frameTimeoutId) {
    if (!this._frameTimeoutCallbacks.has(frameTimeoutId)) return;
    this._frameTimeoutCallbacks.delete(frameTimeoutId);
  }
}
