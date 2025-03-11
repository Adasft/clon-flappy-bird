import GameKeyboard from "./keyboard/game-keyboard.js";

export default class GameInput {
  _eventHandlers = {
    on: this._addEvent.bind(this),
    off: this._removeEvent.bind(this),
  };

  constructor(canvasContext) {
    this._canvasContext = canvasContext;
    this._keyboard = new GameKeyboard(this._eventHandlers);
  }

  get keyboard() {
    return this._keyboard;
  }

  _addEvent(type, handler) {
    this._canvasContext.canvas.addEventListener(type, handler);
  }

  _removeEvent(type, handler) {
    this._canvasContext.canvas.removeEventListener(type, handler);
  }
}
