export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Image not found (${src}).`));
  });
}

export function loadAudio(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = src;
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = () => reject(new Error(`Audio not found (${src}).`));
  });
}

export function createFormatterErrors(Ctor) {
  return function formatError(...errors) {
    return `Engine [${Ctor.name} Error]: ${errors.join("\n")}`;
  };
}

export function when(currentCase, caseHandlers) {
  if (!caseHandlers.hasOwnProperty(currentCase)) {
    return caseHandlers.default?.();
  }

  const caseHandler = caseHandlers[currentCase];

  if (typeof caseHandler !== "function") {
    throw new Error(
      `Invalid case: "${currentCase}". Expected a function but got ${typeof caseHandler}.`
    );
  }

  return caseHandler();
}

export function noop() {}

export function createVector(x = 0, y = 0) {
  const vector = { x, y };
  const vectorSetter = (x, y) => {
    vector.x = typeof x === "number" ? x : vector.x;
    vector.y = typeof y === "number" ? y : vector.y;
  };

  Object.defineProperty(vector, "set", {
    get() {
      return vectorSetter;
    },
  });

  return vector;
}

const el = document.getElementById("text");
export const log = (text) => {
  setTimeout(() => {
    el.textContent = text;
  }, 500);
};
