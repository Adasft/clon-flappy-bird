import { ResourceCategories } from "../enums.js";
import DrawableImage from "../drawables/drawable-image.js";
import DrawableSpriteSheet from "../drawables/drawable-spritesheet.js";
import DrawableText from "../drawables/drawable-text.js";
import { createFormatterErrors } from "../utils.js";
import DrawableTileSprite from "../drawables/drawable-tile-sprite.js";

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
    tileSprite: this._addDrawableTileSprite.bind(this),
    text: this._addDrawableText.bind(this),
  };

  constructor(resources) {
    this._resources = resources;
    this._formatError = createFormatterErrors(SceneDrawablesAggregator);
  }

  get drawables() {
    return this._drawables;
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  _getCategory(key, categories) {
    const categoriesNotFound = [];
    let resource;

    for (const category of categories) {
      if (!this._resources.has(category)) {
        categoriesNotFound.push(category);
        continue;
      }

      const resourceCategory = this._resources.get(category);

      resource = resourceCategory.get(key);

      if (resource) break;
    }

    const resourceNotFound = !resource;

    if (resourceNotFound && categoriesNotFound.length > 0) {
      throw new Error(
        `Resource category not found: ${categoriesNotFound.join(", ")}`
      );
    }

    if (resourceNotFound) {
      throw new Error(`Resource not found: ${key}`);
    }

    return resource;
  }

  _getLoadedResource(key, ...categories) {
    try {
      const categoriesNotFound = [];
      let resource;

      for (const category of categories) {
        if (!this._resources.has(category)) {
          categoriesNotFound.push(category);
          continue;
        }

        const resourceCategory = this._resources.get(category);

        resource = resourceCategory.get(key);

        if (resource) break;
      }

      const isResourceNotFound = !resource;

      if (isResourceNotFound && categoriesNotFound.length > 0) {
        throw new Error(
          `Resource category not found: ${categoriesNotFound.join(", ")}`
        );
      }

      if (isResourceNotFound) {
        throw new Error(`Resource not found: ${key}`);
      }

      return [null, resource];
    } catch (error) {
      return [error, null];
    }
  }

  _addDrawableImage(key, x = 0, y = 0, width, height) {
    const [error, resource] = this._getLoadedResource(
      key,
      ResourceCategories.IMAGE
    );

    if (error) {
      console.error(
        this._formatError(`Image with key '${key}' was not found.`, error)
      );
      return;
    }

    const drawableImage = new DrawableImage(resource, { width, height });
    drawableImage.x = x;
    drawableImage.y = y;

    this._drawables.push(drawableImage);
    return drawableImage;
  }

  _addDrawableSprite(key, x = 0, y = 0) {
    const [error, resource] = this._getLoadedResource(
      key,
      ResourceCategories.SPRITESHEET
    );

    if (error) {
      console.error(
        this._formatError(`Sprite with key ${key} was not found.`, error)
      );
      return;
    }

    const drawableSprite = new DrawableSpriteSheet(resource.data, {
      ...resource.config,
    });
    drawableSprite.x = x;
    drawableSprite.y = y;

    this._drawables.push(drawableSprite);
    return drawableSprite;
  }

  _addDrawableTileSprite(key, x, y, width, height) {
    const [error, resource] = this._getLoadedResource(
      key,
      ResourceCategories.IMAGE,
      ResourceCategories.SPRITESHEET
    );

    if (error) {
      console.error(
        this._formatError(
          `Image or Sprite with key ${key} was not found.`,
          error
        )
      );
      return;
    }

    const tileSprite = resource.data ?? resource;
    const drawableTileSprite = new DrawableTileSprite(tileSprite, {
      width,
      height,
      ...(resource.config ?? {}),
    });
    drawableTileSprite.x = x;
    drawableTileSprite.y = y;

    this._drawables.push(drawableTileSprite);
    return drawableTileSprite;
  }

  _addDrawableText(text, x, y) {
    const drawableText = new DrawableText(text);

    drawableText.x = x;
    drawableText.y = y;

    this._drawables.push(drawableText);

    return drawableText;
  }
}
