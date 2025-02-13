import { SceneBehavior } from "../enums.js";
import { when } from "../utils.js";
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

  constructor(game) {
    this.game = game;
  }

  getOrchestrators() {
    return this._orchestrators;
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
      throw new Error(`Scene already exists: ${name}`);
    }

    const isCtor = typeof scene === "function";
    const sceneStates = isCtor ? null : scene;
    const sceneInstance = Scene.make(isCtor ? scene : Scene, {
      name,
      gameContext: this.game.context,
      loader: this.game.loader,
      behavior,
      states: sceneStates,
    });

    this._scenes.set(name, sceneInstance);

    return sceneInstance;
  }

  _activateScene(name) {
    const scene = this._scenes.get(name);

    if (!scene) {
      throw new Error(`Scene not found: ${name}`);
    }

    if (!this.game.isRunning) {
      this.game.play();
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

  display(ctx) {
    for (const scene of this._renderedScenes) {
      if (!scene.isPaused) {
        scene.onUpdate();
      }
      scene.drawDrawables(ctx);
    }
  }

  create() {
    for (const scene of this._scenes.values()) {
      scene.onCreate();
    }
  }
}
