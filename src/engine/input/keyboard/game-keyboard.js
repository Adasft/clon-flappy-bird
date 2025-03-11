// Keyboard.on (key, callback)
// Escucha cuando una tecla es presionada.
// Keyboard. onRelease(key, callback)
// Escucha cuando una tecla es soltada.
// Keyboard. isPressed (key)
// Devuelve true si la tecla está presionada.
// Keyboard.setMapping (mapping)
// Define un esquema de controles personalizado.
// Keyboard-getActiveKeys ()
// Retorna una lista de teclas actualmente presionadas.
// Keyboard.off(key, callback)
// Remueve un listener de una tecla.
// Keyboard. disable ()
// Desactiva la detección de teclado temporalmente.
// Keyboard. enable()
// Reactiva la detección de teclado.

import { KeyboardEvents } from "../../enums.js";
import { when } from "../../utils.js";

class Key {
  _state = {
    isPressed: { value: false, handlers: [] },
    isReleased: { value: true, handlers: [] },
  };

  constructor(name, code) {
    this.name = name;
    this.code = code;
    this.targetKey = null;
  }

  get isPressed() {
    return this._state.isPressed.value;
  }

  get isReleased() {
    return this._state.isReleased.value;
  }

  onPressed(handler) {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }

    this._state.isPressed.handlers.push(handler);
  }

  onReleased(handler) {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }

    this._state.isReleased.handlers.push(handler);
  }

  dispatch(eventType, event) {
    const { isPressed, isReleased } = this._state;
    const { activeState, oppositeState } = when(eventType, {
      [KeyboardEvents.PRESSED]: () => ({
        activeState: isPressed,
        oppositeState: isReleased,
      }),
      [KeyboardEvents.RELEASED]: () => ({
        activeState: isReleased,
        oppositeState: isPressed,
      }),
    });

    this._setKeyState(true, activeState, oppositeState);

    this.targetKey = event.key ?? this.name;

    activeState.handlers.forEach((handler) => {
      handler(event);
    });
  }

  _setKeyState(value, activeState, oppositeState) {
    if (value === activeState.value) {
      return;
    }

    activeState.value = value;
    oppositeState.value = !activeState.value;
  }
}

class KeyboardKeys {
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

class KeyBindings {}

export default class GameKeyboard {
  _orchestrators = {
    on: this._attachEvent.bind(this),
    off: null,
    createCombo: null,
    createKeyBinding: null,
    onRelease: null,
    isPressed: null,
    setMapping: null,
    getActiveKeys: null,
    disable: null,
    enable: null,
    getKeys: this._getKeys.bind(this),
  };

  _keys = new KeyboardKeys();
  _activeKeys = new Set();
  _keyHandlers = new Map();

  constructor(eventHandlers) {
    this._eventHandlers = eventHandlers;

    this._eventHandlers.on("keydown", this._handlerKeyEvent);
    this._eventHandlers.on("keyup", this._handlerKeyEvent);
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  _captureKeyEvent(eventType, key, code) {
    const modifiers = this._keys.getModifiers();
    const activeKey = this._keys.getKeyByCode(code);
    const currentEvent = this._keys.getCurrentEvent();

    if (!activeKey) return;

    activeKey.dispatch(eventType, {
      key,
      code,
      ...modifiers,
      event: currentEvent,
    });

    this._addActiveKey(code, eventType);
    this._triggerKeyHandlers(eventType, code);
  }

  _triggerKeyHandlers(eventType, code) {
    const keyHandlers = this._keyHandlers.get(eventType.description);

    if (!keyHandlers) return;

    if (keyHandlers.has(code)) {
      keyHandlers.get(code).forEach((handler) => handler());
    }
  }

  _addActiveKey(code, eventType) {
    if (eventType === KeyboardEvents.PRESSED) {
      this._activeKeys.add(code);
    } else {
      this._activeKeys.delete(code);
    }
  }

  _handlerKeyEvent = (event) => {
    event.preventDefault();

    const { type, key, code } = event;
    const eventType =
      type === "keydown" ? KeyboardEvents.PRESSED : KeyboardEvents.RELEASED;

    this._keys.handleEvent(event);

    this._captureKeyEvent(eventType, key, code);
  };

  _getKeys() {
    return this._keys;
  }

  _attachEvent(keyInput, type, handler) {
    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }

    if (!this._keyHandlers.has(type)) {
      this._keyHandlers.set(type, new Map());
    }

    const keyHandlers = this._keyHandlers.get(type);

    if (!keyHandlers.has(keyInput)) {
      keyHandlers.set(keyInput, new Set());
    }

    keyHandlers.get(keyInput).add(handler);
  }

  _createCombo(keyCombo, handler) {}
}
