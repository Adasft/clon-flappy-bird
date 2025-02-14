import Drawable from "./drawable.js";

export default class DrawableTileSprite extends Drawable {
  tilePositionX = 0;
  tilePositionY = 0;

  constructor(tileSprite, { width, height, frameWidth, frameHeight }) {
    super(width, height);

    this._tileSprite = tileSprite;
    this._tileWidth = frameWidth ?? this._tileSprite.width;
    this._tileHeight = frameHeight ?? this._tileSprite.height;
  }

  draw(ctx) {
    super.draw(ctx);

    ctx.beginPath();
    ctx.rect(-this._origin.x, -this._origin.y, this.width, this.height);
    ctx.clip();

    for (let y = this.tilePositionY; y < this.height; y += this._tileHeight) {
      for (let x = this.tilePositionX; x > 0; x -= this._tileWidth) {
        ctx.drawImage(
          this._tileSprite,
          x - this._tileWidth,
          y,
          this._tileWidth,
          this._tileHeight
        );
      }

      for (let x = this.tilePositionX; x < this.width; x += this._tileWidth) {
        ctx.drawImage(
          this._tileSprite,
          x,
          y,
          this._tileWidth,
          this._tileHeight
        );
      }
    }

    for (let y = this.tilePositionY; y > 0; y -= this._tileHeight) {
      for (let x = this.tilePositionX; x > 0; x -= this._tileWidth) {
        ctx.drawImage(
          this._tileSprite,
          x - this._tileWidth,
          y - this._tileHeight,
          this._tileWidth,
          this._tileHeight
        );
      }

      for (let x = this.tilePositionX; x < this.width; x += this._tileWidth) {
        ctx.drawImage(
          this._tileSprite,
          x,
          y - this._tileHeight,
          this._tileWidth,
          this._tileHeight
        );
      }
    }

    ctx.restore();
  }
}
