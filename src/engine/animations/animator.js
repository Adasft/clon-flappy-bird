import DrawableSpriteSheet from "../drawables/drawable-spritesheet.js";
import Animation from "./animation.js";
/**
 * @interface Orchestrator
 * @description Interface for orchestrators.
 * @function
 * @name Orchestrator#getOrchestrators
 * @returns {Object<string, Function>} - The orchestrators.
 * @implements {Orchestrator}
 *
 */
export default class Animator {
  _orchestrators = {
    create: this._createAnimation.bind(this),
    play: this._playAnimation.bind(this),
    frameRanges: this._frameRanges.bind(this),
  };

  _animations = new Map();
  _runningAnimsKeys = new Set();

  constructor(scene) {
    this._scene = scene;
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  _frameRanges({ start, end }) {
    return Array(end - start + 1)
      .fill(start)
      .map((v, i) => v + i);
  }

  runAnimations(time) {
    for (const key of this._runningAnimsKeys) {
      const animation = this._animations.get(key);
      animation.run(time);
    }
  }

  _createAnimation({ key, sprite, frames, frameRate, repeat }) {
    if (typeof key !== "string") {
      throw new Error("Animation key is required");
    }

    if (!frames || !frames.length) {
      throw new Error("Frames can't not be emty");
    }

    if (typeof sprite === "string") {
      if (!this._scene.hasDrawable(sprite)) {
        return;
      }

      sprite = this._scene.getDrawable(sprite);
    } else if (!(sprite instanceof DrawableSpriteSheet)) {
      throw new Error("Invalid sprite value");
    }

    const animation = new Animation({
      key,
      sprite,
      frames,
      frameRate,
      limitFrames: typeof frameRate === "number",
      repeat,
      onPlay: () => {
        this._runningAnimsKeys.add(key);
      },
      onPause: () => {
        this._runningAnimsKeys.delete(key);
      },
    });

    this._animations.set(key, animation);

    return sprite;
  }

  _playAnimation(key, restart = false) {
    if (!this._animations.has(key)) {
      return;
    }

    const animation = this._animations.get(key);

    if (animation.isRunning && !restart) {
      return;
    }

    if (restart) {
      animation.restart();
    } else {
      animation.play();
    }

    if (!this._runningAnimsKeys.has(key)) {
      this._runningAnimsKeys.add(animation);
    }
  }
}
