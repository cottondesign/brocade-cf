let imagee;

setup = function() {
  imagee = loadImage('imgs/knot-vs-unknot-v1.png');
  canvas = createCanvas(1000, 1000);
  pixelDensity(4);
  canvas.style("-webkit-filter", `url("#svgfilter")`).style("filter", `url("#svgfilter")`);
  // canvas.parent('sketch-holder');
  imageMode(CENTER);
};

draw = function() {
  // background(220);
  let aspectRatio = imagee.height / imagee.width;
  let imgWidth = 1000;
  let imgHeight = imgWidth * aspectRatio;
  image(imagee, width/2, height/2, imgWidth, imgHeight);
};
