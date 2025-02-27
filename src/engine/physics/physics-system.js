import { createVector } from "../utils.js";

export default class PhysicsSystem {
  _isEnabled = false;
  _gravity = createVector(300, 300);
  _worldBounds = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  _timeScale = 1;
  _friction = 1;
  _drag = 0;

  _orchestrators = {
    enable: this._enable.bind(this),
    disable: this._disable.bind(this),
    getDefaults: () => this.defaults,
    getWordBounds: () => this.worldBounds,
    getTimeScale: () => this.timeScale,
  };

  constructor(game) {
    this.game = game;
    this._worldBounds.width = this.game.sys.width;
    this._worldBounds.height = this.game.sys.height;
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  get isEnabled() {
    return this._isEnabled;
  }

  get worldBounds() {
    return this._worldBounds;
  }

  get timeScale() {
    return this._timeScale;
  }

  get defaults() {
    return {
      gravity: this._gravity,
      friction: this._friction,
      drag: this._drag,
    };
  }

  _enable(config) {
    this._isEnabled = true;

    if (config) {
      const {
        gravity,
        worldBounds = {},
        timeScale = 1,
        friction = 1,
        drag = 0,
      } = config;

      this._gravity.set(gravity?.x, gravity?.y);
      this._worldBounds = { ...worldBounds, ...this._worldBounds };
      this._timeScale = timeScale;
      this._friction = friction;
      this._drag = drag;
    }
  }

  _disable() {
    this._isEnabled = false;
  }
}
