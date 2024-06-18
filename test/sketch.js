let img;
let shaderProgram;

function preload() {
  img = loadImage('https://media.istockphoto.com/id/1183804334/vector/logo-elements-design.jpg?s=612x612&w=0&k=20&c=l-Jp-vLvgh5pyViVQ9TKBBVBl0YTeZ6v-LUsVMGLLwk='); // Load the image
  shaderProgram = loadShader('shader.vert', 'shader.frag'); // Load the shaders
}

function setup() {
  createCanvas(612, 612, WEBGL);
  noStroke();
  img.resize(width, height);
}

function draw() {
  shader(shaderProgram);
  shaderProgram.setUniform('texture', img);
  shaderProgram.setUniform('resolution', [width, height]);
  shaderProgram.setUniform('time', millis() / 1000.0);
  rect(0, 0, width, height);
}
