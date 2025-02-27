import DynamicDrawable from "./dynamic-drawable.js";

export default class DrawableImage extends DynamicDrawable {
  constructor(scene, image, { key, width, height }) {
    super(scene, key, width ?? image.width, height ?? image.height);
    this._image = image;
  }

  draw(ctx, time) {
    super.draw(ctx, time);
    ctx.drawImage(
      this._image,
      -this._origin.x,
      -this._origin.y,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
