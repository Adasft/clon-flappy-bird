import Body from "../physics/body.js";
import Drawable from "./drawable.js";

export default class DynamicDrawable extends Drawable {
  _body = null;

  constructor(scene, key, width, height) {
    super(scene, key, width, height);
  }

  get body() {
    return this._body;
  }

  get hasBody() {
    return !!this._body;
  }

  setPhysics(config) {
    if (!this._body) {
      const defaults = this._scene.physics.getDefaults();
      const bounds = this._scene.physics.getWordBounds();

      this._body = new Body(this, {
        bounds,
        ...defaults,
        ...config,
      });
    }

    return this;
  }

  draw(ctx) {
    if (this.hasBody) {
      this.x = this._body.position.x;
      this.y = this._body.position.y;
    }

    super.draw(ctx);
  }
}
