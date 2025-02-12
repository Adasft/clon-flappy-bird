import Drawable from "./drawable.js";

export default class DrawableImage extends Drawable {
  constructor(image) {
    super();
    this._image = image;
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.drawImage(this._image, this.x, this.y, this.width, this.height);
    ctx.restore();
  }
}
