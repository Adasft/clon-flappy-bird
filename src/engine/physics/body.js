import { createVector, log } from "../utils.js";
import { BodyShape } from "../enums.js";
// Propiedad	Descripción
// position	📌 Coordenadas actuales (x, y).
// velocity	🚀 Velocidad en (x, y), afecta el movimiento en cada frame.
// acceleration	⚡️ Aumenta la velocidad gradualmente en (x, y).
// maxVelocity	🔒 Límite máximo de velocidad en (x, y).
// drag	🌫 Reduce gradualmente la velocidad (simula fricción con el aire).

// Propiedad	Descripción
// mass	⚖️ Define el peso del objeto (más masa = menos efecto de fuerza).
// gravity	🌍 Afecta cómo el objeto responde a la gravedad (x, y).
// friction	🛑 Reduce la velocidad cuando choca contra otro objeto.
// restitution	🔄 Define cuánto rebota el objeto (1 = rebota totalmente, 0 = no rebota).
// force	💥 Permite aplicar una fuerza manual (x, y).

/**
 * Densidad del aire (kg/m³)
 */
const RHO = 1.225;

export default class Body {
  position = createVector();

  velocity = createVector();

  _acceleration = createVector();

  drag;

  mass;

  gravity = createVector(400, 400);

  friction;

  bounce;

  frontArea = createVector(0.1, 0.1);

  constructor(
    drawable,
    {
      gravity,
      bounds,
      shape = BodyShape.RECT,
      friction = 1,
      bounce = 0,
      mass = 1,
      drag = 0,
      colliderWordBounds = true,
      velocity,
      frontArea,
      isStatic = false,
    }
  ) {
    this._drawable = drawable;
    this.gravity.set(gravity?.x, gravity?.y);
    this.bounds = bounds;
    this.shape = shape;
    this.friction = friction;
    this.bounce = bounce;
    this.mass = Math.max(mass, 1);
    this.drag = drag;
    this.colliderWordBounds = colliderWordBounds;
    this.velocity.set(velocity?.x, velocity?.y);
    this.frontArea.set(frontArea?.x, frontArea?.y);
    this.isStatic = isStatic;
    this.position.set(this._drawable.x, this._drawable.y);
  }

  update(deltaTime) {
    this.deltaTimeFrame = deltaTime / 1000;

    const dragX = this._calcDragForce(this.frontArea.x, this.velocity.x);
    const dragY = this._calcDragForce(this.frontArea.y, this.velocity.y);

    // Calcular la fuerza total (peso - resistencia del aire)
    const Fx = this.mass * this.gravity.x - dragX;
    const Fy = this.mass * this.gravity.y - dragY;

    // Calcular la aceleracion
    this._acceleration.x = Fx / this.mass;
    this._acceleration.y = Fy / this.mass;

    this.velocity.x = this._calcVelocity(this.velocity.x, this._acceleration.x);
    this.velocity.y = this._calcVelocity(this.velocity.y, this._acceleration.y);

    this.position.x += this.velocity.x * this.deltaTimeFrame;
    this.position.y += this.velocity.y * this.deltaTimeFrame;

    if (this.colliderWordBounds) {
      this._detectColisionWordBoundaries();
    }
  }

  _detectColisionWordBoundaries() {
    const { x, y } = this.position;
    const { width, height } = this._drawable;
    const { x: wordX, y: wordY, width: wordW, height: wordH } = this.bounds;
    const isCollideHorizontally = x <= wordX || x >= wordX + wordW - width;
    const isCollideVertically = y <= wordY || y >= wordY + wordH - height;

    if (isCollideHorizontally) {
      this.position.x = x > wordW / 2 ? wordW - width : wordX;
      this.velocity.x = 0;
    }

    if (isCollideVertically) {
      this.position.y = y > wordH / 2 ? wordH - height : wordY;
      this.velocity.y = 0;
    }
  }

  _calcDragForce(frontArea, velocity) {
    // Calcular la fuerza de arraste (Fd = 1/2 * Cd * rho * A * v²)
    const Fd = 0.5 * this.drag * RHO * frontArea * velocity * velocity;
    return velocity > 0 ? Fd : -Fd;
  }

  _calcVelocity(velocity, acceleration) {
    velocity += acceleration * this.deltaTimeFrame;
    velocity *= this.friction;
    return velocity;
  }
}
