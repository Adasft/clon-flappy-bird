import { noop } from "../utils.js";
import SceneDrawablesAggregator from "./scene-drawables-aggregator.js";

export default class Scene {
  name;
  game;
  behavior;
  _engine;
  _aggregator;
  _isPaused = false;

  static make(Ctor, { name, engine, getAngleMode, behavior, states }) {
    if (states?.onCreate) {
      Ctor.prototype.onCreate = states.onCreate;
    }

    if (states?.onUpdate) {
      Ctor.prototype.onUpdate = states.onUpdate;
    }

    const scene = new Ctor();

    scene.name = name;
    scene.game = engine.context;
    scene.behavior = behavior;
    scene._engine = engine;
    scene._getAngleMode = getAngleMode;

    scene._aggregator = new SceneDrawablesAggregator(engine.loader.resources);

    return scene;
  }

  /**
   * Gets the aggregator for adding resources.
   * @returns {SceneDrawablesAggregator} - The aggregator instance.
   */
  get add() {
    return this._aggregator.getOrchestrators();
  }

  get isPaused() {
    return this._isPaused;
  }

  get angleMode() {
    return this._engine.angleMode;
  }

  start() {
    this._isPaused = false;
  }

  pause() {
    this._isPaused = true;
  }

  drawDrawables(ctx) {
    for (const drawable of this._aggregator.drawables) {
      drawable.draw(ctx);
    }
  }
}

Scene.prototype.onCreate = noop;
Scene.prototype.onUpdate = noop;
