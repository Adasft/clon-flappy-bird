import { createVector, log } from "../utils.js";

export default class Drawable {
  _x = 0;
  _y = 0;

  key = null;

  _dimensions = {
    width: {
      original: 0,
      scaling: 0,
    },
    height: {
      original: 0,
      scaling: 0,
    },
  };

  _scale = createVector(1, 1);

  _origin = createVector();

  _originRatio = createVector();

  _rotate = 0;

  constructor(scene, key, width, height) {
    this._scene = scene;
    this._dimensions.width.original = width;
    this._dimensions.height.original = height;

    this.key = key;
    this.width = width;
    this.height = height;
  }

  set x(x) {
    this._x = x;

    if (this.hasBody) {
      this.body.position.x = x;
    }
  }

  get x() {
    return this._x;
  }

  set y(y) {
    this._y = y;

    if (this.hasBody) {
      this.body.position.y = y;
    }
  }

  get y() {
    return this._y;
  }

  set width(width) {
    this._dimensions.width.scaling = width * this._scale.x;
  }

  get width() {
    return this._dimensions.width.scaling;
  }

  set height(height) {
    this._dimensions.height.scaling = height * this._scale.y;
  }

  get height() {
    return this._dimensions.height.scaling;
  }

  get originalWidth() {
    return this._dimensions.width.original;
  }

  get originalHeight() {
    return this._dimensions.height.original;
  }

  _calcOrigin() {
    this._origin.x = this._originRatio.x * this.width;
    this._origin.y = this._originRatio.y * this.height;
  }

  scale(scaleX, scaleY = scaleX) {
    this.width = this.originalWidth * scaleX;
    this.height = this.originalHeight * scaleY;
    this._scale.x = scaleX;
    this._scale.y = scaleY;
    this._calcOrigin();
    return this;
  }

  plusScale(scaleX, scaleY = scaleX) {
    this.scale(this._scale.x + scaleX, this._scale.y + scaleY);
    return this;
  }

  origin(x, y = x) {
    this._originRatio.x = x;
    this._originRatio.y = y;
    this._calcOrigin();
    return this;
  }

  rotate(rotation) {
    this._rotate = rotation;
    return this;
  }

  plusRotate(rotation) {
    this._rotate += rotation;
    return this;
  }

  draw(ctx) {
    ctx.save();
    // if (this.hasBody) {
    //   log(this.body.position.x);
    //   ctx.translate(this.body.position.x, this.body.position.y);
    // } else {
    // }
    ctx.translate(this.x, this.y);

    ctx.rotate(this._rotate);
  }
}
