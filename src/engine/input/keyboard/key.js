import { KeyboardEvents } from "../../enums.js";
import { when } from "../../utils.js";

export class Key {
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
