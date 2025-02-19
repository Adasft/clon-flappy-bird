export default class Animation {
  constructor({ engine, key, frames, frameRate, repeat }) {
    this.key = key;
    this.frames = frames;
    this.frameRate = frameRate;
    this.repeat = repeat;
  }
}
