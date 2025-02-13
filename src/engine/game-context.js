export default class GameContext {
  running = false;

  constructor(loader, scenesManager, animator) {
    this._loader = loader;
    this._scenesManager = scenesManager;
    this._animator = animator;
  }

  get load() {
    return this._loader.getOrchestrators();
  }

  get scene() {
    return this._scenesManager.getOrchestrators();
  }

  play() {
    this._animator.start();
    this.running = true;
  }

  pause() {
    this._animator.stop();
    this.running = false;
  }
}
