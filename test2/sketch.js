let blurShader;
let thresholdShader;
let canvas;
let graphics;
let buffer;
let t = 0;
let canvasSize

function preload() {
  blurShader = loadShader('blur.vert', 'blur.frag');
  thresholdShader = loadShader('threshold.vert', 'threshold.frag');
}

function setup() {
  canvasSize = (displayWidth > 600) ? 900 : 400
  canvas = createCanvas(canvasSize, canvasSize, WEBGL);
  graphics = createGraphics(canvasSize, canvasSize);
  buffer = createGraphics(canvasSize, canvasSize, WEBGL); // Buffer to hold intermediate result
  frameRate(30)
}

function draw() {
  graphics.background(255);
  // graphics.clear();
  graphics.fill(0);

  let x = graphics.width / 2 + sin(t*4) * 20;
  let y = graphics.height / 2;
  graphics.textAlign(CENTER);
  graphics.textSize(canvasSize/6);
  graphics.text(displayWidth, x, y, 150, 150);
  t += 0.05;

  // Apply blur and noise
  buffer.shader(blurShader);
  blurShader.setUniform('tex0', graphics);
  blurShader.setUniform('resolution', [graphics.width*2, graphics.height*2]);
  blurShader.setUniform('blurSize', 1.0);
  blurShader.setUniform('noiseStrength', 3.0);

  buffer.beginShape();
  buffer.vertex(-width / 2, -height / 2, 0, 0);
  buffer.vertex(width / 2, -height / 2, 1, 0);
  buffer.vertex(width / 2, height / 2, 1, 1);
  buffer.vertex(-width / 2, height / 2, 0, 1);
  buffer.endShape(CLOSE);

  // Apply threshold
  shader(thresholdShader);
  thresholdShader.setUniform('tex0', buffer);
  thresholdShader.setUniform('threshold', 0.4); // Adjust this value for threshold

  beginShape();
  vertex(-width / 2, -height / 2, 0, 0);
  vertex(width / 2, -height / 2, 1, 0);
  vertex(width / 2, height / 2, 1, 1);
  vertex(-width / 2, height / 2, 0, 1);
  endShape(CLOSE);
}
