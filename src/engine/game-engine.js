import { SceneBehavior } from "./enums.js";
import Loader from "./loader.js";
import Scene from "./scene/scene.js";

class ScenesManager {
  _scenes = new Map();

  _renderedScenes = new Set();

  _currentScene = null;

  _orchestrators = {
    add: this._registerScene.bind(this),
    start: this._activateScene.bind(this),
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
      gameContext: this.game.gameContext,
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

    /**
     * Scene behaviors:
     * - DESTROY: The previous scene is destroyed.
     * - PAUSE: The previous scene is paused.
     * - PARALLEL: The previous scene is not destroyed.
     */
    const previousScene = this.currentScene;

    if (previousScene) {
      switch (previousScene.behavior) {
        case SceneBehavior.DESTROY:
          this._renderedScenes.delete(previousScene);
          break;
        case SceneBehavior.PAUSE:
          previousScene.pause();
          break;
      }
    }

    this.currentScene = scene;
    this._renderedScenes.add(scene);
    scene.start();
  }
}

class GameContext {
  constructor(loader, scenesManager) {
    this.loader = loader;
    this.scenesManager = scenesManager;
  }

  get load() {
    return this.loader.getLoaders();
  }

  get scene() {
    return this.scenesManager.getOrchestrators();
  }
}

export default class GameEngine {
  constructor({ parentRenderer, aspectRatio, scale, frameRate }) {
    this._parentRenderer = parentRenderer;
    this._aspectRatio = aspectRatio;
    this._scale = scale;
    this._frameRate = frameRate;

    this._loader = new Loader();
    this._scenesManager = new ScenesManager(this);
    this._gameContext = new GameContext(this._loader, this._scenesManager);
  }

  get loader() {
    return this._loader;
  }

  get scenesManager() {
    return this._scenesManager;
  }

  get gameContext() {
    return this._gameContext;
  }
}

// game.scene.add("main", {
//   onCreate() {
//     this.add.image("background", 0, 0, 800, 600);
//   },
//   onUpdate() {
//     // Update logic
//   },
// })

// game.scene.start("main", { keepPrevious: false });

// import { DESTROY_SCENE, PAUSE_SCENE, PARALLEL_SCENE } from "./enums.js";

// game.scene.add("main", {
//   onCreate() {
//     this.add.image("background", 0, 0, 800, 600);
//   },
//   onUpdate() {
//     // Update logic
//   },
// }, DESTROY_SCENE /* Como se va a comportar esta escena cuando se inicie otra escena */ );

// game.scene.start("preload", { behavior: DESTROY_PREVIOUS });
// game.scene.start("menu", { behavior: KEEP_PREVIOUS });
// game.scene.start("gameplay", { behavior: PARALLEL });

// game.scene.start("preload");
// game.scene.start.keepPrevious("menu");
// game.scene.start.parallel("gameplay");

/**
 * keepPrevious: true
 *  - La escena anterior no se destruye. Se pausa.
 * keepPrevious: false
 *  - La escena anterior se destruye. Se elimina de la cola de escenas.
 * parallel: true
 *  - La escena anterior no se destruye. Ambas escenas corren juntas.
 * parallel: false
 *  - La escena anterior se destruye. La escena anterior se elimina de la cola de escenas.
 */
