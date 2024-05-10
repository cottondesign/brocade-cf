let easyPoints = [];
let easyPointsHistory = [];
let mainPoints = []
let groups = []

let test = [0,0,0,0,0,0,0,0]
let test2 = [0,0,0,0,0,0,0,0]
let tick = 0
let center
let bgColor = "#171C31"
let numSides = Math.floor(Math.random()*4)+4
let motionSpeed = .1
let radius
let vertexControls = false
let strokeColor = [255]
let moveList = []
let numTangles

//for test #2
let colors = []


let scrollContent = document.getElementById("scroll-content") 
for (let i=0;i<150;i++) {
  scrollContent.innerHTML += "&#8595; &#8595; &#8595; <br>"
}


function setup() {
  //for test #2
  for(let i=0;i<numSides;i++) {
    colors.push([random(255),random(255),random(255)])
  }

  canvas = createCanvas(800, 800).style("-webkit-filter", `url("#svgfilter")`).style("filter", `url("#svgfilter")`);
  canvas.parent('sketch-holder');
  center = {x:width/2, y:height/2}
  width = width*.7
  console.log(width)
  noFill();
  frameRate(60);
  radius = width/3
  cursor = loadImage("cursor.png")
  // vertexControlsButton = createButton('show/hide vertices');
  // vertexControlsButton.parent('buttons-container');
  // vertexControlsButton.mousePressed(function() {
  //   vertexControls = !vertexControls;
  // });
  // document.getElementById("sides").innerHTML += numSides
  for (let i=0;i<numSides;i++) {
    // radius += random(-width/20, width/20)
    radius = width/3 + random(-width/14, width/14)
    let angle = ((2*PI)/numSides)*i
    // angle += random(-PI/(numSides*2), PI/(numSides*2))
    let xpos = radius * cos(angle)
    let ypos = radius * sin(angle)
    let bezAngle = (angle*(360/(2*PI)))+90
    let vector = createVector(xpos,ypos)
    let bez1 = vector.mag()*2/numSides
    let bez2 = vector.mag()*2/numSides
    easyPoints.push(
      {
        x: xpos + center.x,
        y: ypos + center.y,
        angle: bezAngle,
        bez1: bez1,
        bez2: bez2,

        targetx: xpos + center.x,
        targety: ypos + center.y,
        targetangle: bezAngle,
        targetbez1: bez1,
        targetbez2: bez2,

        step: 0,
        isMain: true,
        grp: i,
        subMoves: []
      }
    )
  }
  // add support anchors
  // let length = easyPoints.length
  // let portion = .2
  // for (let i=0; i<length; i++) {
  //   subdivideBezier(i*3, portion)
  //   subdivideBezier(i*3+1, .75)
  // }

  let length = easyPoints.length
  let portion = .5
  for (let i=0; i<length; i++) {
    subdivideBezier(easyPoints, i*2, portion)
  }

  // create list of indices of main points
  for (let i=0; i<easyPoints.length; i++) {
    if (easyPoints[i].isMain) {
      mainPoints.push(i)
    }
  }
  for (let i=0;i<numSides;i++) {
    groups.push(i)
  }
  mainPoints = shuffle(mainPoints);
  // groups = shuffle(groups)

  easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));
  easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));

  actualCoords = [];
  for(let i=0;i<easyPoints.length;i++) {
    let prevIndex = (i-1+easyPoints.length)%easyPoints.length
    let angleRad = easyPoints[i].angle * (Math.PI / 180); // Convert degrees to radians here
    let prevAngleRad = easyPoints[prevIndex].angle * (Math.PI / 180); // Convert degrees to radians here
    let cp1x = easyPoints[prevIndex].x + Math.cos(prevAngleRad) * easyPoints[prevIndex].bez1; // Control point 1
    let cp1y = easyPoints[prevIndex].y + Math.sin(prevAngleRad) * easyPoints[prevIndex].bez1;
    let cp2x = easyPoints[i].x + Math.cos(angleRad + Math.PI) * easyPoints[i].bez2; // Control point 2
    let cp2y = easyPoints[i].y + Math.sin(angleRad + Math.PI) * easyPoints[i].bez2;
    actualCoords.push([cp1x, cp1y, cp2x, cp2y, easyPoints[i].x, easyPoints[i].y]);
  }
  fullTangle()
}

function draw() {
  // --------------- update coordinates for motion
  if (frameCount%4 == 0){
    let prev = moveList.length+1 // not -1 because this is an index for easypointshistory which is 1 longer
    // console.log("moveList length: ",moveList.length)
    // console.log("easyPointsHistory length: ",easyPointsHistory.length)
    for (let i = 0; i<easyPoints.length; i++) {
      if (easyPoints[i].step < 1 && easyPointsHistory.length>1) {
        // easyPoints[i].step += 0.01; // Increment step for smooth animation
        easyPoints[i].targetx = lerp(easyPointsHistory[prev][i].targetx, easyPointsHistory[prev-1][i].targetx, easyPoints[i].step);
        easyPoints[i].targety = lerp(easyPointsHistory[prev][i].targety, easyPointsHistory[prev-1][i].targety, easyPoints[i].step);
        easyPoints[i].targetangle = lerp(easyPointsHistory[prev][i].targetangle, easyPointsHistory[prev-1][i].targetangle, easyPoints[i].step);
        easyPoints[i].targetbez1 = lerp(easyPointsHistory[prev][i].targetbez1, easyPointsHistory[prev-1][i].targetbez1, easyPoints[i].step);
        easyPoints[i].targetbez2 = lerp(easyPointsHistory[prev][i].targetbez2, easyPointsHistory[prev-1][i].targetbez2, easyPoints[i].step);
      }
      easyPoints[i].x = lerp(easyPoints[i].x, easyPoints[i].targetx, motionSpeed);
      easyPoints[i].y = lerp(easyPoints[i].y, easyPoints[i].targety, motionSpeed);
      easyPoints[i].angle = lerp(easyPoints[i].angle, easyPoints[i].targetangle, motionSpeed);
      easyPoints[i].bez1 = lerp(easyPoints[i].bez1, easyPoints[i].targetbez1, motionSpeed);
      easyPoints[i].bez2 = lerp(easyPoints[i].bez2, easyPoints[i].targetbez2, motionSpeed);
    }
  }
  // -------------- update actual coordinates
  actualCoords = [];
  for(let i=0;i<easyPoints.length;i++) {
    let prevIndex = (i-1+easyPoints.length)%easyPoints.length
    let angleRad = easyPoints[i].angle * (Math.PI / 180); // Convert degrees to radians here
    let prevAngleRad = easyPoints[prevIndex].angle * (Math.PI / 180); // Convert degrees to radians here
    let cp1x = easyPoints[prevIndex].x + Math.cos(prevAngleRad) * easyPoints[prevIndex].bez1; // Control point 1
    let cp1y = easyPoints[prevIndex].y + Math.sin(prevAngleRad) * easyPoints[prevIndex].bez1;
    let cp2x = easyPoints[i].x + Math.cos(angleRad + Math.PI) * easyPoints[i].bez2; // Control point 2
    let cp2y = easyPoints[i].y + Math.sin(angleRad + Math.PI) * easyPoints[i].bez2;
    actualCoords.push([cp1x, cp1y, cp2x, cp2y, easyPoints[i].x, easyPoints[i].y]);
  }
  background(bgColor);
  noFill()
  strokeCap(SQUARE)

  
  for (let i=0; i<groups.length; i++) {
    if (i == Math.floor(groups.length/2)) {
      noStroke()
      fill(0,0,255)
      // circle(mouseX, mouseY, 10)
      image(cursor, mouseX, mouseY, 13,20)
      noFill()
    }
    // let prevIndex = (mainPoints[i]-1+actualCoords.length)%actualCoords.length
    // let nextIndex = (mainPoints[i]+1)%actualCoords.length
    for (let j=0;j<easyPoints.length;j++) {
      if (easyPoints[j].grp == groups[i]) {
        stroke(bgColor)
        strokeWeight(16)
        drawSegment(j)
        stroke(strokeColor)
        // stroke(colors[easyPoints[j].grp])
        strokeWeight(5)
        drawSegment(j)
      }
    }
  }



  
  // // -------- print angle - for testing
  // noStroke()
  // textSize(8)
  // fill(0,0,255)
  // easyPoints.forEach((v, index) => {
  //   // text(Math.round(v.angle),v.x,v.y)
  //   text(index,v.x,v.y)

  // });

  // ---------------- drawing vertex controls
  if(vertexControls) {

    for(let i=0;i<actualCoords.length;i++) {
      let prevIndex = (i-1+actualCoords.length)%actualCoords.length
      let nextIndex = (i+1)%actualCoords.length
      noFill();
      stroke(250, 0, 0);
      strokeWeight(.5);
      // circle(actualCoords[i][0], actualCoords[i][1], 4);
      // circle(actualCoords[i][2], actualCoords[i][3], 4);
      // line(actualCoords[i][4], actualCoords[i][5], actualCoords[nextIndex][0], actualCoords[nextIndex][1]);
      // line(actualCoords[i][4], actualCoords[i][5], actualCoords[i][2], actualCoords[i][3]);
      noStroke()
      fill(100);
      if (easyPoints[i].isMain) {
        fill(255,0,0);
      }
      circle(actualCoords[i][4], actualCoords[i][5], 6);
    }
  }
  noFill()
  stroke(0)
  // bezier(test[0],test[1],test[2],test[3],test[4],test[5],test[6],test[7])
  // bezier(test2[0],test2[1],test2[2],test2[3],test2[4],test2[5],test2[6],test2[7])


}


function keyPressed() {
  // if (key === 'r') {
  //   randomMove()
  // } else if (key === 'u') {
  //   undo()
  // }
}


function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


function drawSegment(i) {
  let prevIndex = (i-1+easyPoints.length)%easyPoints.length
  beginShape();
  vertex(easyPoints[prevIndex].x, easyPoints[prevIndex].y);
  bezierVertex(actualCoords[i][0], actualCoords[i][1], actualCoords[i][2], actualCoords[i][3], actualCoords[i][4], actualCoords[i][5]);
  endShape();
}


function getMain(grp) {
  for (let i=0; i<easyPoints.length; i++) {
    if (easyPoints[i].isMain && easyPoints[i].grp == grp) {
      return i
    }
  }
}


function executeMove(idx) {
  if (tick < groups.length) {
    // let pointIndex = mainPoints[tick];
    let pointIndex
    for(let i=0;i<easyPoints.length;i++) {
      if(easyPoints[i].grp == groups[tick] && easyPoints[i].isMain) {
        pointIndex = i
      }
    }
    if (!easyPoints[pointIndex].processed) {

      let tm1 = (pointIndex + easyPoints.length - 1) % easyPoints.length;
      let tp1 = (pointIndex + 1) % easyPoints.length;
      moves[idx](pointIndex, tm1, tp1); // Execute the move

      easyPoints[pointIndex].processed = true; // Mark this point as processed
      easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints))); // Store state after changes
      moveList.push(idx)
      tick++;
    }
  }
}


function executeSubMove(idx) {
  let subMoveOptions = []
  for (i=0;i<easyPoints.length;i++){
    if (easyPoints[i].subMoves.includes(idx)) {
      subMoveOptions.push(i)
    }
  } if(subMoveOptions.length>0) {
    let pointIndex = subMoveOptions[subMoveOptions.length-1]
    let tm1 = (pointIndex + easyPoints.length - 1) % easyPoints.length;
    let tp1 = (pointIndex + 1) % easyPoints.length;
    subMoves[idx](pointIndex, tm1, tp1);
    easyPoints[pointIndex].subMoves = [] //maybe just remove the one you did?
    easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));
    // tick++
    moveList.push(idx)
  }
}


function undo() {
  if (moveList.length > 0) {
    for (let i = 0; i < easyPoints.length; i++) {
      easyPoints[i].targetx = easyPointsHistory[easyPointsHistory.length-1][i].targetx;
      easyPoints[i].targety = easyPointsHistory[easyPointsHistory.length-1][i].targety;
      easyPoints[i].targetangle = easyPointsHistory[easyPointsHistory.length-1][i].targetangle;
      easyPoints[i].targetbez1 = easyPointsHistory[easyPointsHistory.length-1][i].targetbez1;
      easyPoints[i].targetbez2 = easyPointsHistory[easyPointsHistory.length-1][i].targetbez2;
      easyPoints[i].subMoves = easyPointsHistory[easyPointsHistory.length-1][i].subMoves;
      easyPoints[i].processed = false; // Reset processed flag when undoing
      // if(easyPoints[i].x != easyPoints[i].targetx) {
        easyPoints[i].step = 0
      // }
    }
    // easyPointsHistory.pop();
    moveList.pop();
    console.log(moveList.length)
  }
}


function subdivideBezier(shape, idx1, t) {
  let idx2 = (idx1+1)%shape.length
  let idx2s = (idx1+1)%(shape.length+1) //special case for splicing new points

  // format into segment
  a = createVector(shape[idx1].targetx, shape[idx1].targety)
  let angleRad = (shape[idx1].targetangle) * (Math.PI / 180); // Convert degrees to radians here
  let t_cp2x = shape[idx1].targetx + Math.cos(angleRad) * shape[idx1].targetbez1; // Control point 2
  let t_cp2y = shape[idx1].targety + Math.sin(angleRad) * shape[idx1].targetbez1;
  c1 = createVector(t_cp2x, t_cp2y)
  let angleRad2 = shape[idx2].targetangle * (Math.PI / 180); // Convert degrees to radians here
  let t_cp1x = shape[idx2].targetx + Math.cos(angleRad2 + Math.PI) * shape[idx2].targetbez2; // Control point 2
  let t_cp1y = shape[idx2].targety + Math.sin(angleRad2 + Math.PI) * shape[idx2].targetbez2;
  c2 = createVector(t_cp1x, t_cp1y)
  b = createVector(shape[idx2].targetx, shape[idx2].targety)

  // de casteljeau algorithm
  let ac1 = p5.Vector.lerp(a, c1, t);
  let bz = p5.Vector.lerp(c1, c2, t);
  let bc2 = p5.Vector.lerp(c2, b, t);
  let ac2 = p5.Vector.lerp(ac1, bz, t);
  let bc1 = p5.Vector.lerp(bz, bc2, t);
  let newLoc = p5.Vector.lerp(ac2, bc1, t);

  test=[a.x, a.y, c1.x, c1.y, c2.x, c2.y, b.x, b.y]
  test2=[a.x, a.y, ac1.x, ac1.y, ac2.x, ac2.y, newLoc.x, newLoc.y]


  // convert back to easy format
  let angleRadians = atan2(ac2.y - newLoc.y, ac2.x - newLoc.x);
  let angleDegrees = degrees(angleRadians);
  let bez1 = dist(newLoc.x, newLoc.y, ac2.x, ac2.y)
  let bez2 = dist(newLoc.x, newLoc.y, bc1.x, bc1.y)

  newVert = {
    x: newLoc.x,
    y: newLoc.y,
    angle: angleDegrees+180,
    bez1: bez2,
    bez2: bez1,

    targetx: newLoc.x,
    targety: newLoc.y,
    targetangle: angleDegrees+180,
    targetbez1: bez2,
    targetbez2: bez1,

    step: 0,
    isMain: false,
    grp: shape[idx1].grp,
    subMoves: []
  }

  angleRadians = atan2(ac1.y - shape[idx1].targety, ac1.x - shape[idx1].targetx);
  angleDegrees = degrees(angleRadians);
  bez1 = dist(shape[idx1].targetx, shape[idx1].targety, ac1.x, ac1.y)
  // bez2 = dist(shape[idx1].x, shape[idx1].y, bc1.x, bc1.y)
  shape[idx1].bez1 = bez1
  shape[idx1].targetbez1 = bez1

  angleRadians = atan2(bc2.y - shape[idx2].targety, bc2.x - shape[idx2].targetx);
  angleDegrees = degrees(angleRadians);
  // bez1 = dist(shape[idx1].x, shape[idx1].y, ac1.x, ac1.y)
  bez2 = dist(shape[idx2].targetx, shape[idx2].targety, bc2.x, bc2.y)
  shape[idx2].bez2 = bez2
  shape[idx2].targetbez2 = bez2


  shape.splice(idx2s, 0, newVert);


  // return [
  //   { a: seg.a,   c1: ac1,  c2: ac2,  b: newLoc },
  //   { a: newLoc,  c1: bc1,  c2: bc2,  b: seg.b }
  // ];
}






// ------------------ moves --------------


let moves = {

  simplePull: function(tick, tm1, tp1) {
    let distance = width*random(.8,.95)
    let angle = random(-180/(numSides*4), 180/(numSides*4))
    moveRel2Center(tick, distance, angle)
    
    // easyPoints[tick].targetangle += 180;
    let bez = random(width/12, width/2)
    easyPoints[tick].targetbez1 += bez;
    easyPoints[tick].targetbez2 += bez;

    easyPoints[tm1].targetbez1 += width/7;
    easyPoints[tp1].targetbez2 += width/7;

    easyPoints[tick].subMoves = ["twist","bigTwist"]

  }, 


  innerLoop: function(tick, tm1, tp1) {
    let distance = width*random(.76,.95)
    let angle = random(-180/(numSides*4), 180/(numSides*4))
    moveRel2Center(tick, distance, angle)
    
    easyPoints[tick].targetangle += 180;
    easyPoints[tick].targetbez1 += pow(distance,1.2) /7;
    easyPoints[tick].targetbez2 += pow(distance,1.2) /7;

    easyPoints[tm1].targetbez1 += width/7;
    easyPoints[tp1].targetbez2 += width/7;

    easyPoints[tick].subMoves = ["addLoop"]

    // easyPoints[tm1].targetangle += 180;
    // easyPoints[tp1].targetangle += 180;
  }, 

  bigInnerLoop: function(tick, tm1, tp1) {
    distance = width*random(.4,.6)
    moveRel2Center(tick, distance, 0)
    
    easyPoints[tick].targetangle += 180;
    easyPoints[tick].targetbez1 += width/3;
    easyPoints[tick].targetbez2 += width/3;

    easyPoints[tm1].targetbez1 += width/3;
    easyPoints[tp1].targetbez2 += width/3;

    easyPoints[tick].subMoves = ["addLoop"]

    // easyPoints[tm1].targetangle += 180;
    // easyPoints[tp1].targetangle += 180;
  }, 
}


let subMoves = {
  twist: function(i, tm1, tp1) {
    easyPoints[i].targetangle += 180;
  }, 
  bigTwist: function(i, tm1, tp1) {
    easyPoints[i].targetangle += 180;

    easyPoints[i].targetbez1 += width/4;
    easyPoints[i].targetbez2 += width/4;

    easyPoints[tm1].targetbez1 += width/4;
    easyPoints[tp1].targetbez2 += width/4;
  },

  addLoop: function(i, tm1, tp1) {
    subdivideHistory(i, .5)
    subdivideHistory(i, .9) // make "sub-main"?
    subdivideHistory(i, .8)
    // easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));
    moveRel2Main(i+2, width/2, 0)
    easyPoints[i+2].targetangle+=180
    easyPoints[i+2].targetbez1+=width/10
    easyPoints[i+2].targetbez2+=width/10
    
    easyPoints[i+1].targetbez1+=width/4
    easyPoints[i+3].targetbez2+=width/4
  },

}

function printGroups() {
  for (let i=0;i<easyPoints.length;i++){
    console.log(easyPoints[i].grp)
  }
}


function moveRel2Center(which, dist, angleOffset) {
  let dx = center.x - easyPoints[which].x;
  let dy = center.y - easyPoints[which].y;
  
  // Calculate the original angle to the center
  let angle = Math.atan2(dy, dx);
  angle = angle * (180/PI) //convert to degrees
  
  // Add π/8 radians to the angle
  angle += angleOffset;
  angle = angle * (PI/180) //convert back to radians
  
  // Move the point 230 pixels in the new direction
  easyPoints[which].targetx = easyPoints[which].x + dist * Math.cos(angle);
  easyPoints[which].targety = easyPoints[which].y + dist * Math.sin(angle);
}

function moveRel2Main(which, dist, angleOffset) {
  let main
  for (let i = 0;i<easyPoints.length;i++) {
    if (easyPoints[which].grp == easyPoints[i].grp && easyPoints[i].isMain) {
      main = easyPoints[i]
    }
  }
  let moveAngle = radians(main.angle + angleOffset); // Convert degrees to radians and add offset

  // Calculate new position
  let newX = easyPoints[which].x + dist * Math.cos(moveAngle);
  let newY = easyPoints[which].y + dist * Math.sin(moveAngle);

  // Update the target position of the point
  easyPoints[which].targetx = newX;
  easyPoints[which].targety = newY;
}



function fullTangle() {
  numTangles = min(max(4, numSides - Math.floor(random(3))), 4)
  for(let i=0; i<numTangles; i++) {
    randomMove()
    // if (moveList[moveList.length-1])
    //check if a submove can happen, do it half the time
  }
  console.log(numTangles, moveList.length)
  putInPlace();
}

function randomMove() {
  let keys = Object.keys(moves);
  let randomKey;
  // if(tick>0){
  if (easyPoints[getMain(groups[Math.abs(tick-1)])].subMoves.length>0 && random()>.33){//if last mainpoint (or group) interacted with has submove options
    subMove = random(easyPoints[getMain(groups[tick-1])].subMoves)
    console.log("submove",subMove)
    executeSubMove(subMove)//point (or group) and move(selected randomly from list))
    lastMove = subMove;
  } else { 
    randomKey = keys[Math.floor(Math.random() * keys.length)];
    console.log("move", randomKey)
    executeMove(randomKey);
    lastMove = randomKey; 
  }
}


function subdivideHistory(which, t){
  subdivideBezier(easyPoints, which, t)
  // for(state in easyPointsHistory) {
  for(let i = 0; i<easyPointsHistory.length; i++) {
    subdivideBezier(easyPointsHistory[i], which, t)
  }
}













// Function to create and append buttons
function createButtonsForMoves() {
  const container = document.getElementById('buttons-container');
  // let index = 0
  for (let key in moves) {
    let button = document.createElement('button');
    button.textContent = key; // Set button text as the function key
    button.onclick = function() { executeMove(key); }; // Set click handler
    container.appendChild(button); // Append the button to the container
    // index ++
  }

  container.appendChild(document.createElement('br'));
  container.appendChild(document.createTextNode('sub-moves'));

  for (let key in subMoves) {
    let button = document.createElement('button');
    button.textContent = key; // Set button text as the function key
    button.onclick = function() { executeSubMove(key); }; // Set click handler
    container.appendChild(button); // Append the button to the container
    // index ++
  }
  container.appendChild(document.createElement('br'));
  
  let randomButton = document.createElement('button');
  randomButton.textContent = "random (r)"; // Set button text as the function key
  randomButton.onclick = function() { randomMove(); }; // Set click handler
  container.appendChild(randomButton); // Append the button to the container
  // create undo button
  let button = document.createElement('button');
  button.textContent = "unravel (u)"; // Set button text as the function key
  button.onclick = function() { undo(); }; // Set click handler
  container.appendChild(button); // Append the button to the container

  let fullTangleButton = document.createElement('button');
  fullTangleButton.classList = "topMarginButton"
  fullTangleButton.textContent = "generate unknot"; // Set button text as the function key
  fullTangleButton.onclick = function() { fullTangle(); }; // Set click handler
  container.appendChild(fullTangleButton); // Append the button to the container
}

// Call function to create buttons on load
// createButtonsForMoves();



window.onscroll = function() {
  var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  var currentScroll = window.scrollY;
  var interval = scrollHeight / numTangles;  // Divide by the number of intervals
  
  // Calculate how many intervals have been passed
  var passedIntervals = Math.floor(currentScroll / interval);
  var remainingIntervals = numTangles - passedIntervals

  // Store the last interval passed in a variable, initialize if not exist
  window.lastInterval = window.lastInterval || 0;
  console.log("rem. int.", remainingIntervals, "movelist length", moveList.length)

  while (remainingIntervals < moveList.length) {
    undo()
  }

  // Check if new interval has been reached
  // if (passedIntervals > window.lastInterval) {
  //   undo();  // Call the undo function
  //   window.lastInterval = passedIntervals;  // Update the last interval
  // }
  console.log("scroll",currentScroll/interval)
  for(let i=0;i<easyPoints.length; i++) {
    easyPoints[i].step = max(0, (currentScroll/interval) - (numTangles-moveList.length)); // setting step to % progress through the current interval
  }
};


function putInPlace() {
  for (let i = 0; i<easyPoints.length; i++) {
    easyPoints[i].x = easyPoints[i].targetx
    easyPoints[i].y = easyPoints[i].targety
    easyPoints[i].angle = easyPoints[i].targetangle
    easyPoints[i].bez1 = easyPoints[i].targetbez1
    easyPoints[i].bez2 = easyPoints[i].targetbez2
  }
}