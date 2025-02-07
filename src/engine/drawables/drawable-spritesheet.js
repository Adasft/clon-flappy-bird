import Drawable from "drawable.js";

export default class DrawableSpriteSheet extends Drawable {
  constructor(spritesheet, { frameWidth, frameHeight }) {
    super();
    this._spritesheet = spritesheet;
    this._currentFrame = 0;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
  }

  get frameX() {
    return this._currentFrame * this.frameWidth;
  }

  get frameY() {
    return 0;
  }

  set currentFrame(frame) {
    return Math.max(frame, 0);
  }

  get currentFrame() {
    return this._currentFrame;
  }

  draw(ctx) {
    super.draw(ctx);
    ctx.drawImage(
      this._spriteSheet,
      this.frameX,
      this.frameY,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
