import Animator from "../animations/animator.js";
import PhysicsSystem from "../physics/physics-system.js";
import { noop } from "../utils.js";
import DrawableFactory from "./drawable-factory.js";

export default class Scene {
  name;
  game;
  behavior;
  _engine;
  _drawableFactory;
  _physicsSystem;
  _animator;
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

    scene._drawableFactory = new DrawableFactory(
      scene,
      engine.loader.resources
    );

    scene._animator = new Animator(scene);
    scene._physicsSystem = new PhysicsSystem(engine.context);

    return scene;
  }

  /**
   * Gets the aggregator for adding resources.
   * @returns {DrawableFactory} - The aggregator instance.
   */
  get add() {
    return this._drawableFactory.getOrchestrators();
  }

  get anims() {
    return this._animator.getOrchestrators();
  }

  get physics() {
    return this._physicsSystem.getOrchestrators();
  }

  get isPaused() {
    return this._isPaused;
  }

  get angleMode() {
    return this._engine.angleMode;
  }

  get enabledPhysics() {
    return this._physicsSystem.isEnabled;
  }

  getDrawable(key) {
    return this._drawableFactory.find(key);
  }

  hasDrawable(key) {
    return this._drawableFactory.has(key);
  }

  start() {
    this._isPaused = false;
  }

  pause() {
    this._isPaused = true;
  }

  display(ctx, { time, delta }) {
    if (!this.isPaused) {
      this.onUpdate(time, delta);
      this._animator.playAll(time);
    }
    this._drawableFactory.render(ctx, { time, delta }, this.enabledPhysics);
  }
}

Scene.prototype.onCreate = noop;
Scene.prototype.onUpdate = noop;
