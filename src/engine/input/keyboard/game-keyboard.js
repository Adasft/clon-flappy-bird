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
import { KeyboardKeys } from "./keyboard-keys.js";
import { KeyComboWatcher } from "./key-combo-watcher.js";
import { KeyCombo } from "./key-combo.js";
import { noop } from "../../utils.js";

class KeyBindings {
  _keyBindingsMap = new Map();

  onkeybindingmatched = noop;

  register(keyBinding, callback) {
    this._keyBindingsMap.set(keyBinding, callback);
  }

  match(keyBinding) {
    if (!this._keyBindingsMap.has(keyBinding)) return;

    const cb = this._keyBindingsMap.get(keyBinding);
    const keyCodes = keyBinding.split("+").map((ch) => ch.charCodeAt());

    cb();

    this.onkeybindingmatched(keyBinding, keyCodes);
  }

  hasBindings() {
    return !!this._keyBindingsMap.size;
  }
}

export default class GameKeyboard {
  static VALID_EVENTS = Object.values(KeyboardEvents);

  _orchestrators = {
    on: this._attachEvent.bind(this),
    off: null,
    createKeyCombo: this._createKeyCombo.bind(this),
    createKeyBinding: this._createKeyBinding.bind(this),
    onRelease: null,
    isPressed: null,
    setMapping: null,
    getActiveKeys: null,
    disable: null,
    enable: null,
    getKeys: this._getKeys.bind(this),
  };

  _keys = new KeyboardKeys();
  _keyComboWatcher = new KeyComboWatcher();
  _keyBindings = new KeyBindings();
  _activeKeys = new Set();
  _eventsMap = new Map();

  constructor(eventHandlers) {
    this._eventHandlers = eventHandlers;

    this._eventHandlers.on("keydown", this._handlerKeyEvent);
    this._eventHandlers.on("keyup", this._handlerKeyEvent);

    this._keyComboWatcher.onkeycombomatched = (combo, reason) => {
      this._dispatchEvent(KeyboardEvents.KEYCOMBOMATCHED, {
        combo,
        reason,
      });
    };

    this._keyComboWatcher.onkeycombofailed = (combo, reason) => {
      this._dispatchEvent(KeyboardEvents.KEYCOMBOFAILED, {
        combo,
        reason,
      });
    };

    this._keyBindings.onkeybindingmatched = (keyBinding, keyCodes) => {
      this._dispatchEvent(KeyboardEvents.KEYBINDINGMATCHED, {
        keyBinding,
        keyCodes,
      });
    };
  }

  getOrchestrators() {
    return this._orchestrators;
  }

  _captureKeyEvent(eventType, key, code) {
    const modifiers = this._keys.getModifiers();
    const activeKey = this._keys.getKeyByCode(code);
    const currentEvent = this._keys.getCurrentEvent();

    const event = {
      key,
      code,
      ...modifiers,
      currentEvent,
    };

    if (activeKey) {
      activeKey.dispatch(eventType, event);
    }

    this._addActiveKey(key, eventType);

    if (this._eventsMap.has(eventType)) {
      this._dispatchEvent(eventType, event);
    }

    if (eventType === KeyboardEvents.PRESSED) {
      if (this._keyComboWatcher.hasCombos()) {
        this._keyComboWatcher.trackKey(key);
      }

      if (this._keyBindings.hasBindings()) {
        this._keyBindings.match(this._formatKeyBindings());
      }
    }
  }

  _formatKeyBindings() {
    return [...this._activeKeys].join("+");
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

  _attachEvent(eventType, handler) {
    eventType = KeyboardEvents[eventType.toUpperCase()];

    if (!GameKeyboard.VALID_EVENTS.includes(eventType)) {
      throw new Error(`Invalid event type: ${eventType.description}`);
    }

    if (typeof handler !== "function") {
      throw new Error("Handler must be a function");
    }

    if (!this._eventsMap.has(eventType)) {
      this._eventsMap.set(eventType, new Set());
    }

    this._eventsMap.get(eventType).add(handler);
  }

  _dispatchEvent(eventType, event) {
    if (!GameKeyboard.VALID_EVENTS.includes(eventType)) {
      throw new Error(`Invalid event type: ${eventType.description}`);
    }

    const handlers = this._eventsMap.get(eventType);

    if (!handlers) return;

    handlers.forEach((handler) => handler(event));
  }

  _createKeyCombo(keyCombo, config) {
    const combo = new KeyCombo({
      keys: keyCombo,
      ...config,
    });

    this._keyComboWatcher.watch(combo);

    return combo;
  }

  _createKeyBinding(keyBindings, callback) {
    this._keyBindings.register(keyBindings, callback);
  }
}
