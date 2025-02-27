import { SceneBehavior } from "../enums.js";
import { createFormatterErrors, when } from "../utils.js";
import Scene from "./scene.js";

export default class ScenesManager {
  _scenes = new Map();

  _renderedScenes = new Set();

  _currentScene = null;

  _orchestrators = {
    add: this._registerScene.bind(this),
    start: this._activateScene.bind(this),
    get: (name) => this._scenes.get(name),
  };

  constructor(engine) {
    this._engine = engine;
    this._formatError = createFormatterErrors(ScenesManager);
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  display(ctx, { time, delta }) {
    for (const scene of this._renderedScenes) {
      scene.display(ctx, { time, delta });
    }
  }

  create() {
    for (const scene of this._scenes.values()) {
      scene.onCreate();
    }
  }

  /**
   * Create a new scene.
   *
   * @param {string} name - The name of the scene.
   * @param {new () => Scene | {onCreate: () => void, onUpdate: () => void}} scene - The scene class or object.
   * @param {SceneBehavior} behavior - The behavior of the scene when another scene is started.
   * @returns {Scene}
   */
  _registerScene(name, scene, behavior) {
    if (this._scenes.has(name)) {
      throw this._formatError(`Scene already exists: ${name}`);
    }

    const isCtor = typeof scene === "function";
    const sceneStates = isCtor ? null : scene;
    const sceneInstance = Scene.make(isCtor ? scene : Scene, {
      name,
      engine: this._engine,
      behavior,
      states: sceneStates,
    });

    this._scenes.set(name, sceneInstance);

    return sceneInstance;
  }

  _activateScene(name) {
    const scene = this._scenes.get(name);

    if (!scene) {
      throw this._formatError(`Scene not found: ${name}`);
    }

    if (!this._engine.running) {
      this._engine.run();
    }

    /**
     * Scene behaviors:
     * - DESTROY: The previous scene is destroyed.
     * - PAUSE: The previous scene is paused.
     * - PARALLEL: The previous scene is not destroyed.
     */
    const previousScene = this.currentScene;

    if (previousScene) {
      when(previousScene.behavior, {
        [SceneBehavior.DESTROY]: () =>
          this._renderedScenes.delete(previousScene),
        [SceneBehavior.PAUSE]: () => previousScene.pause(),
      });
    }

    this.currentScene = scene;
    this._renderedScenes.add(scene);
    scene.start();
  }
}
