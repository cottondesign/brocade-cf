let easyUnknot = function(p) {
    let easyPoints = [];
    let easyPointsHistory = [];
    let mainPoints = []
    let groups = []
  
    let test = [0,0,0,0,0,0,0,0]
    let test2 = [0,0,0,0,0,0,0,0]
    let tick = 0
    let center

    let numSides = Math.floor(Math.random()*4)+4
    let motionSpeed = .1
    let radius
    let vertexControls = false
    let moveList = []
    let numTangles
  
    //for test #2
    let colors = []
  
    
  
  

  
  
    p.setup = function() {
      //for test #2
      for(let i=0;i<numSides;i++) {
        colors.push([p.random(255),p.random(255),p.random(255)])
      }
  
      let canvas = p.createCanvas(p.windowHeight, p.windowHeight).style("-webkit-filter", `url("#svgfilter")`).style("filter", `url("#svgfilter")`);
      canvas.parent('sketch-holder');
      center = {x:p.width/2, y:p.height/2}
      p.width = p.width*.7
      console.log(p.width)
      p.noFill();
      p.frameRate(60);
      radius = p.width/3
  
      for (let i=0;i<numSides;i++) {
        radius = p.width/3 + p.random(-p.width/14, p.width/14)
        let angle = ((2*p.PI)/numSides)*i
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
  
      let length = easyPoints.length
      let portion = .5
      for (let i=0; i<length; i++) {
        subdivideBezier(easyPoints, i*2, portion)
      }
  
      for (let i=0; i<easyPoints.length; i++) {
        if (easyPoints[i].isMain) {
          mainPoints.push(i)
        }
      }
      for (let i=0;i<numSides;i++) {
        groups.push(i)
      }
      mainPoints = shuffle(mainPoints);
  
      easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));
      easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));
  
      actualCoords = [];
      for(let i=0;i<easyPoints.length;i++) {
        let prevIndex = (i-1+easyPoints.length)%easyPoints.length
        let angleRad = easyPoints[i].angle * (Math.PI / 180);
        let prevAngleRad = easyPoints[prevIndex].angle * (Math.PI / 180);
        let cp1x = easyPoints[prevIndex].x + Math.cos(prevAngleRad) * easyPoints[prevIndex].bez1;
        let cp1y = easyPoints[prevIndex].y + Math.sin(prevAngleRad) * easyPoints[prevIndex].bez1;
        let cp2x = easyPoints[i].x + Math.cos(angleRad + Math.PI) * easyPoints[i].bez2;
        let cp2y = easyPoints[i].y + Math.sin(angleRad + Math.PI) * easyPoints[i].bez2;
        actualCoords.push([cp1x, cp1y, cp2x, cp2y, easyPoints[i].x, easyPoints[i].y]);
      }
      fullTangle()
      createButtonsForMoves(p);
    }
  
    p.draw = function() {
      if (p.frameCount%4 == 0){
        let prev = moveList.length+1
        for (let i = 0; i<easyPoints.length; i++) {
          if (easyPoints[i].step < 1 && easyPointsHistory.length>1) {
            easyPoints[i].targetx = p.lerp(easyPointsHistory[prev][i].targetx, easyPointsHistory[prev-1][i].targetx, easyPoints[i].step);
            easyPoints[i].targety = p.lerp(easyPointsHistory[prev][i].targety, easyPointsHistory[prev-1][i].targety, easyPoints[i].step);
            easyPoints[i].targetangle = p.lerp(easyPointsHistory[prev][i].targetangle, easyPointsHistory[prev-1][i].targetangle, easyPoints[i].step);
            easyPoints[i].targetbez1 = p.lerp(easyPointsHistory[prev][i].targetbez1, easyPointsHistory[prev-1][i].targetbez1, easyPoints[i].step);
            easyPoints[i].targetbez2 = p.lerp(easyPointsHistory[prev][i].targetbez2, easyPointsHistory[prev-1][i].targetbez2, easyPoints[i].step);
          }
          easyPoints[i].x = p.lerp(easyPoints[i].x, easyPoints[i].targetx, motionSpeed);
          easyPoints[i].y = p.lerp(easyPoints[i].y, easyPoints[i].targety, motionSpeed);
          easyPoints[i].angle = p.lerp(easyPoints[i].angle, easyPoints[i].targetangle, motionSpeed);
          easyPoints[i].bez1 = p.lerp(easyPoints[i].bez1, easyPoints[i].targetbez1, motionSpeed);
          easyPoints[i].bez2 = p.lerp(easyPoints[i].bez2, easyPoints[i].targetbez2, motionSpeed);
        }
      }
  
      actualCoords = [];
      for(let i=0;i<easyPoints.length;i++) {
        let prevIndex = (i-1+easyPoints.length)%easyPoints.length
        let angleRad = easyPoints[i].angle * (Math.PI / 180);
        let prevAngleRad = easyPoints[prevIndex].angle * (Math.PI / 180);
        let cp1x = easyPoints[prevIndex].x + Math.cos(prevAngleRad) * easyPoints[prevIndex].bez1;
        let cp1y = easyPoints[prevIndex].y + Math.sin(prevAngleRad) * easyPoints[prevIndex].bez1;
        let cp2x = easyPoints[i].x + Math.cos(angleRad + Math.PI) * easyPoints[i].bez2;
        let cp2y = easyPoints[i].y + Math.sin(angleRad + Math.PI) * easyPoints[i].bez2;
        actualCoords.push([cp1x, cp1y, cp2x, cp2y, easyPoints[i].x, easyPoints[i].y]);
      }
      p.background(bgColor);
      p.noFill()
      p.strokeCap(p.SQUARE)
  
      for (let i=0; i<groups.length; i++) {
        for (let j=0;j<easyPoints.length;j++) {
          if (easyPoints[j].grp == groups[i]) {
            p.stroke(strokeColor)
            p.strokeWeight(strokeWeightt)
            drawSegment(j)
            p.stroke(bgColor)
            p.strokeWeight(strokeWeightt*.55)
            drawSegment(j)
          }
        }
      }
  
      if(vertexControls) {
        for(let i=0;i<actualCoords.length;i++) {
          let prevIndex = (i-1+actualCoords.length)%actualCoords.length
          let nextIndex = (i+1)%actualCoords.length
          p.noFill();
          p.stroke(250, 0, 0);
          p.strokeWeight(.5);
          p.noStroke()
          p.fill(100);
          if (easyPoints[i].isMain) {
            p.fill(255,0,0);
          }
          p.circle(actualCoords[i][4], actualCoords[i][5], 6);
        }
      }
      p.noFill()
      p.stroke(0)
    }
  
    function shuffle(array) {
      let currentIndex = array.length, randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    }
  
    function drawSegment(i) {
      let prevIndex = (i-1+easyPoints.length)%easyPoints.length
      p.beginShape();
      p.vertex(easyPoints[prevIndex].x, easyPoints[prevIndex].y);
      p.bezierVertex(actualCoords[i][0], actualCoords[i][1], actualCoords[i][2], actualCoords[i][3], actualCoords[i][4], actualCoords[i][5]);
      p.endShape();
    }
  
    function getMain(grp) {
      for (let i=0; i<easyPoints.length; i++) {
        if (easyPoints[i].isMain && easyPoints[i].grp == grp) {
          return i
        }
      }
    }
  
    function executeMove(idx) {
        tick = (tick<0) ? 0 : tick
      if (tick < groups.length) {
        let pointIndex
        for(let i=0;i<easyPoints.length;i++) {
          if(easyPoints[i].grp == groups[tick] && easyPoints[i].isMain) {
            pointIndex = i
          }
        }
        if (!easyPoints[pointIndex].processed) {
          let tm1 = (pointIndex + easyPoints.length - 1) % easyPoints.length;
          let tp1 = (pointIndex + 1) % easyPoints.length;
          moves[idx](pointIndex, tm1, tp1);
          easyPoints[pointIndex].processed = true;
          easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));
          moveList.push(idx)
          tick++;
        }
      }
    }
  
    function executeSubMove(idx) {
      let subMoveOptions = []
      for (let i=0;i<easyPoints.length;i++){
        if (easyPoints[i].subMoves.includes(idx)) {
          subMoveOptions.push(i)
        }
      } if(subMoveOptions.length>0) {
        let pointIndex = subMoveOptions[subMoveOptions.length-1]
        let tm1 = (pointIndex + easyPoints.length - 1) % easyPoints.length;
        let tp1 = (pointIndex + 1) % easyPoints.length;
        subMoves[idx](pointIndex, tm1, tp1);
        easyPoints[pointIndex].subMoves = []
        easyPointsHistory.push(JSON.parse(JSON.stringify(easyPoints)));
        moveList.push(idx)
      }
    }
  
    function undo() {
      if (moveList.length > 0) {
        tick --
        for (let i = 0; i < easyPoints.length; i++) {
          easyPoints[i].targetx = easyPointsHistory[easyPointsHistory.length-1][i].targetx;
          easyPoints[i].targety = easyPointsHistory[easyPointsHistory.length-1][i].targety;
          easyPoints[i].targetangle = easyPointsHistory[easyPointsHistory.length-1][i].targetangle;
          easyPoints[i].targetbez1 = easyPointsHistory[easyPointsHistory.length-1][i].targetbez1;
          easyPoints[i].targetbez2 = easyPointsHistory[easyPointsHistory.length-1][i].targetbez2;
          easyPoints[i].subMoves = easyPointsHistory[easyPointsHistory.length-1][i].subMoves;
          easyPoints[i].processed = false;
          easyPoints[i].step = 0
        }
        moveList.pop();
        console.log(moveList.length)
      }
    }
  
    function subdivideBezier(shape, idx1, t) {
      let idx2 = (idx1+1)%shape.length
      let idx2s = (idx1+1)%(shape.length+1)
  
      let a = p.createVector(shape[idx1].targetx, shape[idx1].targety)
      let angleRad = (shape[idx1].targetangle) * (Math.PI / 180);
      let t_cp2x = shape[idx1].targetx + p.cos(angleRad) * shape[idx1].targetbez1;
      let t_cp2y = shape[idx1].targety + p.sin(angleRad) * shape[idx1].targetbez1;
      let c1 = p.createVector(t_cp2x, t_cp2y)
      let angleRad2 = shape[idx2].targetangle * (Math.PI / 180);
      let t_cp1x = shape[idx2].targetx + p.cos(angleRad2 + Math.PI) * shape[idx2].targetbez2;
      let t_cp1y = shape[idx2].targety + p.sin(angleRad2 + Math.PI) * shape[idx2].targetbez2;
      let c2 = p.createVector(t_cp1x, t_cp1y)
      let b = p.createVector(shape[idx2].targetx, shape[idx2].targety)
  
      let ac1 = p5.Vector.lerp(a, c1, t);
      let bz = p5.Vector.lerp(c1, c2, t);
      let bc2 = p5.Vector.lerp(c2, b, t);
      let ac2 = p5.Vector.lerp(ac1, bz, t);
      let bc1 = p5.Vector.lerp(bz, bc2, t);
      let newLoc = p5.Vector.lerp(ac2, bc1, t);
  
      test=[a.x, a.y, c1.x, c1.y, c2.x, c2.y, b.x, b.y]
      test2=[a.x, a.y, ac1.x, ac1.y, ac2.x, ac2.y, newLoc.x, newLoc.y]
  
      let angleRadians = p.atan2(ac2.y - newLoc.y, ac2.x - newLoc.x);
      let angleDegrees = p.degrees(angleRadians);
      let bez1 = p.dist(newLoc.x, newLoc.y, ac2.x, ac2.y)
      let bez2 = p.dist(newLoc.x, newLoc.y, bc1.x, bc1.y)
  
      let newVert = {
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
      shape[idx1].bez1 = bez1
      shape[idx1].targetbez1 = bez1
  
      angleRadians = p.atan2(bc2.y - shape[idx2].targety, bc2.x - shape[idx2].targetx);
      angleDegrees = p.degrees(angleRadians);
      bez2 = p.dist(shape[idx2].targetx, shape[idx2].targety, bc2.x, bc2.y)
      shape[idx2].bez2 = bez2
      shape[idx2].targetbez2 = bez2
  
      shape.splice(idx2s, 0, newVert);
    }
  
    let moves = {
      simplePull: function(tick, tm1, tp1) {
        let distance = p.width*p.random(.8,.95)
        let angle = p.random(-180/(numSides*4), 180/(numSides*4))
        moveRel2Center(tick, distance, angle)
        let bez = p.random(p.width/12, p.width/2)
        easyPoints[tick].targetbez1 += bez;
        easyPoints[tick].targetbez2 += bez;
  
        easyPoints[tm1].targetbez1 += p.width/7;
        easyPoints[tp1].targetbez2 += p.width/7;
  
        easyPoints[tick].subMoves = ["twist","bigTwist"]
      }, 
  
      innerLoop: function(tick, tm1, tp1) {
        let distance = p.width*p.random(.76,.95)
        let angle = p.random(-180/(numSides*4), 180/(numSides*4))
        moveRel2Center(tick, distance, angle)
        easyPoints[tick].targetangle += 180;
        easyPoints[tick].targetbez1 += Math.pow(distance,1.2) /7;
        easyPoints[tick].targetbez2 += Math.pow(distance,1.2) /7;
  
        easyPoints[tm1].targetbez1 += p.width/7;
        easyPoints[tp1].targetbez2 += p.width/7;
  
        easyPoints[tick].subMoves = ["addLoop"]
      }, 
  
      bigInnerLoop: function(tick, tm1, tp1) {
        let distance = p.width*p.random(.4,.6)
        moveRel2Center(tick, distance, 0)
        easyPoints[tick].targetangle += 180;
        easyPoints[tick].targetbez1 += p.width/3;
        easyPoints[tick].targetbez2 += p.width/3;
  
        easyPoints[tm1].targetbez1 += p.width/3;
        easyPoints[tp1].targetbez2 += p.width/3;
  
        easyPoints[tick].subMoves = ["addLoop"]
      }, 
    }
  
    let subMoves = {
      twist: function(i, tm1, tp1) {
        easyPoints[i].targetangle += 180;
      }, 
      bigTwist: function(i, tm1, tp1) {
        easyPoints[i].targetangle += 180;
  
        easyPoints[i].targetbez1 += p.width/4;
        easyPoints[i].targetbez2 += p.width/4;
  
        easyPoints[tm1].targetbez1 += p.width/4;
        easyPoints[tp1].targetbez2 += p.width/4;
      },
  
      addLoop: function(i, tm1, tp1) {
        subdivideHistory(i, .5)
        subdivideHistory(i, .9)
        subdivideHistory(i, .8)
        moveRel2Main(i+2, p.width/2, 0)
        easyPoints[i+2].targetangle+=180
        easyPoints[i+2].targetbez1+=p.width/10
        easyPoints[i+2].targetbez2+=p.width/10
        
        easyPoints[i+1].targetbez1+=p.width/4
        easyPoints[i+3].targetbez2+=p.width/4
      },
    }
  
    function moveRel2Center(which, dist, angleOffset) {
      let dx = center.x - easyPoints[which].x;
      let dy = center.y - easyPoints[which].y;
      let angle = Math.atan2(dy, dx);
      angle = angle * (180/p.PI)
      angle += angleOffset;
      angle = angle * (p.PI/180)
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
      let moveAngle = p.radians(main.angle + angleOffset);
      let newX = easyPoints[which].x + dist * p.cos(moveAngle);
      let newY = easyPoints[which].y + dist * p.sin(moveAngle);
      easyPoints[which].targetx = newX;
      easyPoints[which].targety = newY;
    }
  
    function fullTangle() {
      numTangles = Math.min(Math.max(4, numSides - Math.floor(p.random(3))), 4)
      for(let i=0; i<numTangles; i++) {
        randomMove()
      }
      console.log(numTangles, moveList.length)
      putInPlace();
    }
  
    function randomMove() {
      let keys = Object.keys(moves);
      let randomKey;
      if (easyPoints[getMain(groups[Math.abs(tick-1)])].subMoves.length>0 && p.random()>.33){
        subMove = p.random(easyPoints[getMain(groups[tick-1])].subMoves)
        console.log("submove",subMove)
        executeSubMove(subMove)
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
      for(let i = 0; i<easyPointsHistory.length; i++) {
        subdivideBezier(easyPointsHistory[i], which, t)
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
  
    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
  
    createButtonsForMoves = function(p) {
      const container = document.getElementById('easyUnknotControls');
      // let index = 0
    //   vertexControlsButton = p.createButton('show/hide vertices');
    //   vertexControlsButton.parent('main-controls');
    //   vertexControlsButton.mousePressed(function() {
    //     vertexControls = !vertexControls;
    //   });
        let rule = document.createElement('div')
        rule.classList.add('horiz-rule')
        container.appendChild(rule);

        container.appendChild(document.createElement('br'));
        let label = document.createElement('div');
        label.className = 'moves';
        label.style.marginTop = "-2px"
        label.appendChild(document.createTextNode('Moves:'));
        container.appendChild(label);
        container.appendChild(document.createElement('br'));

      for (let key in moves) {
        let button = document.createElement('button');
        button.textContent = key; // Set button text as the function key
        button.classList.add("moves-button")
        button.onclick = function() { executeMove(key); }; // Set click handler
        container.appendChild(button); // Append the button to the container
        // index ++
      }
    
      container.appendChild(document.createElement('br'));
        label = document.createElement('div');
        label.className = 'moves';
        label.appendChild(document.createTextNode('Sub-moves:'));
        container.appendChild(label);
        container.appendChild(document.createElement('br'));
    
      for (let key in subMoves) {
        let button = document.createElement('button');
        button.textContent = key; // Set button text as the function key
        button.classList.add("moves-button")
        button.onclick = function() { executeSubMove(key, p); }; // Set click handler
        container.appendChild(button); // Append the button to the container
        // index ++
      }
      container.appendChild(document.createElement('br'));
      container.appendChild(document.createElement('br'));
      
      let randomButton = document.createElement('button');
      randomButton.classList.add("moves-button")
      randomButton.textContent = "random move"; // Set button text as the function key
      randomButton.onclick = function() { randomMove(p); }; // Set click handler
      container.appendChild(randomButton); // Append the button to the container
      // create undo button
      let button = document.createElement('button');
      button.classList.add("moves-button")
      button.id = "undo-button"
      button.textContent = "unravel"; // Set button text as the function key
      button.onclick = function() { undo(); }; // Set click handler
      container.appendChild(button); // Append the button to the container
    
    //   let fullTangleButton = document.createElement('button');
    //   fullTangleButton.classList = "topMarginButton"
    //   fullTangleButton.textContent = "generate unknot"; // Set button text as the function key
    //   fullTangleButton.onclick = function() { fullTangle(p); }; // Set click handler
    //   container.appendChild(fullTangleButton); // Append the button to the container
    }
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
  };  