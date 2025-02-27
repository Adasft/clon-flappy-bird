import DynamicDrawable from "./dynamic-drawable.js";

export default class DrawableSpriteSheet extends DynamicDrawable {
  constructor(scene, spritesheet, { key, frameWidth, frameHeight }) {
    super(scene, key, frameWidth, frameHeight);
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
    this._currentFrame = Math.max(frame, 0);
  }

  get currentFrame() {
    return this._currentFrame;
  }

  draw(ctx, time) {
    super.draw(ctx, time);
    ctx.drawImage(
      this._spritesheet,
      this.frameX,
      this.frameY,
      this.frameWidth,
      this.frameHeight,
      -this._origin.x,
      -this._origin.y,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
