export default class GameContext {
  constructor(engine) {
    this._engine = engine;
  }

  get load() {
    return this._engine.loader.getOrchestrators();
  }

  get scene() {
    return this._engine.scenesManager.getOrchestrators();
  }

  set angleMode(mode) {
    this._engine.angleMode = mode;
  }

  get angleMode() {
    return this._engine.angleMode;
  }

  play() {
    if (this._engine.running) return;
    this._engine.run();
  }

  pause() {
    this._engine.stop();
  }
}
