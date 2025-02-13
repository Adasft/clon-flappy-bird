export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}

export function loadAudio(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src = src;
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = reject;
  });
}

export function createFormatterErrors(Ctor) {
  return function formatError(...errors) {
    return `GameEngine [${Ctor.name} Error]: ${errors.join("\n")}`;
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
