export const ResourceCategories = {
  IMAGE: "images",
  AUDIO: "audios",
  SPRITESHEET: "spritesheets",
  TILE_SPRITE: "tile-sprite",
};

export const SceneBehavior = {
  DESTROY: Symbol(),
  PAUSE: Symbol(),
  PARALLEL: Symbol(),
};

export const CanvasBackgroundImageFit = {
  COVER: Symbol(),
  CONTAIN: Symbol(),
  FILL: Symbol(),
  NONE: Symbol(),
};

export const CanvasBackgroundImagePosition = {
  CENTER: Symbol(),
  LEFT: Symbol(),
  RIGHT: Symbol(),
  TOP: Symbol(),
  BOTTOM: Symbol(),
};

export const AngleMode = {
  RADIANS: Symbol(),
  DEGRESS: Symbol(),
};

export const Anims = {
  INFINITY: -1,
  ONCE: 1,
};

export const BodyShape = {
  RECT: Symbol(),
  CIRCLE: Symbol(),
};

export const KeyboardEvents = {
  PRESSED: Symbol("pressed"),
  RELEASED: Symbol("released"),
};
