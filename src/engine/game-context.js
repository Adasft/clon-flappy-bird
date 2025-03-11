export default class GameContext {
  constructor(engine) {
    this._engine = engine;
  }

  get load() {
    return this._engine.loader.getOrchestrators();
  }

  get scene() {
    return this._engine.scenes.getOrchestrators();
  }

  get input() {
    return {
      keyboard: this._engine.input.keyboard.getOrchestrators(),
    };
  }

  set angleMode(mode) {
    this._engine.angleMode = mode;
  }

  get angleMode() {
    return this._engine.angleMode;
  }

  get sys() {
    return {
      width: this._engine.canvasContext.width,
      height: this._engine.canvasContext.height,
    };
  }

  play() {
    if (this._engine.running) return;
    this._engine.run();
  }

  pause() {
    this._engine.stop();
  }
}
