import { KeyComboTestReason } from "../../enums.js";
import { noop } from "../../utils.js";

export class KeyComboWatcher {
  _combos = new Set();
  _inCombo = false;
  _trackedKey = null;
  _failedCombos = new Set();
  _pendingCombos = new Set();
  _comboKeysMap = new Map();
  _lastKeyTime = null;

  oncombomatched = noop;
  oncombofailed = noop;

  watch(keyCombo) {
    if (this._combos.has(keyCombo)) return;

    keyCombo.keys.forEach((key) => {
      const count = (this._comboKeysMap.get(key) ?? 0) + 1;
      this._comboKeysMap.set(key, count);
    });

    this._combos.add(keyCombo);
  }

  unwatch(keyCombo) {
    if (!this._comboKeysMap.has(keyCombo)) return;

    keyCombo.keys.forEach((key) => {
      const count = this._comboKeysMap.get(key) - 1;

      if (count === 0) {
        this._comboKeysMap.delete(key);
      } else {
        this._comboKeysMap.set(key, count);
      }
    });

    this._combos.delete(keyCombo);
  }

  hasCombos() {
    return !!this._combos.size;
  }

  trackKey(key) {
    const now = performance.now();
    const keyMap = {
      key: key.toUpperCase(),
      time: 0,
    };

    this._inCombo = this._inCombo || this._comboKeysMap.has(keyMap.key);

    if (!this._inCombo) {
      this._lastKeyTime = null;
      return;
    }

    if (this._lastKeyTime) {
      keyMap.time = now - this._lastKeyTime;
    }

    this._trackedKey = keyMap;

    this._lastKeyTime = now;
    this._checkCombos();
  }

  _checkCombos() {
    for (const combo of this._combos) {
      if (!combo.isEnabled || combo.isActive || combo.isFailed) continue;

      const { isValid, reason } = combo.test(this._trackedKey);

      if (!isValid) {
        this._handleComboFailure(combo, reason);
      } else if (reason === KeyComboTestReason.PENDING) {
        this._pendingCombos.add(combo);
      } else if (reason === KeyComboTestReason.MATCHED) {
        this._handleComboMatch(combo, reason);
      }
    }

    if (this._pendingCombos.size === 0) {
      this._resetFailedCombos();
    }
  }

  _handleComboFailure(combo, reason) {
    combo.fail();
    this.oncombofailed(combo, reason);
    this._resetComboState(combo);
    this._failedCombos.add(combo);
  }

  _handleComboMatch(combo, reason) {
    combo.activate();
    this.oncombomatched(combo, reason);
    this._resetComboState(combo);
  }

  _resetComboState(combo) {
    this._inCombo = false;
    this._pendingCombos.delete(combo);
  }

  _resetFailedCombos() {
    this._failedCombos.forEach((combo) => combo.reset());
    this._failedCombos.clear();
  }
}
