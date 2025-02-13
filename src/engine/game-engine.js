import Loader from "./loader.js";
import { noop } from "./utils.js";
import Animator from "./animator.js";
import ScenesManager from "./scene/scenes-manager.js";
import CanvasContext from "./canvas-context.js";
import GameContext from "./game-context.js";
import Scene from "./scene/scene.js";

export default class GameEngine {
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

    this._animator = new Animator(this._canvasContext, frameRate);
    this._context = new GameContext(
      this._loader,
      this._scenesManager,
      this._animator
    );
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

  get context() {
    return this._context;
  }

  render(renderCallback) {
    this._prepareScenes();
    this._canvasContext.mount();
    renderCallback();
    this.play();
  }

  play() {
    this._context.play();
  }

  pause() {
    this._context.pause();
  }

  async _loadResources() {
    const values = await this._loader.loadResources();

    values.forEach(({ status, reason }) => {
      if (status === "rejected") {
        console.error(reason);
      }
    });
  }

  async _prepareScenes() {
    this._preload();

    await this._loadResources();

    this._scenesManager.create();
  }
}

function createGame(config) {
  const engine = new GameEngine(config);
  const gameContext = engine.context;

  return {
    game: gameContext,
    render: (renderCallback) => engine.render(renderCallback),
  };
}

export { Scene, createGame };

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
