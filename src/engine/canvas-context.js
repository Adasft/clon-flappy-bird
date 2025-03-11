import {
  CanvasBackgroundImageFit,
  CanvasBackgroundImagePosition,
} from "./enums.js";
import { loadImage } from "./utils.js";

const CanvasBackgroundType = {
  IMAGE: "image",
  COLOR: "color",
};

export default class CanvasContext {
  _isMounted = false;

  _background = {
    image: {
      node: null,
      url: null,
      width: null,
      height: null,
      x: 0,
      y: 0,
    },
    color: null,
  };

  _backgroundType = CanvasBackgroundType.COLOR;

  constructor({
    parentRenderer,
    scenesManager,
    background,
    context,
    aspectRatio,
    scale,
  }) {
    this._canvas = document.createElement("canvas");
    this._context = this._canvas.getContext(context);
    this._parentRenderer = parentRenderer;
    this._aspectRatio = aspectRatio;
    this._scale = scale;
    this._scenesManager = scenesManager;

    if (!this._parentRenderer?.isConnected) {
      throw new Error(
        "GameEngine [CanvasContext Error]: Parent renderer is not connected to the DOM"
      );
    }

    this._canvas.setAttribute("tabindex", "0");

    this._adjustViewport();
    this._configBackground(background);
  }

  get aspectRatio() {
    return this._aspectRatio;
  }

  get canvas() {
    return this._canvas;
  }

  get ctx() {
    return this._context;
  }

  get width() {
    return this._canvas.width;
  }

  get height() {
    return this._canvas.height;
  }

  get isMounted() {
    return this._isMounted;
  }

  mount() {
    if (this._isMounted) return;

    if (!this._parentRenderer) {
      throw new Error(
        "GameEngine [CanvasContext Error]: Parent renderer is not defined"
      );
    }

    this._parentRenderer.appendChild(this._canvas);
    this._isMounted = true;
  }

  drawBackground() {
    this._context.save();
    if (this._backgroundType === CanvasBackgroundType.IMAGE) {
      this._context.drawImage(
        this._background.image.node,
        this._background.image.x,
        this._background.image.y,
        this._background.image.width,
        this._background.image.height
      );
    } else {
      this._context.fillStyle = this._background.color;
      this._context.fillRect(0, 0, this.width, this.height);
    }
    this._context.restore();
  }

  render(time, delta) {
    this._context.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    this._scenesManager.display(this._context, { time, delta });
  }

  _calcBackgroundDimensionForContainFit() {
    const { width, height } = this._background.image.node;
    const imageAspectRatio = width / height;

    if (imageAspectRatio > this._aspectRatio) {
      return {
        width: this.width,
        height: this.width / imageAspectRatio,
      };
    }

    return {
      width: this.height * imageAspectRatio,
      height: this.height,
    };
  }

  _calcBackgroundDimensionForCoverFit() {
    const { width, height } = this._background.image.node;
    const imageAspectRatio = width / height;

    if (imageAspectRatio > this._aspectRatio) {
      return {
        width: this.height * imageAspectRatio,
        height: this.height,
      };
    }

    return {
      width: this.width,
      height: this.width / imageAspectRatio,
    };
  }

  _calcBackgroundImgDimensions() {
    if (!this._background.image.node) {
      throw new Error(
        "GameEngine [CanvasContext Error]: Background image is not defined"
      );
    }

    const { fit, width, height } = this._background.image;

    switch (fit) {
      case CanvasBackgroundImageFit.CONTAIN:
        return this._calcBackgroundDimensionForContainFit();
      case CanvasBackgroundImageFit.COVER:
        return this._calcBackgroundDimensionForCoverFit();
      case CanvasBackgroundImageFit.FILL:
        return { width: this.width, height: this.height };
      default:
        const { width: naturalWidth, height: naturalHeight } =
          this._background.image.node;
        return {
          width: width ?? naturalWidth,
          height: height ?? naturalHeight,
        };
    }
  }

  _configBackgroundImgDimensions() {
    const { width, height } = this._calcBackgroundImgDimensions();

    this._background.image.width = width;
    this._background.image.height = height;
  }

  _calcBackgroundPositionForX(position) {
    switch (position) {
      case CanvasBackgroundImagePosition.CENTER:
        return (this.width - this._background.image.width) / 2;
      case CanvasBackgroundImagePosition.LEFT:
        return 0;
      case CanvasBackgroundImagePosition.RIGHT:
        return this.width - this._background.image.width;
      default:
        return position;
    }
  }

  _calcBackgroundPositionForY(position) {
    switch (position) {
      case CanvasBackgroundImagePosition.CENTER:
        return (this.height - this._background.image.height) / 2;
      case CanvasBackgroundImagePosition.TOP:
        return 0;
      case CanvasBackgroundImagePosition.BOTTOM:
        return this.height - this._background.image.height;
      default:
        return position;
    }
  }

  _calcBackgroundImgPosition() {
    if (!this._background.image.node) {
      throw new Error(
        "GameEngine [CanvasContext Error]: Background image is not defined"
      );
    }

    const { positions, x, y } = this._background.image;

    const bgPositionX = positions?.x
      ? this._calcBackgroundPositionForX(positions.x)
      : x ?? 0;
    const bgPositionY = positions?.y
      ? this._calcBackgroundPositionForY(positions.y)
      : y ?? 0;

    return { x: bgPositionX, y: bgPositionY };
  }

  _configBackgroundImgPosition() {
    const { x, y } = this._calcBackgroundImgPosition();

    this._background.image.x = x;
    this._background.image.y = y;
  }

  async _configBackground({ image, color }) {
    if (image) {
      try {
        const { url, width, height, fit, positions, x, y } = image;
        const bgImage = await loadImage(url);

        Object.assign(this._background.image, {
          node: bgImage,
          url,
          fit: fit ?? CanvasBackgroundImageFit.NONE,
          positions,
          width,
          height,
          x,
          y,
        });

        this._configBackgroundImgDimensions();
        this._configBackgroundImgPosition();

        this._backgroundType = CanvasBackgroundType.IMAGE;
      } catch (error) {
        console.error(
          "GameEngine [CanvasContext Error]: The background image could not be loaded. Verify that the URL is correct",
          error
        );
      }
    } else {
      this._background.color = color;
      this._backgroundType = CanvasBackgroundType.COLOR;
    }
  }

  _adjustViewport() {
    const { width, height } = this._parentRenderer.getBoundingClientRect();
    const aspectRatio = width / height;

    if (aspectRatio > this._aspectRatio) {
      this._canvas.width = height * this._aspectRatio * this._scale;
      this._canvas.height = height * this._scale;
    } else {
      this._canvas.width = width * this._scale;
      this._canvas.height = (width / this._aspectRatio) * this._scale;
    }

    this._context.imageSmoothingEnabled = false;
    this._context.scale(this._scale, this._scale);
  }
}
