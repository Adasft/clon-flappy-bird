import { Key } from "./key.js";

export class KeyboardKeys {
  Backspace = this._createCursorKey("Backspace");
  Tab = this._createCursorKey("Tab");
  Enter = this._createCursorKey("Enter");
  ShiftLeft = this._createCursorKey("Shift", "ShiftLeft");
  ShiftRight = this._createCursorKey("Shift", "ShiftRight");
  ControlLeft = this._createCursorKey("Control", "ControlLeft");
  ControlRight = this._createCursorKey("Control", "ControlRight");
  AltLeft = this._createCursorKey("Alt", "AltLeft");
  AltRight = this._createCursorKey("Alt", "AltRight");
  Pause = this._createCursorKey("Pause");
  CapsLock = this._createCursorKey("CapsLock");
  Escape = this._createCursorKey("Escape");
  Space = this._createCursorKey(" ", "Space");
  PageUp = this._createCursorKey("PageUp");
  PageDown = this._createCursorKey("PageDown");
  End = this._createCursorKey("End");
  Home = this._createCursorKey("Home");
  ArrowLeft = this._createCursorKey("ArrowLeft");
  ArrowUp = this._createCursorKey("ArrowUp");
  ArrowRight = this._createCursorKey("ArrowRight");
  ArrowDown = this._createCursorKey("ArrowDown");
  PrintScreen = this._createCursorKey("PrintScreen");
  Insert = this._createCursorKey("Insert");
  Delete = this._createCursorKey("Delete");
  NumLock = this._createCursorKey("NumLock");
  ScrollLock = this._createCursorKey("ScrollLock");
  AudioVolumeMute = this._createCursorKey("AudioVolumeMute");
  AudioVolumeDown = this._createCursorKey("AudioVolumeDown");
  AudioVolumeUp = this._createCursorKey("AudioVolumeUp");
  LaunchMediaPlayer = this._createCursorKey("LaunchMediaPlayer");
  LaunchApplication1 = this._createCursorKey("LaunchApplication1");
  LaunchApplication2 = this._createCursorKey("LaunchApplication2");

  MetaLeft = this._createCursorKey("Meta", "MetaLeft");
  MetaRight = this._createCursorKey("Meta", "MetaRight");
  ContextMenu = this._createCursorKey("ContextMenu");

  Numpad0 = this._createCursorKey("0", "Numpad0");
  Numpad1 = this._createCursorKey("1", "Numpad1");
  Numpad2 = this._createCursorKey("2", "Numpad2");
  Numpad3 = this._createCursorKey("3", "Numpad3");
  Numpad4 = this._createCursorKey("4", "Numpad4");
  Numpad5 = this._createCursorKey("5", "Numpad5");
  Numpad6 = this._createCursorKey("6", "Numpad6");
  Numpad7 = this._createCursorKey("7", "Numpad7");
  Numpad8 = this._createCursorKey("8", "Numpad8");
  Numpad9 = this._createCursorKey("9", "Numpad9");

  NumpadMultiply = this._createCursorKey("*", "NumpadMultiply");
  NumpadAdd = this._createCursorKey("+", "NumpadAdd");
  NumpadSubtract = this._createCursorKey("-", "NumpadSubtract");
  NumpadDecimal = this._createCursorKey(".", "NumpadDecimal");
  NumpadDivide = this._createCursorKey("/", "NumpadDivide");

  Semicolon = this._createCursorKey(";", "Semicolon");
  Equal = this._createCursorKey("=", "Equal");
  Comma = this._createCursorKey(",", "Comma");
  Minus = this._createCursorKey("-", "Minus");
  Period = this._createCursorKey(".", "Period");
  Slash = this._createCursorKey("/", "Slash");
  Backquote = this._createCursorKey("`", "Backquote");
  BracketLeft = this._createCursorKey("[", "BracketLeft");
  Backslash = this._createCursorKey("\\", "Backslash");
  BracketRight = this._createCursorKey("]", "BracketRight");
  Quote = this._createCursorKey("'", "Quote");

  Digit0 = this._createCursorKey("0", "Digit0");
  Digit1 = this._createCursorKey("1", "Digit1");
  Digit2 = this._createCursorKey("2", "Digit2");
  Digit3 = this._createCursorKey("3", "Digit3");
  Digit4 = this._createCursorKey("4", "Digit4");
  Digit5 = this._createCursorKey("5", "Digit5");
  Digit6 = this._createCursorKey("6", "Digit6");
  Digit7 = this._createCursorKey("7", "Digit7");
  Digit8 = this._createCursorKey("8", "Digit8");
  Digit9 = this._createCursorKey("9", "Digit9");

  KeyA = this._createCursorKey("a", "KeyA");
  KeyB = this._createCursorKey("b", "KeyB");
  KeyC = this._createCursorKey("c", "KeyC");
  KeyD = this._createCursorKey("d", "KeyD");
  KeyE = this._createCursorKey("e", "KeyE");
  KeyF = this._createCursorKey("f", "KeyF");
  KeyG = this._createCursorKey("g", "KeyG");
  KeyH = this._createCursorKey("h", "KeyH");
  KeyI = this._createCursorKey("i", "KeyI");
  KeyJ = this._createCursorKey("j", "KeyJ");
  KeyK = this._createCursorKey("k", "KeyK");
  KeyL = this._createCursorKey("l", "KeyL");
  KeyM = this._createCursorKey("m", "KeyM");
  KeyN = this._createCursorKey("n", "KeyN");
  KeyO = this._createCursorKey("o", "KeyO");
  KeyP = this._createCursorKey("p", "KeyP");
  KeyQ = this._createCursorKey("q", "KeyQ");
  KeyR = this._createCursorKey("r", "KeyR");
  KeyS = this._createCursorKey("s", "KeyS");
  KeyT = this._createCursorKey("t", "KeyT");
  KeyU = this._createCursorKey("u", "KeyU");
  KeyV = this._createCursorKey("v", "KeyV");
  KeyW = this._createCursorKey("w", "KeyW");
  KeyX = this._createCursorKey("x", "KeyX");
  KeyY = this._createCursorKey("y", "KeyY");
  KeyZ = this._createCursorKey("z", "KeyZ");

  F1 = this._createCursorKey("F1");
  F2 = this._createCursorKey("F2");
  F3 = this._createCursorKey("F3");
  F4 = this._createCursorKey("F4");
  F5 = this._createCursorKey("F5");
  F6 = this._createCursorKey("F6");
  F7 = this._createCursorKey("F7");
  F8 = this._createCursorKey("F8");
  F9 = this._createCursorKey("F9");
  F10 = this._createCursorKey("F10");
  F11 = this._createCursorKey("F11");
  F12 = this._createCursorKey("F12");

  _modifiers = {
    isCtrl: false,
    isAlt: false,
    isShift: false,
    isMeta: false,
    key: null,
    code: null,
    isRepeating: false,
    isCapsLock: false,
    isNumLock: false,
    isScrollLock: false,
  };

  _currentEvent = null;

  get isCtrl() {
    return this._modifiers.isCtrl;
  }

  get isAlt() {
    return this._modifiers.isAlt;
  }

  get isShift() {
    return this._modifiers.isShift;
  }

  get isMeta() {
    return this._modifiers.isMeta;
  }

  get key() {
    return this._modifiers.key;
  }

  get code() {
    return this._modifiers.code;
  }

  get isRepeating() {
    return this._modifiers.isRepeating;
  }

  get isCapsLock() {
    return this._modifiers.isCapsLock;
  }

  get isNumLock() {
    return this._modifiers.isNumLock;
  }

  get isScrollLock() {
    return this._modifiers.isScrollLock;
  }

  handleEvent(event) {
    const { ctrlKey, altKey, shiftKey, metaKey, key, code, repeat } = event;

    Object.assign(this._modifiers, {
      isCtrl: ctrlKey,
      isAlt: altKey,
      isShift: shiftKey,
      isMeta: metaKey,
      key,
      code,
      isRepeating: repeat,
      isCapsLock: event.getModifierState("CapsLock"),
      isNumLock: event.getModifierState("NumLock"),
      isScrollLock: event.getModifierState("ScrollLock"),
    });

    this._currentEvent = event;
  }

  getModifiers() {
    return { ...this._modifiers };
  }

  getCurrentEvent() {
    return this._currentEvent;
  }

  getKeyByCode(code) {
    if (!this.hasOwnProperty(code)) {
      console.warn(`Key with code ${code} is not defined`);
      return null;
    }
    return this[code];
  }

  _createCursorKey(key, code = key) {
    return new Key(key, code);
  }
}
