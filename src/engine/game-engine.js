import Loader from "./loader.js";
import Scene from "./scene/scene.js";

class ScenesManager {
  constructor(scenes, game) {
    this.game = game;
    this._scenes = scenes;
  }

  add(name, options) {
    const scene = name instanceof Scene ? name : new Scene(name, options);

    scene.setGameContext(this.game);

    this._scenes.set(scene.name, scene);
  }

  start(name, options) {
    const scene = this._scenes.get(name);

    if (!scene) {
      throw new Error(`Scene not found: ${name}`);
    }

    const previusScene = this.game.currentScene;

    if (previusScene) {
      if (options.destroyPrevious) {
        previusScene.destroy();
        this._scenes.delete(previusScene.name);
      }
    }

    this.game.currentScene = scene;

    scene.onCreate(options);
  }
}

export default class GameEngine {
  /**
   * @type {Map<"images" | "audios" | "spritesheets", Map<string, Resource>>}
   */
  _resources = new Map();

  _scenes = new Map();

  currentScene = null;

  constructor({ parentRenderer, aspectRatio, scale, frameRate }) {
    this._parentRenderer = parentRenderer;
    this._aspectRatio = aspectRatio;
    this._scale = scale;
    this._frameRate = frameRate;

    this._loader = new Loader(this._resources);
    this._scenesManager = new ScenesManager(this._scenes, this);
  }

  get resources() {
    return this._resources;
  }

  get load() {
    return this._loader;
  }

  get scene() {
    return this._scenesManager;
  }

  getResource(category, key) {
    if (!this._resources.has(category)) {
      throw new Error(`Resource category not found: ${category}`);
    }

    const resourceCategory = this._resources.get(category);
    const resource = resourceCategory.get(key);

    if (!resource) {
      throw new Error(`Resource not found: ${key}`);
    }

    return resource;
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
