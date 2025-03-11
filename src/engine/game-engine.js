import Loader from "./loader.js";
import { createFormatterErrors, noop } from "./utils.js";
import StepFrame from "./step-frame.js";
import ScenesManager from "./scene/scenes-manager.js";
import CanvasContext from "./canvas-context.js";
import GameContext from "./game-context.js";
import Scene from "./scene/scene.js";
import {
  CanvasBackgroundImageFit,
  CanvasBackgroundImagePosition,
  SceneBehavior,
  AngleMode,
} from "./enums.js";
import GameInput from "./input/game-input.js";

export default class GameEngine {
  running = false;

  constructor({
    parentRenderer,
    aspectRatio,
    background: { image = null, color = "#FFF" } = {},
    scale,
    frameRate,
    angleMode = AngleMode.RADIANS,
    playOnRender = true,
    onPreload = noop,
    onRender = noop,
    onLoadingProgress = noop,
  }) {
    this._parentRenderer = parentRenderer;
    this._aspectRatio = aspectRatio;
    this._scale = scale;
    this._frameRate = frameRate;
    this._angleMode = angleMode;
    this._playOnRender = playOnRender;
    this.onPreload = onPreload;
    this.onRender = onRender;
    this.onLoadingProgress = onLoadingProgress;

    this._formatError = createFormatterErrors(GameEngine);

    this._loader = new Loader(this.onLoadingProgress);
    this._scenes = new ScenesManager(this);

    this._canvasContext = new CanvasContext({
      parentRenderer,
      context: "2d",
      aspectRatio,
      scale,
      background: { image, color },
      scenesManager: this._scenes,
    });

    this._input = new GameInput(this._canvasContext);

    this._stepFrame = new StepFrame(this._canvasContext, { frameRate });
    this._context = new GameContext(this);
  }

  get canvasContext() {
    return this._canvasContext;
  }

  get loader() {
    return this._loader;
  }

  get scenes() {
    return this._scenes;
  }

  get input() {
    return this._input;
  }

  get context() {
    return this._context;
  }

  set onPreload(callback) {
    if (typeof callback !== "function") {
      throw this._formatError("Invalid preload method");
    }
    this._onPreload = callback;
  }

  get onPreload() {
    return this._onPreload;
  }

  set onRender(callback) {
    if (typeof callback !== "function") {
      throw this._formatError("Invalid render method");
    }
    this._onRender = callback;
  }

  get onRender() {
    return this._onRender;
  }

  set onLoadingProgress(callback) {
    if (typeof callback !== "function") {
      throw this._formatError("Invalid loading progress method");
    }
    this._onLoadingProgress = callback;
  }

  get onLoadingProgress() {
    return this._onLoadingProgress;
  }

  set angleMode(mode) {
    if (!Object.values(AngleMode).includes(mode)) {
      throw this._formatError("Invalid angle mode");
    }
    this._angleMode = mode;
  }

  get angleMode() {
    return this._angleMode;
  }

  async render() {
    this._canvasContext.mount();

    await this.preload();

    this._scenes.create();

    this.onRender();

    if (this._playOnRender) {
      this.run();
    }
  }

  run() {
    this._stepFrame.start();
    this.running = true;
  }

  stop() {
    this._stepFrame.stop();
    this.running = false;
  }

  async preload() {
    this.onPreload();

    const values = await this._loader.loadResources();

    values.forEach(({ status, reason }) => {
      if (status === "rejected") {
        console.error(reason);
      }
    });
  }
}

function createGame(config) {
  const engine = new GameEngine(config);
  const gameContext = engine.context;

  return {
    game: gameContext,
    render: () => {
      console.log("render");
      engine.render();
    },
  };
}

export {
  Scene,
  createGame,
  CanvasBackgroundImagePosition as BackgroundPosition,
  CanvasBackgroundImageFit as BackgroundFit,
  SceneBehavior,
  AngleMode,
};

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
