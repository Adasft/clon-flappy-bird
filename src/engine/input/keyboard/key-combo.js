import { KeyComboTestReason } from "../../enums.js";
import StepFrame from "../../step-frame.js";

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
export class KeyCombo {
  _isEnabled = true;
  _isActive = false;
  _isFailed = false;
  _keysBuffer = [];
  _wasActiveBeforeDisable = false;

  constructor({
    keys = "",
    timeLimit = Infinity,
    duration = Infinity,
    isOrdered = true,
    enabled = true,
    onmatched = () => {},
  }) {
    this.keys = keys.split("").map((key) => key.toUpperCase());
    this.timeLimit = timeLimit;
    this.duration = duration;
    this.isOrdered = isOrdered;
    this._isEnabled = enabled;
    this.onmatched = onmatched;
  }

  get isEnabled() {
    return this._isEnabled;
  }

  get isActive() {
    return this._isActive;
  }

  get isFailed() {
    return this._isFailed;
  }

  enable() {
    this._isEnabled = true;
    this._isActive = this._wasActiveBeforeDisable;
  }

  disable() {
    this._isEnabled = false;
    this._wasActiveBeforeDisable = this._isActive;
    this._isActive = false;
  }

  fail() {
    if (!this._isEnabled) return;

    this._isFailed = true;
  }

  test(keyMap) {
    if (!this._isEnabled) return;

    const { key, time } = keyMap;
    const isValidTimeLimit = this.timeLimit > time;
    const isValidKey = this.keys.includes(key);
    const isOrderValid = !this.isOrdered || this._containsOrderedKey();
    const isValid = isValidTimeLimit && isValidKey && isOrderValid;

    this._keysBuffer.push(key);

    const result = {
      isValid,
      reason: KeyComboTestReason.PENDING,
    };

    if (!isValid) {
      if (!isValidTimeLimit)
        result.reason = KeyComboTestReason.TIME_LIMIT_EXCEEDED;
      else if (!isValidKey) result.reason = KeyComboTestReason.INVALID_KEY;
      else if (!isOrderValid) result.reason = KeyComboTestReason.ORDER_MISMATCH;
    } else if (this.keys.length === this._keysBuffer.length) {
      result.reason = KeyComboTestReason.MATCHED;
      this.onmatched();
    }

    return result;
  }

  reset() {
    if (!this._isEnabled) return;

    this._lastKeyTime = null;
    this._keysBuffer = [];
    this._isFailed = false;
  }

  activate() {
    if (!this._isEnabled) return;

    this._isActive = true;
    this._keysBuffer = [];

    if (this.duration === Infinity) return;

    StepFrame.createTimeout(() => {
      this.deactivate();
      this._wasActiveBeforeDisable = false;
    }, this.duration);
  }

  deactivate() {
    if (!this._isEnabled) return;
    this._isActive = false;
  }

  _containsOrderedKey() {
    const lastIndex = this._keysBuffer.length - 1;
    return this._keysBuffer[lastIndex] === this.keys[lastIndex];
  }
}
