import Drawable from "./drawable.js";

export default class DrawableTileSprite extends Drawable {
  tilePositionX = 0;
  tilePositionY = 0;

  constructor(tileSprite, { key, width, height, frameWidth, frameHeight }) {
    super(key, width, height);

    this._tileSprite = tileSprite;
    this._tileWidth = frameWidth ?? this._tileSprite.width;
    this._tileHeight = frameHeight ?? this._tileSprite.height;
  }

  setTileSize(width, height = width) {
    this._tileWidth = width;
    this._tileHeight = height;
    return this;
  }

  draw(ctx) {
    super.draw(ctx);

    ctx.beginPath();
    ctx.rect(-this._origin.x, -this._origin.y, this.width, this.height);
    ctx.clip();

    const initialDrawPositionX =
      this.tilePositionX -
      Math.ceil(this.tilePositionX / this._tileWidth) * this._tileWidth -
      this._origin.x;

    const initialDrawPositionY =
      this.tilePositionY -
      Math.ceil(this.tilePositionY / this._tileHeight) * this._tileHeight -
      this._origin.y;

    for (
      let y = initialDrawPositionY;
      y <= this.height;
      y += this._tileHeight
    ) {
      for (
        let x = initialDrawPositionX;
        x <= this.width;
        x += this._tileWidth
      ) {
        ctx.drawImage(
          this._tileSprite,
          x,
          y,
          this._tileWidth,
          this._tileHeight
        );
      }
    }

    ctx.restore();
  }
}
