import { loadImage, loadAudio } from "./utils.js";
import { ResourceCategories } from "./enums.js";

export default class Loader {
  _resourceLoaderStrategies = {
    [ResourceCategories.IMAGE]: loadImage,
    [ResourceCategories.AUDIO]: loadAudio,
  };

  /**
   * @type {Map<"images" | "audios" | "spritesheets", Map<string, Resource>>}
   */
  _resources = new Map();

  _loaders = {
    image: this._loadImage.bind(this),
    audio: this._loadAudio.bind(this),
    spritesheet: this._loadSpritesheet.bind(this),
  };

  get resources() {
    return this._resources;
  }

  getLoaders() {
    return this._loaders;
  }

  async _loadResource(type, url) {
    try {
      const methodToLoad = this._resourceLoaderStrategies[type];
      if (!methodToLoad) throw new Error(`Unknown resource type: ${type}`);
      const resource = await methodToLoad(url);
      return [null, resource];
    } catch (error) {
      return [error, null];
    }
  }

  _saveResource(category, key, resource) {
    if (!this._resources.has(category)) {
      this._resources.set(category, new Map());
    }

    const resourceCategory = this._resources.get(category);
    resourceCategory.set(key, resource);
  }

  async _loadImage(key, url) {
    const CATEGORY = ResourceCategories.AUDIO;
    const [error, resourImage] = this._loadResource(CATEGORY, url);

    if (error) {
      console.error(
        "GameEngine [Loader Error]: The image could not be loaded. Verify that the URL is correct",
        error
      );
      return;
    }

    this._saveResource(CATEGORY, key, resourImage);
  }

  async _loadAudio(key, url) {
    const CATEGORY = ResourceCategories.AUDIO;
    const [error, resourAudio] = this._loadResource(CATEGORY, url);

    if (error) {
      console.error(
        "GameEngine [Loader Error]: The audio file could not be loaded. Verify that the URL is correct and the format is supported."
      );
      return;
    }

    this._saveResource(CATEGORY, key, resourAudio);
  }

  async _loadSpritesheet(key, url, config) {
    const CATEGORY = ResourceCategories.SPRITESHEET;
    const [error, resourSprite] = this._loadResource(
      ResourceCategories.IMAGE,
      url
    );

    if (error) {
      console.error(
        "GameEngine [Loader Error]: Error loading sprite. Make sure the file exists and is in the correct format."
      );
      return;
    }

    this._saveResource(CATEGORY, key, { data: resourSprite, config });
  }
}
