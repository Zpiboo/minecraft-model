const displayedModel = "minecraft:block/anvil"

const toModelPath = mcpath => {
  if (mcpath.includes(":")) return `${mcpath.split(":").join("/models/")}.json`;
  return `minecraft/models/${mcpath}.json`;
};
const toTexturePath = mcpath => {
  if (mcpath.includes(":")) return `${mcpath.split(":").join("/textures/")}.png`;
  return `minecraft/textures/${mcpath}.png`;
};


const modelElement = document.querySelector(".model");

// Dragging to rotate object
const body = document.body;
let camXRot = 340;
let camYRot = 30;
refreshCam();
body.addEventListener("mousedown",
  evt => {
    evt.target.addEventListener("mousemove", onDrag);
    evt.target.addEventListener("mouseup",
      evt => {
        evt.target.removeEventListener("mousemove", onDrag);
      }
    );

  }
);
function onDrag(evt) {
  camXRot -= evt.movementY/3;
  camXRot += 90; camXRot %= 360; camXRot -= 90;
  if (camXRot < -90) camXRot = -90; if (camXRot > 90) camXRot = 90;

  camYRot -= evt.movementX/3;
  camYRot %= 360;
  refreshCam();
}
function refreshCam() {
  modelElement.style.setProperty("--x-rot", `${camXRot}deg`);
  modelElement.style.setProperty("--y-rot", `${camYRot}deg`);
  // console.log(`x rot: ${Math.round(camXRot)}deg\ny rot: ${Math.round(camYRot)}deg\n`);
}

// Read model
const modelPath = toModelPath(displayedModel);

function readModel(path, textures={}) {
  return fetch(path).then(res => res.json())
    .then(data => {
      let newTextures = textures;
      if (data.textures) {
        newTextures = {...data.textures, ...newTextures};
        for (const [key, value] of Object.entries(newTextures)) {
          let replacedValue = value;
          for (const [oldKey, oldValue] of Object.entries(textures)) {
            replacedValue = replacedValue.replace(`#${oldKey}`, oldValue);
          }
          newTextures[key] = replacedValue;
        }
      }

      if (data.elements) {
        console.log(`There is an elements array in ${path}.`);
        return { elements: data.elements, textures: newTextures };
      }
      if (!data.parent) {
        console.warn("There is nothing to display.");
        return;
      }
      console.log(`Done with ${path}!`);
      return readModel(toModelPath(data.parent), newTextures);
    });
}
readModel(modelPath)
  .then(modelOnceRead => {
    if (!modelOnceRead) return;
    // console.log(modelOnceRead);
    modelOnceRead.elements.forEach(element => {
      let readModelCube = new Cube(element, modelOnceRead.textures);
    });
  });


class Cube {
  constructor(cubeObject, textures) {
    this.element = document.createElement("div");
    this.element.classList.add("cube");

    this.element.style.setProperty("--x", `${cubeObject.from[0]}em`);
    this.element.style.setProperty("--y", `${cubeObject.from[1]}em`);
    this.element.style.setProperty("--z", `${cubeObject.from[2]}em`);
    this.element.style.setProperty("--width",  `${cubeObject.to[0]-cubeObject.from[0]}em`);
    this.element.style.setProperty("--height", `${cubeObject.to[1]-cubeObject.from[1]}em`);
    this.element.style.setProperty("--depth",  `${cubeObject.to[2]-cubeObject.from[2]}em`);

    for (const [face, {texture, uv, rotation}] of Object.entries(cubeObject.faces)) {
      var faceElement = document.createElement("div");
      faceElement.classList.add(face);
      faceElement.classList.add("face");

      let texturePath = texture;
      for (const [textureName, value] of Object.entries(textures)) {
        // console.log(face+": "+value+", "+texturePath);

        texturePath = texturePath.replace(`#${textureName}`, value);
      }
      texturePath = toTexturePath(texturePath);

      if (uv) {
        faceElement.style.setProperty(
          "--texture",
          `-moz-image-rect(url(${texturePath}), ${uv[1]*25/4}%, ${uv[2]*25/4}%, ${uv[3]*25/4}%, ${uv[0]*25/4}%)`
        );
      } else {
        faceElement.style.setProperty(
          "--texture",
          `url(${texturePath})`
        );
      }

      if (rotation) {
        let smallRotation = rotation;
        smallRotation /= 90; smallRotation = Math.round(smallRotation);
        faceElement.style.setProperty(
          "--rotation",
          `${smallRotation*90}deg`
        );

        if (smallRotation%2 === 1) faceElement.classList.add("odd-rot");
      }

      this.element.appendChild(faceElement);
    }

    modelElement.appendChild(this.element);
  }
}