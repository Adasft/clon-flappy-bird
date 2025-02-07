import SceneDrawablesAggregator from "./scene-drawables-aggregator.js";

/**
 * Class representing a scene in the game.
 */
export default class Scene {
  /**
   * @type {Array<Drawable>}
   */
  _drawables = [];

  /**
   * Creates a new Scene.
   * @param {string} name - The name of the scene.
   * @param {Object} options - The options for the scene.
   * @param {Function} [options.onCreate] - The onCreate callback.
   * @param {Function} [options.onUpdate] - The onUpdate callback.
   */
  constructor(name, options) {
    this.name = name;

    if (options) {
      const { onCreate, onUpdate } = options;
      this.onCreate = onCreate;
      this.onUpdate = onUpdate;
    }
  }

  /**
   * Gets the aggregator for adding resources.
   * @returns {SceneDrawablesAggregator} - The aggregator instance.
   */
  get add() {
    return this._aggregator;
  }

  /**
   * Sets the game context.
   * @param {GameEngine} game - The game instance.
   */
  setGameContext(game) {
    this.game = game;

    if (!this._aggregator) {
      this._aggregator = new SceneDrawablesAggregator(
        this._drawables,
        this.game
      );
    }
  }
}
