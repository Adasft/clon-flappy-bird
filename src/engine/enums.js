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
  PRESSED: "pressed",
  RELEASED: "released",
  KEY_COMBO_MATCHED: "keycombomatched",
  KEY_COMBO_FAILED: "keycombofailed",
  KEY_BINDING_MATCHED: "keybindingmatched",
});

export const KeyComboTestReason = Object.freeze({
  TIME_LIMIT_EXCEEDED: Symbol("timelimitexceeded"),
  INVALID_KEY: Symbol("invalidkey"),
  ORDER_MISMATCH: Symbol("ordermismatch"),
  MATCHED: Symbol("matched"),
  PENDING: Symbol("pending"),
});

export const KeyBindingMode = Object.freeze({
  PRESSED_ONCE: "pressedOnce",
  HOLD: "hold",
});

export const Platform = Object.freeze({
  WINDOWS: Symbol("Windows"),
  MAC: Symbol("Mac"),
  LINUX: Symbol("Linux"),
  UNKNOWN: Symbol("Unknown"),
});

export function enumHas(objectEnum, propertyDescription) {
  return Object.values(objectEnum).includes(propertyDescription);
}
