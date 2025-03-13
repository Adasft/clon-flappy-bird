export const ResourceCategories = Object.freeze({
  IMAGE: "images",
  AUDIO: "audios",
  SPRITESHEET: "spritesheets",
  TILE_SPRITE: "tile-sprite",
});

export const SceneBehavior = Object.freeze({
  DESTROY: Symbol(),
  PAUSE: Symbol(),
  PARALLEL: Symbol(),
});

export const CanvasBackgroundImageFit = Object.freeze({
  COVER: Symbol(),
  CONTAIN: Symbol(),
  FILL: Symbol(),
  NONE: Symbol(),
});

export const CanvasBackgroundImagePosition = Object.freeze({
  CENTER: Symbol(),
  LEFT: Symbol(),
  RIGHT: Symbol(),
  TOP: Symbol(),
  BOTTOM: Symbol(),
});

export const AngleMode = Object.freeze({
  RADIANS: Symbol(),
  DEGRESS: Symbol(),
});

export const Anims = Object.freeze({
  INFINITY: -1,
  ONCE: 1,
});

export const BodyShape = Object.freeze({
  RECT: Symbol(),
  CIRCLE: Symbol(),
});

export const KeyboardEvents = Object.freeze({
  PRESSED: Symbol("pressed"),
  RELEASED: Symbol("released"),
  COMBOMATCHED: Symbol("combomatched"),
  COMBOFAILED: Symbol("combofailed"),
  KEYBINDINGMATCHED: Symbol("keybindingmatched"),
});

export const KeyComboTestReason = Object.freeze({
  TIME_LIMIT_EXCEEDED: Symbol("time_limit_exceeded"),
  INVALID_KEY: Symbol("invalid_key"),
  ORDER_MISMATCH: Symbol("order_mismatch"),
  MATCHED: Symbol("matched"),
  PENDING: Symbol("pending"),
});
