import { ResourceCategories } from "../enums.js";
import DrawableImage from "../drawables/drawable-image.js";
import DrawableSpriteSheet from "../drawables/drawable-spritesheet.js";
import DrawableText from "../drawables/drawable-text.js";

/**
 * @interface Orchestrator
 * @description Interface for orchestrators.
 * @function
 * @name Orchestrator#getOrchestrators
 * @returns {Object<string, Function>} - The orchestrators.
 * @implements {Orchestrator}
 *
 */
export default class SceneDrawablesAggregator {
  /**
   * @type {Array<Drawable>}
   */
  _drawables = [];

  _orchestrators = {
    image: this._addDrawableImage.bind(this),
    sprite: this._addDrawableSprite.bind(this),
    text: this._addDrawableText.bind(this),
  };

  constructor(resources) {
    this._resources = resources;
  }

  get drawables() {
    return this._drawables;
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  _getLoadedResource(category, key) {
    try {
      if (!this._resources.has(category)) {
        throw new Error(`Resource category not found: ${category}`);
      }

      const resourceCategory = this._resources.get(category);
      const resource = resourceCategory.get(key);

      if (!resource) {
        throw new Error(`Resource not found: ${key}`);
      }

      return [null, resource];
    } catch (error) {
      return [error, null];
    }
  }

  _addDrawableImage(key, x = 0, y = 0, width = 0, height = 0) {
    const [error, resource] = this._getLoadedResource(
      ResourceCategories.IMAGE,
      key
    );

    if (error) {
      console.error(
        `GameEngine [Aggregator Error]: Image with key '${key}' was not found.`,
        error
      );
      return;
    }

    const drawableImage = new DrawableImage(resource);
    drawableImage.x = x;
    drawableImage.y = y;
    drawableImage.width = width;
    drawableImage.height = height;

    this._drawables.push(drawableImage);
    return drawableImage;
  }

  _addDrawableSprite(key, x = 0, y = 0, width, height) {
    const [error, resource] = this._getLoadedResource(
      ResourceCategories.SPRITESHEET,
      key
    );

    if (error) {
      console.error(
        `GameEngine [Aggregator Error]: Sprite with key ${key} was not found.`,
        error
      );
      return;
    }

    const drawableSprite = new DrawableSpriteSheet(resource.data, {
      ...resource.config,
    });
    drawableSprite.x = x;
    drawableSprite.y = y;
    drawableSprite.width = width;
    drawableSprite.height = height;

    this._drawables.push(drawableSprite);
    return drawableSprite;
  }

  _addDrawableText(text, x, y) {
    const drawableText = new DrawableText(text);

    drawableText.x = x;
    drawableText.y = y;

    this._drawables.push(drawableText);

    return drawableText;
  }
}
