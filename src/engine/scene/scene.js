import { SceneBehavior } from "../enums.js";
import { noop } from "../utils.js";
import SceneDrawablesAggregator from "./scene-drawables-aggregator.js";

/**
 * Class representing a scene in the game.
 */
export default class Scene {
  behavior = SceneBehavior.DESTROY;
  _isPaused = false;

  static make(Ctor, { name, gameContext, loader, behavior, states }) {
    if (states?.onCreate) {
      Ctor.prototype.onCreate = states.onCreate;
    }

    if (states?.onUpdate) {
      Ctor.prototype.onUpdate = states.onUpdate;
    }

    const scene = new Ctor();

    scene.name = name;
    scene.game = gameContext;
    scene.behavior = behavior;

    scene._aggregator = new SceneDrawablesAggregator(loader.resources);

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

  start() {
    this._isPaused = false;
  }

  pause() {
    this._isPaused = true;
  }

  drawDrawables(ctx) {
    for (const drawable of this._aggregator.drawables) {
      drawable.draw(ctx);
      // console.log(drawable);
    }
  }
}

Scene.prototype.onCreate = noop;
Scene.prototype.onUpdate = noop;
