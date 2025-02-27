import Drawable from "./drawable.js";

export default class DrawableText extends Drawable {
  constructor(scene, text) {
    super(scene);
    this._text = text;
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(this._text, this.x, this.y);
    ctx.restore();
  }
}
