
let easyPoints = [];
let easyPointsHistory = [];
let origEasyPoints
let wrapSegments = [];
let mainPoints = []
let groups = []
let randSpots = {
  all:[],
  rand:[]
}

let test = [0,0,0,0,0,0,0,0]
let test2 = [0,0,0,0,0,0,0,0]
let tickStart = 1
let tick = tickStart
let center
let bgColor = "#171C31"
// let numSides = Math.floor(Math.random()*4)+6
let numSides = Math.floor(Math.random()*2)+7
// let motionSpeed = .1
let radius
let vertexControls = false
let strokeColor = [255]
let moveList = []
let numTangles = (Math.random() < 0.5) ? 3 : 4;
let targetProgress = 0
let progress = 0
let easingFactor = .03
let localT = 0
let nextInterval, passedIntervals, passedIntEZ, remainingIntervals, interval, scrollHeight
let mode = "test"

//for test #2
let colors = []


let scrollContent = document.getElementById("scroll-content") 
for (let i=0;i<150;i++) {
  scrollContent.innerHTML += "&#8595; &#8595; &#8595; <br>"
}




let moves = {

  simplePull: function(tick, tm1, tp1, p) {
    let distance = p.width*p.random(.8,.95)
    let angle = p.random(-180/(numSides*4), 180/(numSides*4))
    moveRel2Center(tick, distance, angle)
    
    // easyPoints[tick].targetangle += 180;
    let bez = p.random(p.width/12, p.width/3)
    easyPoints[tick].targetbez1 += bez;
    easyPoints[tick].targetbez2 += bez;

    easyPoints[tm1].targetbez1 += p.width/7;
    easyPoints[tp1].targetbez2 += p.width/7;

    easyPoints[tick].subMoves = [ "wrap", "wrapNoLoop"]

  }, 


  innerLoop: function(tick, tm1, tp1, p) {
    let distance = p.width*p.random(.76,.95)
    let angle = p.random(-180/(numSides*4), 180/(numSides*4))
    moveRel2Center(tick, distance, angle)
    
    easyPoints[tick].targetangle += 180;
    easyPoints[tick].targetbez1 += p.pow(distance,1.2) *.1;
    easyPoints[tick].targetbez2 += p.pow(distance,1.2) *.1;

    easyPoints[tm1].targetbez1 += p.width/7;
    easyPoints[tp1].targetbez2 += p.width/7;

    easyPoints[tick].subMoves = ["addLoop", "wrap", "wrapNoLoop"]

    // easyPoints[tm1].targetangle += 180;
    // easyPoints[tp1].targetangle += 180;
  }, 

  bigInnerLoop: function(tick, tm1, tp1, p) {
    distance = p.width*p.random(.4,.6)
    moveRel2Center(tick, distance, 0)
    
    easyPoints[tick].targetangle += 180;
    easyPoints[tick].targetbez1 += p.width/3;
    easyPoints[tick].targetbez2 += p.width/3;

    easyPoints[tm1].targetbez1 += p.width/3;
    easyPoints[tp1].targetbez2 += p.width/3;

    easyPoints[tick].subMoves = ["addLoop"]

    // easyPoints[tm1].targetangle += 180;
    // easyPoints[tp1].targetangle += 180;
  }, 
}


let subMoves = {
  twist: function(i, tm1, tp1, p) {
    easyPoints[i].targetangle += 180;
  }, 
  bigTwist: function(i, tm1, tp1, p) {
    easyPoints[i].targetangle += 180;

    easyPoints[i].targetbez1 += p.width/4;
    easyPoints[i].targetbez2 += p.width/4;

    easyPoints[tm1].targetbez1 += p.width/4;
    easyPoints[tp1].targetbez2 += p.width/4;
  },

  addLoop: function(i, tm1, tp1, p) {
    subdivideHistory(i, .5, p)
    subdivideHistory(i, .9, p) // make "sub-main"?
    subdivideHistory(i, .8, p)
    // easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));
    moveRel2Main(i+2, p.width/2, 0, p)
    easyPoints[i+2].targetangle+=180
    easyPoints[i+2].targetbez1+=p.width/10
    easyPoints[i+2].targetbez2+=p.width/10
    
    easyPoints[i+1].targetbez1+=p.width/4
    easyPoints[i+3].targetbez2+=p.width/4
  },

  wrap: function(i, tm1, tp1, p) {
    //handle bug with 1st main point
    if (i==0) {
      i = tm1+2
      tp1 -= 1
    }
    let side = "top"
    if (i>easyPoints.length*.5) {
      side = "bottom"
      console.log("bottom")
    }
    subdivideHistory(tm1, .9, p)
    subdivideHistory(tp1, .1, p)
    wrapSegments.push({
      segments: [tp1, tp1+1],
      showAfter: moveList.length,
      side: side
    })
    distance = p.width*.5
    moveRel2Center(tp1, distance, 0)
    easyPoints[tp1].targetbez1+=p.width/2
    easyPoints[tp1].targetbez2+=p.width/2
    easyPoints[tp1].targetangle-=180

    distance2 = p.width*.1
    moveRel2Center(i, distance2, 70)
    moveRel2Center(tp1+1, distance2, -70)

    easyPoints[i].targetbez1+=p.width/3
    easyPoints[tp1+1].targetbez2+=p.width/3

    easyPoints[tp1].subMoves = []
 
  }, 

  wrapNoLoop: function(i, tm1, tp1, p) {
    //handle bug with 1st main point
    if (i==0) {
      i = tm1+2
      tp1 -= 1
    }
    subdivideHistory(tm1, .9, p)
    subdivideHistory(tp1, .1, p)
    let side = "top"
    if (i>easyPoints.length*.2) {
      side = "bottom"
      console.log("bottom")
    }
    wrapSegments.push({
      segments: [tp1, tp1+1],
      showAfter: moveList.length,
      side: side
    })

    if (moveList[moveList.length-1] == "simplePull") {

      distance = p.width*.5
      moveRel2Center(tp1, distance, 0)
      easyPoints[tp1].targetbez1+=p.width/2
      easyPoints[tp1].targetbez2+=p.width/2
      // easyPoints[tp1].targetangle+=180

      distance2 = p.width*.1
      // moveRel2Center(i, distance2, 70)
      // moveRel2Center(tp1+1, distance2, -70)
      easyPoints[i].targetangle+=50
      easyPoints[tp1+1].targetangle-=50
      easyPoints[i].targetbez1+=p.width/3
      easyPoints[tp1+1].targetbez2+=p.width/3

      easyPoints[tp1].subMoves = []

      if (p.random() > 1) {
        easyPoints[i].targetangle+=30
        easyPoints[tp1+1].targetangle-=30
      }
    } else {
      distance = p.width*.5
      moveRel2Center(tp1, distance, 0)
      easyPoints[tp1].targetbez1+=p.width*.1
      easyPoints[tp1].targetbez2+=p.width*.1
      // easyPoints[tp1].targetangle+=180

      distance2 = p.width*1.1
      // moveRel2Center(i, distance2, 70)
      // moveRel2Center(tp1+1, distance2, -70)

      easyPoints[i].targetangle+=50
      easyPoints[tp1+1].targetangle-=50
      easyPoints[i].targetbez1+=p.width * .1
      easyPoints[tp1+1].targetbez2+=p.width * .1

      easyPoints[tp1].subMoves = []

      if (p.random() > .5) {
        // easyPoints[i].targetangle+=30
        // easyPoints[tp1+1].targetangle-=30
      }
    }
 
  }

}





let mainSketch = function(p) {

  p.setup = function() {
    //for test #2
    for(let i=0;i<numSides;i++) {
      colors.push([p.random(255),p.random(255),p.random(255)])
    }



    canvas = p.createCanvas(800, 800)
    canvas.style("-webkit-filter", `url("#svgfilter")`).style("filter", `url("#svgfilter")`);
    canvas.style('position', 'absolute');
    canvas.parent('sketch-holder');
    center = {x:p.width/2, y:p.height/2}
    p.width *= .7
    p.noFill();
    p.frameRate(60);
    radius = p.width/3
    cursor = p.loadImage("cursor.png")
    // document.getElementById("sides").innerHTML += numSides
    for (let i=0;i<numSides;i++) {
      // radius += random(-width/20, width/20)
      radius = p.width/3 + p.random(-p.width/14, p.width/14)
      let angle = ((2*p.PI)/numSides)*i
      // angle += random(-PI/(numSides*2), PI/(numSides*2))
      let xpos = radius * p.cos(angle)
      let ypos = radius * p.sin(angle)
      let bezAngle = (angle*(360/(2*p.PI)))+90
      let vector = p.createVector(xpos,ypos)
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
      subdivideBezier(easyPoints, i*2, portion, p)
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

    origEasyPoints = JSON.parse(JSON.stringify(easyPoints))

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
    fullTangle(p)
    putInPlace();
    // createButtonsForMoves(p);

  }


  window.onscroll = function() {


    // Store the last interval passed in a variable, initialize if not exist
    window.lastInterval = window.lastInterval || 0;

  
    // Check if new interval has been reached
    // if (passedIntervals > window.lastInterval) {
    //   undo();  // Call the undo function
    //   window.lastInterval = passedIntervals;  // Update the last interval
    // }
    for(let i=0;i<easyPoints.length; i++) {
      // easyPoints[i].step = Math.max(0, (currentScroll/interval) - (numTangles-moveList.length)+1); // setting step to % progress through the current interval
    }
  
    if (Math.floor(window.scrollY / interval) == 0 && moveList.length == 1) {
      console.log("new unknot")
      wrapSegments = [];
      moveList = [];
      // groups = []
      randSpots = {
        all:[],
        rand:[]
      }
      easyPoints = JSON.parse(JSON.stringify(origEasyPoints))
      easyPointsHistory = []
      easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)))
      easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)))
      tick = tickStart
      passedIntervals = 0
      progress = targetProgress
      fullTangle(p)
      console.log("passedIntervals",passedIntervals)
    }

  };


  p.draw = function() {
    scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    interval = scrollHeight / numTangles+1;
    // Divide by the number of intervals
    targetProgress = p.map(window.scrollY, 0,scrollHeight, 0,numTangles)
    // console.log("targ",targetProgress,"moves",numTangles-moveList.length)
    if(mode == "full") {targetProgress = p.max(numTangles-moveList.length, targetProgress)}
    //variable to make passedintervals based on lag progress not actual scroll
    let asdf = p.map(progress, 0,numTangles,  0,scrollHeight)
    passedIntervals = Math.floor(asdf / interval);
    //invert index for history
    passedIntEZ = numTangles - passedIntervals // maybe get rid of - 1 ?
    nextInterval = passedIntEZ + 1;
    remainingIntervals = numTangles - passedIntervals +1
    let count = 0
    while (remainingIntervals < moveList.length && count<10) {
      undo()
      console.log("undo")
      count++
    }
    let step = (targetProgress - progress) * easingFactor;
    if(step){progress += step}
    localT = progress - passedIntervals
    console.log("remaining Intervals", remainingIntervals)
    console.log("passed intervals", passedIntervals)


    // --------------- update coordinates for motion
    if (p.frameCount%3 == 0){
      // console.log("nextInterval",nextInterval)
      // console.log("passedIntEZ",passedIntEZ)
      // console.log("easyPointsHistory length",easyPointsHistory.length)
      if(mode == "full"){
        if (passedIntervals+1 && moveList.length > 1) {
          for (let i = 0; i<easyPoints.length; i++) {
            easyPoints[i].x = p.lerp(easyPointsHistory[nextInterval][i].targetx, easyPointsHistory[passedIntEZ][i].targetx, localT);
            easyPoints[i].y = p.lerp(easyPointsHistory[nextInterval][i].targety, easyPointsHistory[passedIntEZ][i].targety, localT);
            easyPoints[i].angle = p.lerp(easyPointsHistory[nextInterval][i].targetangle, easyPointsHistory[passedIntEZ][i].targetangle, localT);
            easyPoints[i].bez1 = p.lerp(easyPointsHistory[nextInterval][i].targetbez1, easyPointsHistory[passedIntEZ][i].targetbez1, localT);
            easyPoints[i].bez2 = p.lerp(easyPointsHistory[nextInterval][i].targetbez2, easyPointsHistory[passedIntEZ][i].targetbez2, localT);
          }
        }
      }
      else if (mode == "test") {
        for (let i = 0; i<easyPoints.length; i++) {
          easyPoints[i].x = p.lerp(easyPoints[i].x, easyPoints[i].targetx, .1);
          easyPoints[i].y = p.lerp(easyPoints[i].y, easyPoints[i].targety, .1);
          easyPoints[i].angle = p.lerp(easyPoints[i].angle, easyPoints[i].targetangle, .1);
          easyPoints[i].bez1 = p.lerp(easyPoints[i].bez1, easyPoints[i].targetbez1, .1);
          easyPoints[i].bez2 = p.lerp(easyPoints[i].bez2, easyPoints[i].targetbez2, .1);
        }
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
    
    // localT = p.max(0, p.min(1,progress - passedIntervals))
    // console.log("targetProgress", targetProgress)
    // console.log("progress", progress)
    // console.log("localT", localT)
    // console.log("targetProgress: ",targetProgress,"\nprogress: ", progress)
    // console.log("passedIntervals",passedIntervals)

    // p.background(bgColor);
    p.clear()
    p.noFill()
    // canvas2.noFill()

    // let targetCanvas
    
    // for (let i=0; i<groups.length; i++) {

    //   // if (i == Math.floor(groups.length/2)) {
    //   //   noStroke()
    //   //   fill(0,0,255)
    //   //   // circle(mouseX, mouseY, 10)
    //   //   image(cursor, mouseX, mouseY, 13,20)
    //   //   noFill()
    //   // }
    //   // let prevIndex = (mainPoints[i]-1+actualCoords.length)%actualCoords.length
    //   // let nextIndex = (mainPoints[i]+1)%actualCoords.length
    //   for (let j=0;j<easyPoints.length;j++) {
    //     if (easyPoints[j].grp == groups[i]) {
    //       p.stroke(bgColor)
    //       p.strokeWeight(16)
    //       drawSegment(j, p)
    //       p.stroke(strokeColor)
    //       // stroke(colors[easyPoints[j].grp])
    //       p.strokeWeight(5)
    //       drawSegment(j, p)
    //     }
    //   }
    // }
    drawSegments(p, Math.floor(groups.length / 2)-1, groups.length);
    drawWrapSegments(p, "top")




    
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
        p.noFill();
        p.stroke(250, 0, 0);
        p.strokeWeight(.5);
        // p.circle(actualCoords[i][0], actualCoords[i][1], 4);
        // p.circle(actualCoords[i][2], actualCoords[i][3], 4);
        // p.line(actualCoords[i][4], actualCoords[i][5], actualCoords[nextIndex][0], actualCoords[nextIndex][1]);
        // p.line(actualCoords[i][4], actualCoords[i][5], actualCoords[i][2], actualCoords[i][3]);
        p.noStroke()
        p.fill(100);
        if (easyPoints[i].isMain) {
          p.fill(255,0,0);
        }
        p.circle(actualCoords[i][4], actualCoords[i][5], 6);
        p.textSize(20)
        p.text(i, actualCoords[i][4], actualCoords[i][5])
      }
    }
    p.noFill()
    p.stroke(0)
    // bezier(test[0],test[1],test[2],test[3],test[4],test[5],test[6],test[7])
    // bezier(test2[0],test2[1],test2[2],test2[3],test2[4],test2[5],test2[6],test2[7])


  }








    // Function to create and append buttons
  

}

let btmSketch = function(p) {
  p.setup = function() {
      canvas = p.createCanvas(800, 800)
      canvas.style("-webkit-filter", `url("#svgfilter")`).style("filter", `url("#svgfilter")`);
      canvas.style('position', 'absolute');
      canvas.parent('sketch-holder-2');
      canvas.id('btmSketch');
      

      p.noFill();
      p.frameRate(60);
  };

  p.draw = function() {
      p.background("#171C31");
      drawWrapSegments(p, "bottom")
      drawSegments(p, 0, Math.floor(groups.length / 2)-1);

      // p.background(255,0,0)
      // p.clear()
      // drawHalfSegments(p);
  };

  p.keyPressed = function() {
    if (p.key === 'r') {
      randomMove(p)
    } else if (p.key === 'u') {
      undo()
    }
  }

};



let cursorSketch = function(p) {
  let imgCursor;  // Variable to hold the image

  p.preload = function() {
      imgCursor = p.loadImage('cursor.png');  // Load the image
  };

  p.setup = function() {
      canvas = p.createCanvas(800, 800);  // Create a canvas
      canvas.parent('sketch-holder-3');
      canvas.id('cursorSketch');
      p.imageMode(p.CENTER)
      p.noCursor();  // Optionally hide the default cursor
  };

  p.draw = function() {
      p.clear()
      p.image(imgCursor, p.mouseX, p.mouseY , 16, 22);  // Draw the image at the mouse location
  };
};



new p5(mainSketch, 'canvasContainer1');
new p5(cursorSketch, 'canvasContainer1');
new p5(btmSketch, 'canvasContainer2');






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


function drawSegment(i, p) {
  let prevIndex = (i-1+easyPoints.length)%easyPoints.length
  p.beginShape();
  p.vertex(easyPoints[prevIndex].x, easyPoints[prevIndex].y);
  p.bezierVertex(actualCoords[i][0], actualCoords[i][1], actualCoords[i][2], actualCoords[i][3], actualCoords[i][4], actualCoords[i][5]);
  p.endShape();
}

function drawSegments(p, start, end) {
  for (let i = start; i < end; i++) {
    for (let j = 0; j < easyPoints.length; j++) {
      if (easyPoints[j].grp == groups[i] && !isInBottomWrapSegment(j)) {
        p.strokeCap(p.SQUARE)
        p.stroke(strokeColor)
        p.strokeWeight(14)
        drawSegment(j, p)
        p.stroke(bgColor)
        // stroke(colors[easyPoints[j].grp])
        p.strokeWeight(8)
        drawSegment(j, p)
      }
    }
  }
}

function drawWrapSegments(p, side) {
  for (let j = 0; j < wrapSegments.length; j++) {
    if (wrapSegments[j].showAfter < moveList.length-1 && wrapSegments[j].side == side){
      for (let i=0;i<2;i++) {
        p.strokeCap(p.SQUARE)
        p.stroke(strokeColor)
        p.strokeWeight(14)
        drawSegment(wrapSegments[j].segments[i], p)
        p.stroke(255,0,0)
        p.stroke(bgColor)
        // stroke(colors[easyPoints[j].grp])
        p.strokeWeight(8)
        drawSegment(wrapSegments[j].segments[i], p)
      }
    }
  }
}

function isInBottomWrapSegment(index) {
  for (let k = 0; k < wrapSegments.length; k++) {
    if (wrapSegments[k].side === "bottom" && wrapSegments[k].segments.includes(index) && moveList.length-1 > wrapSegments[k].showAfter) {
      return true;
    }
  }
  return false;
}


function getMain(grp) {
  for (let i=0; i<easyPoints.length; i++) {
    if (easyPoints[i].isMain && easyPoints[i].grp == grp) {
      return i
    }
  }
}


function executeMove(idx, p, grpIndex) {
  if (tick < groups.length) {
    // let pointIndex = mainPoints[tick];
    let pointIndex = getMain(grpIndex)

    if (!easyPoints[pointIndex].processed) {

      let tm1 = (pointIndex + easyPoints.length - 1) % easyPoints.length; //support points
      let tp1 = (pointIndex + 1) % easyPoints.length; //support points
      moves[idx](pointIndex, tm1, tp1, p); // Execute the move

      easyPoints[pointIndex].processed = true; // Mark this point as processed
      easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints))); // Store state after changes
      moveList.push(idx)
      tick++;

      if (grpIndex < numSides/2+1 && grpIndex > numSides/2-1) {
        wrapSegments.push({
          segments: [pointIndex, pointIndex+1],  // Example segment indices
          showAfter: moveList.length-1,      
          side: "bottom"     // Ensure this is "bottom" for bottom segments
        });
        //remove possibility of submove (?)
        easyPoints[pointIndex].subMoves = []
      }
    }

  }
}


function executeSubMove(idx, p) {
  let subMoveOptions = []
  for (i=0;i<easyPoints.length;i++){
    if (easyPoints[i].subMoves.includes(idx)) {
      subMoveOptions.push(i)
    }
  } if(subMoveOptions.length>0) {
    let pointIndex = subMoveOptions[subMoveOptions.length-1]
    let tm1 = (pointIndex + easyPoints.length - 1) % easyPoints.length;
    let tp1 = (pointIndex + 1) % easyPoints.length;
    subMoves[idx](pointIndex, tm1, tp1, p);
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
      easyPoints[i].processed = false;
      if(easyPoints[i].x != easyPoints[i].targetx) {
        easyPoints[i].step = 0
      }
    }
    // easyPointsHistory.pop();
    moveList.pop();
    console.log(moveList.length)
  }
}


function subdivideBezier(shape, idx1, t, p) {
  let idx2 = (idx1+1)%shape.length
  let idx2s = (idx1+1)%(shape.length+1) //special case for splicing new points

  // format into segment
  a = p.createVector(shape[idx1].targetx, shape[idx1].targety)
  let angleRad = (shape[idx1].targetangle) * (Math.PI / 180); // Convert degrees to radians here
  let t_cp2x = shape[idx1].targetx + Math.cos(angleRad) * shape[idx1].targetbez1; // Control point 2
  let t_cp2y = shape[idx1].targety + Math.sin(angleRad) * shape[idx1].targetbez1;
  c1 = p.createVector(t_cp2x, t_cp2y)
  let angleRad2 = shape[idx2].targetangle * (Math.PI / 180); // Convert degrees to radians here
  let t_cp1x = shape[idx2].targetx + Math.cos(angleRad2 + Math.PI) * shape[idx2].targetbez2; // Control point 2
  let t_cp1y = shape[idx2].targety + Math.sin(angleRad2 + Math.PI) * shape[idx2].targetbez2;
  c2 = p.createVector(t_cp1x, t_cp1y)
  b = p.createVector(shape[idx2].targetx, shape[idx2].targety)

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
  let angleRadians = p.atan2(ac2.y - newLoc.y, ac2.x - newLoc.x);
  let angleDegrees = p.degrees(angleRadians);
  let bez1 = p.dist(newLoc.x, newLoc.y, ac2.x, ac2.y)
  let bez2 = p.dist(newLoc.x, newLoc.y, bc1.x, bc1.y)

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

  angleRadians = p.atan2(ac1.y - shape[idx1].targety, ac1.x - shape[idx1].targetx);
  angleDegrees = p.degrees(angleRadians);
  bez1 = p.dist(shape[idx1].targetx, shape[idx1].targety, ac1.x, ac1.y)
  // bez2 = dist(shape[idx1].x, shape[idx1].y, bc1.x, bc1.y)
  shape[idx1].bez1 = bez1
  shape[idx1].targetbez1 = bez1

  angleRadians = p.atan2(bc2.y - shape[idx2].targety, bc2.x - shape[idx2].targetx);
  angleDegrees = p.degrees(angleRadians);
  // bez1 = dist(shape[idx1].x, shape[idx1].y, ac1.x, ac1.y)
  bez2 = p.dist(shape[idx2].targetx, shape[idx2].targety, bc2.x, bc2.y)
  shape[idx2].bez2 = bez2
  shape[idx2].targetbez2 = bez2


  shape.splice(idx2s, 0, newVert);


  // return [
  //   { a: seg.a,   c1: ac1,  c2: ac2,  b: newLoc },
  //   { a: newLoc,  c1: bc1,  c2: bc2,  b: seg.b }
  // ];
}






// ------------------ moves --------------




function printGroups() {
  for (let i=0;i<easyPoints.length;i++){
    console.log(easyPoints[i].grp)
  }
}


function moveRel2Center(which, dist, angleOffset) {
  let dx = center.x - easyPoints[which].targetx;
  let dy = center.y - easyPoints[which].targety;
  
  // Calculate the original angle to the center
  let angle = Math.atan2(dy, dx);
  angle = angle * (180/Math.PI) //convert to degrees
  
  angle += angleOffset;
  angle = angle * (Math.PI/180) //convert back to radians
  
  easyPoints[which].targetx = easyPoints[which].targetx + dist * Math.cos(angle);
  easyPoints[which].targety = easyPoints[which].targety + dist * Math.sin(angle);
}

function moveRel2Main(which, dist, angleOffset, p) {
  let main
  for (let i = 0;i<easyPoints.length;i++) {
    if (easyPoints[which].grp == easyPoints[i].grp && easyPoints[i].isMain) {
      main = easyPoints[i]
    }
  }
  let moveAngle = p.radians(main.angle + angleOffset); // Convert degrees to radians and add offset

  // Calculate new position
  let newX = easyPoints[which].x + dist * Math.cos(moveAngle);
  let newY = easyPoints[which].y + dist * Math.sin(moveAngle);

  // Update the target position of the point
  easyPoints[which].targetx = newX;
  easyPoints[which].targety = newY;
}



function fullTangle(p) {
  // numTangles = Math.min(Math.max(4, numSides - Math.floor(Math.random(3))), 4)
  mode = "full"
  // numTangles = 5
  for (let i=0;i<numSides;i++) {
    if (i<numSides/2-1 || i>numSides/2+1)
    randSpots.all.push(i)
  }
  for (let i=0;i<numTangles;i++) {
      let index = Math.floor(Math.random() * randSpots.all.length);
      let value = randSpots.all.splice(index, 1)[0];
      randSpots.rand.push(value);
  }
  randSpots.rand.sort((a, b) => a - b);

  for(let i=0; i<numTangles; i++) {
    randomMove(p)
    // if (moveList[moveList.length-1])
    //check if a submove can happen, do it half the time
  }
}


let nonRepeatingKeys = ["bigInnerLoop"];  // Add keys here that shouldn't repeat
let weightedKeys = []; // List of keys with increased likelihood

function randomMove(p) {
  let keys = Object.keys(moves);
  let randomKey;
  let grpIndex
  if (randSpots) {
    grpIndex = randSpots.rand[tick]

  } else {
    grpIndex = tick
  }
  let prevGrpIndex = randSpots.rand[tick-1]
  // if(tick>0){
  if (easyPoints[getMain(groups[Math.abs(prevGrpIndex)])].subMoves.length>0 && Math.random()>.33){//if last mainpoint (or group) interacted with has submove options
    subMove = p.random(easyPoints[getMain(groups[prevGrpIndex])].subMoves)
    console.log("submove",subMove)
    executeSubMove(subMove, p)//point (or group) and move(selected randomly from list))
    lastMove = subMove;
  } else {
    if (nonRepeatingKeys.includes(moveList[moveList.length-1])) {
      do randomKey = keys[Math.floor(Math.random() * keys.length)];
      while (randomKey == moveList[moveList.length-1])
    } else randomKey = keys[Math.floor(Math.random() * keys.length)];
    console.log("move", randomKey)
    executeMove(randomKey, p, grpIndex);
    lastMove = randomKey;
  }
  // moveAllABit(p)
}




function subdivideHistory(which, t, p){
  subdivideBezier(easyPoints, which, t, p)
  // for(state in easyPointsHistory) {
  for(let i = 0; i<easyPointsHistory.length; i++) {
    subdivideBezier(easyPointsHistory[i], which, t, p)
  }
}









createButtonsForMoves = function(p) {
  const container = document.getElementById('buttons-container');
  // let index = 0
  vertexControlsButton = p.createButton('show/hide vertices');
  vertexControlsButton.parent('buttons-container');
  vertexControlsButton.mousePressed(function() {
    vertexControls = !vertexControls;
  });
  for (let key in moves) {
    let button = document.createElement('button');
    button.textContent = key; // Set button text as the function key
    button.onclick = function() { executeMove(key, p, tick); }; // Set click handler
    container.appendChild(button); // Append the button to the container
    // index ++
  }

  container.appendChild(document.createElement('br'));
  container.appendChild(document.createTextNode('sub-moves'));

  for (let key in subMoves) {
    let button = document.createElement('button');
    button.textContent = key; // Set button text as the function key
    button.onclick = function() { executeSubMove(key, p); }; // Set click handler
    container.appendChild(button); // Append the button to the container
    // index ++
  }
  container.appendChild(document.createElement('br'));
  
  let randomButton = document.createElement('button');
  randomButton.textContent = "random (r)"; // Set button text as the function key
  randomButton.onclick = function() { randomMove(p); }; // Set click handler
  container.appendChild(randomButton); // Append the button to the container
  // create undo button
  let button = document.createElement('button');
  button.textContent = "unravel (u)"; // Set button text as the function key
  button.onclick = function() { undo(); }; // Set click handler
  container.appendChild(button); // Append the button to the container

  let fullTangleButton = document.createElement('button');
  fullTangleButton.classList = "topMarginButton"
  fullTangleButton.textContent = "generate unknot"; // Set button text as the function key
  fullTangleButton.onclick = function() { fullTangle(p); }; // Set click handler
  container.appendChild(fullTangleButton); // Append the button to the container
}






function moveAllABit(p) {
  for (let i = 0; i<easyPoints.length; i++) {
    if (p.random() >.25) {
      easyPoints[i].targetx += p.random(-10, 10)
      easyPoints[i].targety += p.random(-10, 10)
      // easyPoints[i].targetangle += p.random(-10, 10)
      // easyPoints[i].targetbez1 += p.random(-10, 10)
      // easyPoints[i].targetbez2 += p.random(-10, 10)
    }
  }
}




function putInPlace() {
  for (let i = 0; i<easyPoints.length; i++) {
    easyPoints[i].x = easyPoints[i].targetx
    easyPoints[i].y = easyPoints[i].targety
    easyPoints[i].angle = easyPoints[i].targetangle
    easyPoints[i].bez1 = easyPoints[i].targetbez1
    easyPoints[i].bez2 = easyPoints[i].targetbez2
  }
}