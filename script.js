const displayedModel = "minecraft:block/grass_block"

const model   = mcpath => `${mcpath.split(":").join("/models/")}.json`;
const texture = mcpath => `${mcpath.split(":").join("/textures/")}.png`;


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
}

// Read model
const modelPath = model(displayedModel);
fetch(modelPath)
  .then(res => res.json())
  .then(data => {
    console.log(data)
  });


class Cube {
  constructor(cubeObject) {
    // todo
  }
}