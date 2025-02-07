import { ResourceCategories } from "../enums.js";
import DrawableImage from "../drawables/drawable-image.js";
import DrawableSpriteSheet from "../drawables/drawable-spritesheet.js";
import DrawableText from "../drawables/drawable-text.js";

/**
 * Class responsible for aggregating drawable resources.
 */
export default class SceneDrawablesAggregator {
  constructor(drawables, game) {
    this.game = game;
    this._drawables = drawables;
  }

  /**
   * Retrieves a resource from the game.
   * @param {string} category - The category of the resource.
   * @param {string} key - The key of the resource.
   * @returns {[Error|null, Resource]} - An array containing an error or the resource.
   */
  getResource(category, key) {
    try {
      const resource = this.game.getResource(category, key);
      return [null, resource];
    } catch (error) {
      return [error, null];
    }
  }

  /**
   * Adds an image to the drawables list.
   * @param {string} key - The key of the image resource.
   * @param {number} [x=0] - The x-coordinate of the image.
   * @param {number} [y=0] - The y-coordinate of the image.
   * @param {number} [width=0] - The width of the image.
   * @param {number} [height=0] - The height of the image.
   * @returns {DrawableImage} - The image resource.
   */
  image(key, x = 0, y = 0, width = 0, height = 0) {
    const [error, resource] = this.getResource(ResourceCategories.IMAGE, key);

    if (error) {
      console.error(
        `GameEngine [Aggregator Error]: Image with key ${key} was not found.`,
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

  /**
   * Adds a sprite to the drawables list.
   * @param {string} key - The key of the sprite resource.
   * @param {number} [x=0] - The x-coordinate of the sprite.
   * @param {number} [y=0] - The y-coordinate of the sprite.
   * @returns {DrawableSpriteSheet} - The sprite resource.
   */
  sprite(key, x = 0, y = 0) {
    const [error, resource] = this.getResource(
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

    this._drawables.push(drawableSprite);
    return drawableSprite;
  }

  text(text, x, y) {
    const resource = new DrawableText(text);

    resource.x = x;
    resource.y = y;

    this._drawables.push(resource);
    return resource;
  }
}
