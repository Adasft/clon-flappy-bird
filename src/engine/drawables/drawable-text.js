import Drawable from "./drawable.js";

export default class DrawableText extends Drawable {
  constructor(text) {
    super();
    this._text = text;
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.fillText(this._text, this.x, this.y);
    ctx.restore();
  }
}
