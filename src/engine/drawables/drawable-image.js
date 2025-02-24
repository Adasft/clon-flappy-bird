import Drawable from "./drawable.js";

export default class DrawableImage extends Drawable {
  constructor(image, { key, width, height }) {
    super(key, width ?? image.width, height ?? image.height);
    this._image = image;
  }

  draw(ctx) {
    super.draw(ctx);
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
