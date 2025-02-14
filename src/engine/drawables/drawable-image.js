import Drawable from "./drawable.js";

export default class DrawableImage extends Drawable {
  constructor(image, { width, height }) {
    super(width ?? image.width, height ?? image.height);
    this._image = image;
  }

  draw(ctx) {
    super.draw(ctx);
    // ctx.translate(this.x, this.y);
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
