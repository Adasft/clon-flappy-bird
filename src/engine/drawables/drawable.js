export default class Drawable {
  x = 0;
  y = 0;
  width = 0;
  height = 0;

  scale = {
    x: 1,
    y: 1,
  };

  rotate = 0;

  setScale(size) {
    this.width *= size;
    this.height *= size;
    return this;
  }

  draw(ctx) {
    ctx.save();
    ctx.scale(this.scale.x, this.scale.y);
    ctx.rotate(this.rotate);
  }
}
