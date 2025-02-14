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
  _rejectedResourceKeys = [];
  _amountLoaded = 0;
  _amountPendings = 0;
  _pendingResourceSize = 0;
  _loadedCount = 0;
  _prevSize = 0;

  _orchestrators = {
    image: (key, url) => {
      this._savePendingResource(ResourceCategories.IMAGE, key, url);
    },
    audio: (key, url) => {
      this._savePendingResource(ResourceCategories.AUDIO, key, url);
    },
    spritesheet: (key, url, config) =>
      this._savePendingResource(
        ResourceCategories.SPRITESHEET,
        key,
        url,
        config
      ),
  };

  constructor(onProgress) {
    this._onProgress = onProgress;
    this._formatError = createFormatterErrors(Loader);
  }

  get resources() {
    return this._resources;
  }

  get hasPendingResources() {
    return this.pendings > 0;
  }

  get pendings() {
    return this._pendingResourcesQueue.length;
  }

  get size() {
    let size = 0;
    for (const categoryMap of this._resources.values()) {
      size += categoryMap.size;
    }
    return size;
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  loadResources() {
    const promises = [];

    this._amountPendings +=
      this.pendings > this._amountPendings ? this.pendings : 0;
    this._pendingResourceSize = this.pendings;
    this._prevSize = this.size;

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

    this._pendingResourcesQueue = this._pendingResourcesQueue.filter(
      ({ key }) => this._rejectedResourceKeys.includes(key)
    );
    this._rejectedResourceKeys = [];
    this._loadedCount = 0;

    return Promise.allSettled(promises);
  }

  _savePendingResource(category, key, url, config) {
    if (this._resources.get(category)?.has(key)) {
      return;
    }

    this._pendingResourcesQueue.push({
      category,
      key,
      url,
      config,
    });

    this._pendingResourceSize++;
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
      this._rejectedResourceKeys.push(key);
      reject(this._formatError(error, loadingError));
    } else {
      this._saveResource(
        category,
        key,
        config ? { data: resource, config } : resource
      );

      this._amountLoaded++;
      this._amountPendings--;

      resolve();
    }

    this._loadedCount++;

    this._onProgress({
      progress: this._loadedCount / this._pendingResourceSize,
      loaded: this._amountLoaded,
      pendings: this._amountPendings,
      total: this._prevSize + this._pendingResourceSize,
    });

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
