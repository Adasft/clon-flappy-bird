import { KeyComboTestReason } from "../../enums.js";
import StepFrame from "../../step-frame.js";

export class KeyCombo {
  _isEnabled = true;
  _isActive = false;
  _isFailed = false;
  _keysBuffer = [];

  constructor({
    keys = "",
    timeLimit = Infinity,
    duration = Infinity,
    isOrdered = true,
    onmatched = () => {},
  }) {
    this.keys = keys.split("").map((key) => key.toUpperCase());
    this.timeLimit = timeLimit;
    this.duration = duration;
    this.isOrdered = isOrdered;
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
  }

  disable() {
    this._isEnabled = false;
  }

  fail() {
    this._isFailed = true;
  }

  test(keyMap) {
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
    this._lastKeyTime = null;
    this._keysBuffer = [];
    this._isFailed = false;
  }

  activate() {
    this._isActive = true;
    this._keysBuffer = [];

    if (this.duration === Infinity) return;

    StepFrame.createTimeout(() => {
      this.desactivate();
    }, this.duration);
  }

  desactivate() {
    this._isActive = false;
  }

  _containsOrderedKey() {
    const lastIndex = this._keysBuffer.length - 1;
    return this._keysBuffer[lastIndex] === this.keys[lastIndex];
  }
}
