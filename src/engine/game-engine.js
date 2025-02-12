import { Animator } from "./animator.js";
import {
  CanvasBackgroundImageFit,
  CanvasBackgroundImagePosition,
  SceneBehavior,
} from "./enums.js";
import Loader from "./loader.js";
import Scene from "./scene/scene.js";
import { loadImage, noop } from "./utils.js";

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

  display(ctx) {
    for (const scene of this._renderedScenes) {
      if (scene.isPaused) continue;
      scene.onUpdate();
      scene.drawDrawables(ctx);
    }
  }

  create() {
    for (const scene of this._scenes.values()) {
      scene.onCreate();
    }
  }
}

class GameContext {
  constructor(loader, scenesManager) {
    this._loader = loader;
    this._scenesManager = scenesManager;
  }

  get load() {
    return this._loader.getOrchestrators();
  }

  get scene() {
    return this._scenesManager.getOrchestrators();
  }
}

const CanvasBackgroundType = {
  IMAGE: "image",
  COLOR: "color",
};

class CanvasContext {
  _isMounted = false;

  _background = {
    image: {
      node: null,
      url: null,
      width: null,
      height: null,
      x: 0,
      y: 0,
    },
    color: null,
  };

  _backgroundType = CanvasBackgroundType.COLOR;

  constructor({
    parentRenderer,
    scenesManager,
    background,
    context,
    aspectRatio,
    scale,
  }) {
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext(context);
    this._parentRenderer = parentRenderer;
    this._aspectRatio = aspectRatio;
    this._scale = scale;
    this._scenesManager = scenesManager;

    if (!this._parentRenderer?.isConnected) {
      throw new Error(
        "GameEngine [CanvasContext Error]: Parent renderer is not connected to the DOM"
      );
    }

    this._adjustViewport();
    this._configBackground(background);
  }

  get aspectRatio() {
    return this._aspectRatio;
  }

  get canvas() {
    return this._canvas;
  }

  get ctx() {
    return this._context;
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  get isMounted() {
    return this._isMounted;
  }

  mount() {
    if (this._isMounted) return;

    if (!this._parentRenderer) {
      throw new Error(
        "GameEngine [CanvasContext Error]: Parent renderer is not defined"
      );
    }

    this._parentRenderer.appendChild(this._canvas);
    this._isMounted = true;
  }

  drawBackground() {
    this._context.save();
    if (this._backgroundType === CanvasBackgroundType.IMAGE) {
      this._context.drawImage(
        this._background.image.node,
        this._background.image.x,
        this._background.image.y,
        this._background.image.width,
        this._background.image.height
      );
    } else {
      this._context.fillStyle = this._background.color;
      this._context.fillRect(0, 0, this.width, this.height);
    }
    this._context.restore();
  }

  render() {
    this._context.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    this._scenesManager.display(this._context);
  }

  _calcBackgroundDimensionForContainFit() {
    const { width, height } = this._background.image.node;
    const imageAspectRatio = width / height;

    if (imageAspectRatio > this._aspectRatio) {
      return {
        width: this.width,
        height: this.width / imageAspectRatio,
      };
    }

    return {
      width: this.height * imageAspectRatio,
      height: this.height,
    };
  }

  _calcBackgroundDimensionForCoverFit() {
    const { width, height } = this._background.image.node;
    const imageAspectRatio = width / height;

    if (imageAspectRatio > this._aspectRatio) {
      return {
        width: this.height * imageAspectRatio,
        height: this.height,
      };
    }

    return {
      width: this.width,
      height: this.width / imageAspectRatio,
    };
  }

  _calcBackgroundImgDimensions() {
    if (!this._background.image.node) {
      throw new Error(
        "GameEngine [CanvasContext Error]: Background image is not defined"
      );
    }

    const { fit, width, height } = this._background.image;

    switch (fit) {
      case CanvasBackgroundImageFit.CONTAIN:
        return this._calcBackgroundDimensionForContainFit();
      case CanvasBackgroundImageFit.COVER:
        return this._calcBackgroundDimensionForCoverFit();
      case CanvasBackgroundImageFit.FILL:
        return { width: this.width, height: this.height };
      default:
        const { width: naturalWidth, height: naturalHeight } =
          this._background.image.node;
        return {
          width: width ?? naturalWidth,
          height: height ?? naturalHeight,
        };
    }
  }

  _configBackgroundImgDimensions() {
    const { width, height } = this._calcBackgroundImgDimensions();

    this._background.image.width = width;
    this._background.image.height = height;
  }

  _calcBackgroundPositionForX(position) {
    switch (position) {
      case CanvasBackgroundImagePosition.CENTER:
        return (this.width - this._background.image.width) / 2;
      case CanvasBackgroundImagePosition.LEFT:
        return 0;
      case CanvasBackgroundImagePosition.RIGHT:
        return this.width - this._background.image.width;
      default:
        return position;
    }
  }

  _calcBackgroundPositionForY(position) {
    switch (position) {
      case CanvasBackgroundImagePosition.CENTER:
        return (this.height - this._background.image.height) / 2;
      case CanvasBackgroundImagePosition.TOP:
        return 0;
      case CanvasBackgroundImagePosition.BOTTOM:
        return this.height - this._background.image.height;
      default:
        return position;
    }
  }

  _calcBackgroundImgPosition() {
    if (!this._background.image.node) {
      throw new Error(
        "GameEngine [CanvasContext Error]: Background image is not defined"
      );
    }

    const { positions, x, y } = this._background.image;

    const bgPositionX = positions?.x
      ? this._calcBackgroundPositionForX(positions.x)
      : x ?? 0;
    const bgPositionY = positions?.y
      ? this._calcBackgroundPositionForY(positions.y)
      : y ?? 0;

    return { x: bgPositionX, y: bgPositionY };
  }

  _configBackgroundImgPosition() {
    const { x, y } = this._calcBackgroundImgPosition();

    this._background.image.x = x;
    this._background.image.y = y;
  }

  async _configBackground({ image, color }) {
    if (image) {
      try {
        const { url, width, height, fit, positions, x, y } = image;
        const bgImage = await loadImage(url);

        Object.assign(this._background.image, {
          node: bgImage,
          url,
          fit: fit ?? CanvasBackgroundImageFit.NONE,
          positions,
          width,
          height,
          x,
          y,
        });

        this._configBackgroundImgDimensions();
        this._configBackgroundImgPosition();

        this._backgroundType = CanvasBackgroundType.IMAGE;
      } catch (error) {
        console.error(
          "GameEngine [CanvasContext Error]: The background image could not be loaded. Verify that the URL is correct",
          error
        );
      }
    } else {
      this._background.color = color;
      this._backgroundType = CanvasBackgroundType.COLOR;
    }
  }

  _adjustViewport() {
    const { width, height } = this._parentRenderer.getBoundingClientRect();
    const aspectRatio = width / height;

    if (aspectRatio > this._aspectRatio) {
      this._canvas.width = height * this._aspectRatio * this._scale;
      this._canvas.height = height * this._scale;
    } else {
      this._canvas.width = width * this._scale;
      this._canvas.height = (width / this._aspectRatio) * this._scale;
    }

    this._context.imageSmoothingEnabled = false;
    this._context.scale(this._scale, this._scale);
  }
}

export default class GameEngine {
  isRunning = false;

  constructor({
    parentRenderer,
    aspectRatio,
    background: { image = null, color = "#FFF" } = {},
    scale,
    frameRate,
    preload = noop,
  }) {
    this._parentRenderer = parentRenderer;
    this._aspectRatio = aspectRatio;
    this._scale = scale;
    this._frameRate = frameRate;
    this._preload = preload;

    this._loader = new Loader();
    this._scenesManager = new ScenesManager(this);

    this._canvasContext = new CanvasContext({
      parentRenderer,
      context: "2d",
      aspectRatio,
      scale,
      background: { image, color },
      scenesManager: this._scenesManager,
    });

    this._gameContext = new GameContext(this._loader, this._scenesManager);
    this._animator = new Animator(this._canvasContext, frameRate);
  }

  get canvasContext() {
    return this._canvasContext;
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

  render(onRender) {
    this._prepareScenes();
    this._canvasContext.mount();
    onRender();
    this.play();
  }

  play() {
    this._animator.start();
    this.isRunning = true;
  }

  pause() {
    this._animator.stop();
    this.isRunning = false;
  }

  async _prepareScenes() {
    await this._triggerPreload();
    this._scenesManager.create();
  }

  _triggerPreload() {
    return new Promise(async (resolve) => {
      await this._preload.call(this._gameContext);
      resolve();
    });
  }
}

export function createGame(config) {
  const engine = new GameEngine(config);
  return {
    game: engine.gameContext,
    render: (onRender) => engine.render(onRender),
  };
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
