import { loadImage, loadAudio, when, createFormatterErrors } from "./utils.js";
import { ResourceCategories } from "./enums.js";

/**
 * @interface Orchestrator
 * @description Interface for orchestrators.
 * @function
 * @name Orchestrator#getOrchestrators
 * @returns {Object<string, Function>} - The orchestrators.
 * @implements {Orchestrator}
 *
 */
export default class Loader {
  _resourceLoaderStrategies = {
    [ResourceCategories.IMAGE]: loadImage,
    [ResourceCategories.AUDIO]: loadAudio,
  };

  /**
   * @type {Map<"images" | "audios" | "spritesheets", Map<string, Resource>>}
   */
  _resources = new Map();

  _pendingResourcesQueue = [];

  _orchestrators = {
    image: (key, url) => {
      this._pendingResourcesQueue.push({
        category: ResourceCategories.IMAGE,
        key,
        url,
      });
    },
    audio: (key, url) => {
      this._pendingResourcesQueue.push({
        category: ResourceCategories.AUDIO,
        key,
        url,
      });
    },
    spritesheet: (key, url, config) => {
      this._pendingResourcesQueue.push({
        category: ResourceCategories.SPRITESHEET,
        key,
        url,
        config,
      });
    },
  };

  constructor() {
    this._formatError = createFormatterErrors(Loader);
  }

  get resources() {
    return this._resources;
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  loadResources() {
    const promises = [];

    for (const { category, key, url, config } of this._pendingResourcesQueue) {
      promises.push(
        when(category, {
          [ResourceCategories.IMAGE]: () => this._loadImage(key, url),
          [ResourceCategories.AUDIO]: () => this._loadAudio(key, url),
          [ResourceCategories.SPRITESHEET]: () =>
            this._loadSpritesheet(key, url, config),
        })
      );
    }

    this._pendingResourcesQueue = [];

    return Promise.allSettled(promises);
  }

  async _loadResource(type, url) {
    try {
      const loader = this._resourceLoaderStrategies[type];
      if (!loader) throw new Error(`Unknown resource type: ${type}`);
      const resource = await loader(url);
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

  async _fetchResource({
    category,
    key,
    type = category,
    url,
    error,
    config = null,
  }) {
    const { promise, resolve, reject } = Promise.withResolvers();
    const [loadingError, resource] = await this._loadResource(type, url);

    if (loadingError) {
      reject(this._formatError(error, loadingError));
      return;
    }

    this._saveResource(
      category,
      key,
      config ? { data: resource, config } : resource
    );

    resolve();

    return promise;
  }

  _loadImage(key, url) {
    return this._fetchResource({
      category: ResourceCategories.IMAGE,
      key,
      url,
      error: "The image could not be loaded. Verify that the URL is correct.",
    });
  }

  _loadAudio(key, url) {
    return this._fetchResource({
      category: ResourceCategories.AUDIO,
      key,
      url,
      error:
        "The audio file could not be loaded. Verify that the URL is correct and the format is supported.",
    });
  }

  async _loadSpritesheet(key, url, config) {
    return this._fetchResource({
      category: ResourceCategories.SPRITESHEET,
      type: ResourceCategories.IMAGE,
      key,
      url,
      error:
        "Error loading sprite. Make sure the file exists and is in the correct format.",
      config,
    });
  }
}
