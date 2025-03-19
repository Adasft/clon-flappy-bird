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

import {
  enumHas,
  KeyBindingMode,
  KeyboardEvents,
  Platform,
} from "../../enums.js";
import { KeyboardKeys } from "./keyboard-keys.js";
import { KeyCombos } from "./key-combos.js";
import { KeyCombo } from "./key-combo.js";
import { getPlatformOS, noop, when } from "../../utils.js";
import StepFrame from "../../step-frame.js";

const isValidKeyBindingRegExp =
  /^([\p{L}\p{N}\p{P}\p{S}]|\b(Control|Ctrl|Shift|Alt|Meta|AltGraph)\b)(\+([\p{L}\p{N}\p{P}\p{S}]))+$/u;

class Buffer extends Array {
  constructor(length = 0) {
    super(length);
  }

  get size() {
    return this.length;
  }

  add(item) {
    if (this.includes(item)) return;
    this.push(item);
  }

  clear() {
    this.length = 0;
  }

  delete(deletedItem) {
    const index = this.indexOf(deletedItem);
    if (index >= 0) {
      this.splice(index, 1);
    }
  }

  deleteRange(start, end = this.length) {
    return this.splice(start, end - start);
  }
}

/**
 * @interface KeyObservable
 * @description Interfaz para objetos que pueden ser observados por KeyWatcher, como KeyBinding o KeyCombo.
 *
 * Activa el objeto, indicando que la combinación de teclas fue detectada.
 * @function
 * @name KeyObservable#activate
 * @abstract
 *
 * Desactiva el objeto, indicando que la combinación de teclas ya no está activa.
 * @function
 * @name KeyObservable#deactivate
 * @abstract
 *
 * Habilita el objeto, permitiendo que pueda ser observado y ejecutado.
 * @function
 * @name KeyObservable#enable
 * @abstract
 *
 * Deshabilita el objeto, evitando que sea observado o activado.
 * @function
 * @name KeyObservable#disable
 * @abstract
 *
 * Obtiene las teclas asociadas al objeto.
 * @function
 * @name KeyObservable#getKeys
 * @abstract
 * @returns {string[]} Un array con las teclas asociadas (ej. `["Control", "A"]`).
 *
 * @implements {KeyObservable}
 */
class KeyBinding {
  _isEnabled = true;
  _isActive = false;
  _wasActiveBeforeDisable = false;

  constructor({
    binding = "",
    requiere,
    platforms,
    mode = KeyBindingMode.PRESSED_ONCE,
    duration = 0,
    enabled = true,
    repeatRate = 0,
    onmatched = noop,
  }) {
    if (!isValidKeyBindingRegExp.test(binding))
      throw new Error(`Invalid key binding: ${binding}`);
    this.platforms = this._normalizePlatformBindings(platforms, binding);
    this._currentPlatform = getPlatformOS();
    this.require = requiere;
    this._binding = this._getBindingBasesOnPlatform(
      binding,
      this._currentPlatform,
    );
    this.mode = mode;
    this.duration = duration;
    this.repeatRate = repeatRate;
    this.onmatched = onmatched;
    this._isEnabled = enabled;
  }

  get isEnabled() {
    return this._isEnabled;
  }

  get isActive() {
    return this._isActive;
  }

  get binding() {
    return this._binding;
  }

  enable() {
    this._isEnabled = false;
    this._isActive = this._wasActiveBeforeDisable;
  }

  disable() {
    this._isEnabled = false;
    this._wasActiveBeforeDisable = this._isActive;
    this._isActive = false;
  }

  activate() {
    if (!this._isEnabled) return;

    const isRequireStrict = this.require?.isStrict ?? false;
    const isRequireActive = this.require?.binding.isActive ?? false;
    const canActivate = !this.require || !isRequireStrict || isRequireActive;

    if (canActivate) return;

    this._isActive = true;
    this.onmatched(isRequireActive);

    if (this.duration === Infinity) return;

    if (this.duration === 0) {
      this.deactivate();
    } else {
      StepFrame.createTimeout(() => {
        this.deactivate();
        this._wasActiveBeforeDisable = false;
      }, this.duration);
    }
  }

  deactivate() {
    if (!this._isEnabled) return;

    this._isActive = false;
  }

  getKeys() {}

  _normalizePlatformBindings(platforms, defaultBinding) {
    if (!platforms) return null;

    platforms.win ??= defaultBinding;
    platforms.mac ??= defaultBinding;
    platforms.linux ??= defaultBinding;

    return platforms;
  }

  _getBindingBasesOnPlatform(defaultBinding, platform) {
    return this.platforms
      ? when(platform, {
          [Platform.WINDOWS]: () => this.platforms.win,
          [Platform.MAC]: () => this.platforms.mac,
          [Platform.LINUX]: () => this.platforms.linux,
          [Platform.UNKNOWN]: () => defaultBinding,
        })
      : defaultBinding;
  }
}

/**
 * @interface KeyWatcher
 * @description Interfaz para vigilar y rastrear objetos relacionados con teclas, como KeyBinding y KeyCombo.
 *
 * Inicia la observación de un objeto relacionado con teclas.
 * @function
 * @name KeyWatcher#watch
 * @param {KeyObservable} keyObject - Objeto a observar (ej. KeyBinding, KeyCombo).
 *
 * Detiene la observación de un objeto relacionado con teclas.
 * @function
 * @name KeyWatcher#unwatch
 * @param {KeyObservable} keyObject - Objeto que dejará de ser observado.
 *
 * Rastrea una tecla específica para detectar su estado.
 * @function
 * @name KeyWatcher#trackKey
 * @param {string} key - La tecla a rastrear (ej. "Control", "Shift", "a").
 * @param {boolean} [isRepeating=false] - Indica si la tecla está repetida.
 *
 * Verifica si una tecla específica está activa o presionada.
 * @function
 * @name KeyWatcher#isWatching
 * @param {string} key - La tecla a verificar.
 * @returns {boolean} `true` si la tecla está activa, `false` en caso contrario.
 *
 * @implements {KeyWatcher}
 */
class KeyBindings {
  _keymaps = new Map();
  _keysBuffer = new Buffer();
  _isLastKeyRepeating = false;

  onkeybindingmatched = noop;

  get keysBuffer() {
    return this._keysBuffer;
  }

  watch(keyBinding) {
    const binding = keyBinding.binding;

    if (this._keymaps.has(binding)) return;

    this._keymaps.set(binding, keyBinding);
  }

  unwatch(keyBinding) {
    const binding = keyBinding.binding;
    this._keymaps.delete(binding);
  }

  trackKey(key, isRepeating = false) {
    this._isLastKeyRepeating = isRepeating;
    if (this._isLastKeyRepeating) return;
    this._keysBuffer.push(key);
    this._checkKeyBinding();
  }

  isWatching() {
    return !!this._keymaps.size;
  }

  _checkKeyBinding() {
    const binding = this._formatKeyBindings();
    const keyBinding = this._keymaps.get(binding);

    if (!keyBinding) return;

    keyBinding.activate();
    this.onkeybindingmatched();
  }

  _formatKeyBindings() {
    return this._keysBuffer.join("+");
  }
}

export default class GameKeyboard {
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
  _keyCombos = new KeyCombos();
  _keyBindings = new KeyBindings();
  _activeKeysBuffer = new Buffer();
  _eventsMap = new Map();
  _lastActiveKey = null;

  constructor(eventHandlers) {
    this._eventHandlers = eventHandlers;

    this._eventHandlers.on("keydown", this._handlerKeyEvent);
    this._eventHandlers.on("keyup", this._handlerKeyEvent);

    this._keyCombos.onkeycombomatched = (combo, reason) => {
      this._dispatchEvent(KeyboardEvents.KEY_COMBO_MATCHED, {
        combo,
        reason,
      });
    };

    this._keyCombos.onkeycombofailed = (combo, reason) => {
      this._dispatchEvent(KeyboardEvents.KEY_COMBO_FAILED, {
        combo,
        reason,
      });
    };

    this._keyBindings.onkeybindingmatched = (keyBinding, keyCodes) => {
      this._dispatchEvent(KeyboardEvents.KEY_BINDING_MATCHED, {
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

    if (eventType === KeyboardEvents.PRESSED) {
      this._handlePressedKeyEvent(event);
    } else {
      this._handleReleasedKeyEvent(event);
    }

    if (this._eventsMap.has(eventType)) {
      this._dispatchEvent(eventType, event);
    }
  }

  _handlePressedKeyEvent({ key, code, isMeta, isRepeating }) {
    if (code !== this._lastActiveKey) {
      this._activeKeysBuffer.add(code);
    }

    if (this._keys.keyIsMeta(code)) {
      const index = this._activeKeysBuffer.indexOf(code);
      this._activeKeysBuffer.deleteRange(0, index + 1);
      this._activeKeysBuffer.add(code);
    } else if (isMeta && !this._lastActiveKey) {
      this._lastActiveKey = code;
      this._activeKeysBuffer.pop();
    }

    if (this._keyCombos.isWatching()) {
      this._keyCombos.trackKey(key);
    }

    if (this._keyBindings.isWatching()) {
      this._keyBindings.trackKey(key, isRepeating);
    }
  }

  _handleReleasedKeyEvent({ key, code }) {
    if (this._keys.keyIsMeta(code)) {
      this._activeKeysBuffer.clear();
      this._lastActiveKey = null;
    } else {
      this._activeKeysBuffer.delete(code);
    }

    if (this._keyBindings.isWatching()) {
      if (this._activeKeysBuffer.size === 0) {
        this._keyBindings.keysBuffer.clear();
      } else {
        this._keyBindings.keysBuffer.delete(key);
      }
    }
  }

  // _formatKeyBindings() {
  //   return [...this._activeKeys].join("+");
  // }

  // _addActiveKey(code, eventType) {
  //   if (eventType === KeyboardEvents.PRESSED) {
  //     this._activeKeys.add(code);
  //   } else {
  //     this._activeKeys.delete(code);
  //   }
  // }

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
    if (!enumHas(KeyboardEvents, eventType)) {
      throw new Error(`Invalid event type: ${eventType}`);
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
    if (!enumHas(KeyboardEvents, eventType)) {
      throw new Error(`Invalid event type: ${eventType}`);
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

    this._keyCombos.watch(combo);

    return combo;
  }

  _createKeyBinding(binding, config) {
    const keyBinding = new KeyBinding({
      binding,
      ...config,
    });

    this._keyBindings.watch(keyBinding);

    return keyBinding;
  }
}
