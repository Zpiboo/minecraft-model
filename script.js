const displayedModel = "minecraft:block/grass_block"

const model   = mcpath => mcpath.split(":").join("/models/");
const texture = mcpath => mcpath.split(":").join("/textures/");


const modelElement = document.querySelector(".model");