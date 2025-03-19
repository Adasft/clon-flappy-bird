import { KeyComboTestReason } from "../../enums.js";
import { noop } from "../../utils.js";

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
export class KeyCombos {
  _combos = new Set();
  _inCombo = false;
  _trackedKey = null;
  _failedCombos = new Set();
  _pendingCombos = new Set();
  _comboKeysMap = new Map();
  _lastKeyTime = null;

  onkeycombomatched = noop;
  onkeycombofailed = noop;

  watch(keyCombo) {
    if (this._combos.has(keyCombo)) return;

    keyCombo.keys.forEach((key) => {
      const count = (this._comboKeysMap.get(key) ?? 0) + 1;
      this._comboKeysMap.set(key, count);
    });

    this._combos.add(keyCombo);
  }

  unwatch(keyCombo) {
    if (!this._combos.has(keyCombo)) return;

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

  isWatching() {
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
    this.onkeycombofailed(combo, reason);
    this._resetComboState(combo);
    this._failedCombos.add(combo);
  }

  _handleComboMatch(combo, reason) {
    combo.activate();
    this.onkeycombomatched(combo, reason);
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
