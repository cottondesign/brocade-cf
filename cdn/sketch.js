

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


let debugging = false
let vertexControls = debugging ? true : false;
let speedLimit = debugging ? .3 : 0.15;
let easingFactor = .2


let strokeColor = "#F5F2E1"
let moveList = []
let colorthis = []
let targetProgress = 0
let progress = 0
let localT = 0
let nextInterval, passedIntervals, passedIntEZ, remainingIntervals, interval, scrollHeight
let mode = "full"
let numTangles
let randPts = []
let originalLocations = []; // To store the original locations
let canvasSize
let heightChg = .85


//for test #2
let colors = []
let yes=0


let scrollContent = document.getElementById("scroll-content") 
for (let i=0;i<250;i++) {
  scrollContent.innerHTML += "&#8595; &#8595; &#8595; <br>"
}



let culprit = [
  // --------------------------------------------------------------------culprit 1
  [
    [ //0 copy of first state to prevent bug
      {segment: [2.40705,50.6528,57.324,-4.38674,80.7222,21.95],
        zIndex: 1},
      {segment: [86.5778,28.5434,81.954,57.2796,57.3115,78.176],
        zIndex: 2},
      {segment: [49.995,84.3813,27.5811,92.136,19.11,78.1769],
        zIndex: 0}
    ],
    [ //0
      {segment: [2.40705,50.6528,57.324,-4.38674,80.7222,21.95],
        zIndex: 1},
      {segment: [86.5778,28.5434,81.954,57.2796,57.3115,78.176],
        zIndex: 2},
      {segment: [49.995,84.3813,27.5811,92.136,19.11,78.1769],
        zIndex: 0}
    ],
    [ //0+
      {segment: [-3.24488,55.0074,57.324,-4.38677,80.7223,21.952],
        zIndex: 0},
      {segment: [91,33.5213,87.2967,49.434,80.7223,60],
        zIndex: 2},
      {segment: [74.5,70,58.9325,80.5159,50.5,82.5],
        zIndex: 3},
      {segment: [42,84.5,27,86.3542,19.1101,78.1769],
        zIndex: 2}
    ],
    [ //1
      {segment: [57.3239,-4.38677,-4.86758,56.691,19.11,78.1768],
        zIndex: 0},
      {segment: [39,95.9999,69.6266,63.5,85,73.5],
        zIndex: 2},
      {segment: [101.659,84.336,67.3878,104.298,65.5,85],
        zIndex: 3},
      {segment: [63.8332,67.9615,94.5345,37.5,80.7222,21.9519],
        zIndex: 2}
    ]
    ,[ //1+
      {segment: [57.3239,-4.38677,-4.86758,56.691,19.11,78.1768],
        zIndex: 2},
      {segment: [39,95.9999,69.6266,63.5,85,73.5],
        zIndex: 0},
      {segment: [90.2738,76.9304,90.4433,81.2755,88.1519,85],
        zIndex: 5},
      {segment: [83.2052,93.0402,66.7901,98.1883,65.5,85],
        zIndex: 3},
      {segment: [64.8112,77.959,69.6499,68.6258,74.5905,59],
        zIndex: 4},
      {segment: [81.6058,45.3324,88.8267,31.0749,80.7222,21.9519],
        zIndex: 1}
    ]
    ,[ //2
      {segment: [60,-1.5,-11.5,69,34.5,81.0002],
        zIndex: 2},
      {segment: [46.233,84.061,52.0662,76.585,55.5595,65.5],
        zIndex: 0},
      {segment: [62.4869,43.518,60.2131,7.34374,76.5,11],
        zIndex: 5},
      {segment: [101,16.5,84.8897,85.0001,65.5,85.0001],
        zIndex: 3},
      {segment: [54,85.0001,41.5,74.5,43.5,65.5],
        zIndex: 4},
      {segment: [47.362,48.121,83.9753,40.6385,76.5,27.5],
        zIndex: 1}
    ]  
    ,[ //2+
      {segment: [60,-1.5,-11.5,69,34.5,81.0002],
        zIndex: 2},
      {segment: [46.233,84.061,52.0662,76.585,55.5595,65.5],
        zIndex: 8},
      {segment: [57.6686,58.8074,58.9248,50.7991,60.1116,43],
        zIndex: 0},
      {segment: [60.6045,39.7609,61.0854,36.5578,61.6105,33.5],
        zIndex: 1},
      {segment: [62.035,31.0284,62.4882,28.6517,63,26.4276],
        zIndex: 7},
      {segment: [65.3377,16.2681,68.896,9.29296,76.5,11],
        zIndex: 6},
      {segment: [101,16.5,84.8897,85.0001,65.5,85.0001],
        zIndex: 3},
      {segment: [54,85.0001,41.5,74.5,43.5,65.5],
        zIndex: 4},
      {segment: [47.362,48.121,83.9753,40.6385,76.5,27.5],
        zIndex: 5}
    ]
    ,[ //3
      {segment: [60,-1.49994,-11.5,69,34.5,81.0002],
        zIndex: 5},
      {segment: [46.233,84.0611,52.0662,76.5851,55.5595,65.5001],
        zIndex: 2},
      {segment: [58.3958,56.5,47.2688,44.5697,55,43.0001],
        zIndex: 8},
      {segment: [62.3884,41.5001,77.5,56,81.5,47],
        zIndex: 0},
      {segment: [85.2937,38.4642,67.5,33.5,63,26.4276],
        zIndex: 1},
      {segment: [57.4036,17.6322,68.896,9.29302,76.5,11.0001],
        zIndex: 7},
      {segment: [101,16.5001,84.8897,85.0002,65.5,85.0002],
        zIndex: 6},
      {segment: [54,85.0002,41.5,74.5001,43.5,65.5001],
        zIndex: 3},
      {segment: [47.362,48.1211,83.9753,40.6385,76.5,27.5001],
        zIndex: 4} 
    ]
    ,[ //3+
      {segment: [60,-1.49994,-11.5,69,34.5,81.0002],
        zIndex: 0},
      {segment: [46.233,84.0611,52.0662,76.5851,55.5595,65.5001],
        zIndex: 1},
      {segment: [58.3958,56.5,47.2688,44.5697,55,43.0001],
        zIndex: 2},
      {segment: [58.9274,42.2027,65.037,45.9263,70.5,48.238],
        zIndex: 3},
      {segment: [75.3142,50.2752,79.6262,51.2159,81.5,47],
        zIndex: 4},
      {segment: [82.8359,43.9942,81.4949,41.4312,79,39.0631],
        zIndex: 5},
      {segment: [74.4102,34.7065,65.9153,31.0095,63,26.4276],
        zIndex: 6},
      {segment: [57.4036,17.6322,68.896,9.29302,76.5,11.0001],
        zIndex: 7},
      {segment: [101,16.5001,84.8897,85.0002,65.5,85.0002],
        zIndex: 8},
      {segment: [54,85.0002,41.5,74.5001,43.5,65.5001],
        zIndex: 9},
      {segment: [47.362,48.1211,83.9753,40.6385,76.5,27.5001],
        zIndex: 10}
    ]
    ,[ //4
      {segment: [53.5,-2.57229,-11.5,69.0001,34.5,81.0003],
        zIndex: 5},
      {segment: [46.2331,84.0611,52.0662,76.5852,55.5595,65.5001],
        zIndex: 3},
      {segment: [58.3958,56.5001,47.2688,44.5697,55,43.0001],
        zIndex: 8},
      {segment: [62.7312,41.4305,66.5015,49.7621,67,55.0001],
        zIndex: 1},
      {segment: [68.5,70.7621,97,88.5,97,43.0001],
        zIndex: 10},
      {segment: [97,-4.5,48,-10.5,78.5,27.5],
        zIndex: 9},
      {segment: [85.2004,35.848,70,45,63,26.4277],
        zIndex: 0},
      {segment: [59.3233,16.6726,68.896,9.29308,76.5,11.0001],
        zIndex: 6},
      {segment: [101,16.5002,84.8897,85.0002,65.5,85.0002],
        zIndex: 7},
      {segment: [54,85.0002,41.5,74.5001,43.5,65.5001],
        zIndex: 4},
      {segment: [47.362,48.1211,77.4753,39.5662,70,26.4277],
        zIndex: 2}
    ]
    ,[ //4+
    {segment: [53.5,-2.57229,-11.5,69.0001,34.5,81.0003],
      zIndex: 7},
    {segment: [46.2331,84.0611,52.0662,76.5852,55.5595,65.5001],
      zIndex: 5},
    {segment: [58.3958,56.5001,47.2688,44.5697,55,43.0001],
      zIndex: 9},
    {segment: [62.7312,41.4305,66.5015,49.7621,67,55.0001],
      zIndex: 3},
    {segment: [68.0175,65.6917,81.4581,77.2925,90,69.449],
      zIndex: 11},
    {segment: [94.0509,65.7293,97,57.6366,97,43.0001],
      zIndex: 0},
    {segment: [97,8.10158,70.5503,-4.39559,68.6122,6.5],
      zIndex: 1},
    {segment: [67.9123,10.4343,70.4085,17.4187,78.5,27.5],
      zIndex: 9},
    {segment: [85.2004,35.848,70,45,63,26.4277],
      zIndex: 2},
    {segment: [59.3233,16.6726,68.896,9.29308,76.5,11.0001],
      zIndex: 8},
    {segment: [101,16.5002,84.8897,85.0002,65.5,85.0002],
      zIndex: 10},
    {segment: [54,85.0002,41.5,74.5001,43.5,65.5001],
      zIndex: 6},
    {segment: [47.362,48.1211,77.4753,39.5662,70,26.4277],
      zIndex: 4}
  ]  
  ,[ //5
    {segment: [53.5,-2.57232,-11.5,69,34.5,81.0002],
      zIndex: 7},
    {segment: [46.233,84.0611,52.0662,76.5851,55.5595,65.5001],
      zIndex: 5},
    {segment: [58.3958,56.5,47.2688,44.5697,55,43.0001],
      zIndex: 9},
    {segment: [62.7312,41.4305,66.5015,49.7621,67,55],
      zIndex: 3},
    {segment: [68.0175,65.6917,83.8253,79.2652,90,69.4489],
      zIndex: 11},
    {segment: [95,61.5,72.5462,45.8134,60.5,37.4999],
      zIndex: 0},
    {segment: [25,13.0001,46.5,6.00018,58.5,11.0002],
      zIndex: 1},
    {segment: [64.5,13.5001,70.4085,17.4187,78.5,27.4999],
      zIndex: 9},
    {segment: [85.2004,35.848,70,45,63,26.4277],
      zIndex: 2},
    {segment: [59.3233,16.6726,68.8959,9.29305,76.5,11.0001],
      zIndex: 8},
    {segment: [101,16.5001,84.8897,85.0001,65.5,85.0001],
      zIndex: 10},
    {segment: [54,85.0001,41.5,74.5001,43.5,65.5001],
      zIndex: 6},
    {segment: [47.362,48.1211,77.4753,39.5661,70,26.4277],
      zIndex: 4}
  ]

    // ,[
    //   {segment: ,
    //     zIndex: },
    //   {segment: ,
    //     zIndex: },
    //   {segment: ,
    //     zIndex: },
    //   {segment: ,
    //     zIndex: },
    // ]
  ]
]









function createTracker(obj, key) {
  return new Proxy(obj, {
    set(target, property, value) {
      if (property === key) {
        console.log(`Value changed to ${value}`);
      }
      target[property] = value;
      return true;
    }
  });
}





let mainSketch = function(p) {

  p.mouseClicked = function() {
    console.log("clicked: ", p.mouseX, p.mouseY)
  }

  p.setup = function() {
    //for test #2
    for(let i=0;i<numSides;i++) {
      colors.push([p.random(255),p.random(255),p.random(255)])
    }

    for(let i=0;i<20;i++) {
      colorthis.push([p.random(50,255),p.random(50,255),p.random(50,255)])
    }

    function randRelChg(xRand, yRand, indices, low, hi, rel) {
      let change
      if (rel == "yDir") {
        change = p.map(yRand, indices.yBoundLow, indices.yBoundHi, low, hi)
      } else if (rel == "yInv") {
        change = p.map(yRand, indices.yBoundHi, indices.yBoundLow, low, hi)
      } else if (rel == "xDir") {
        change = p.map(xRand, indices.xBoundLow, indices.xBoundHi, low, hi)
      } else if (rel == "xInv") {
        change = p.map(xRand, indices.xBoundHi, indices.xBoundLow, low, hi)
      } else if (!rel) {
        change = p.random(low, hi)
      }
      return change
    }


    canvasSize = (p.windowWidth > 1000) ? 1000 : p.windowWidth
    canvas = p.createCanvas(canvasSize, canvasSize)
    canvas.style("-webkit-filter", `url("#svgfilter")`).style("filter", `url("#svgfilter")`);
    canvas.style('position', 'absolute');
    canvas.parent('sketch-holder');
    center = {x:p.width/2, y:p.height/2}
    p.width *= .6
    p.height *= heightChg
    p.noFill();
    p.frameRate(10);
    cursor = p.loadImage("cursor.png")
    vertexControlsButton = p.createButton('show/hide debug info');
    vertexControlsButton.parent('buttons-container');
    vertexControlsButton.mousePressed(function() {
      vertexControls = !vertexControls;
    });
    // document.getElementById("sides").innerHTML += numSides
    let randCulprit = p.random(culprit)
    for(let i=0;i<randCulprit.length;i++) {
      easyPointsHistory.push([])
      for(let j=0;j<randCulprit[i].length;j++) {
        let scale = p.height/100
        let segment = randCulprit[i][j].segment
        let nextIndex = (j+1) % randCulprit[i].length
        let nextSegment = randCulprit[i][nextIndex].segment
    
        let angleRadians = p.atan2(segment[3]*scale - segment[5]*scale, segment[2]*scale - segment[4]*scale);
        let angleDegrees = p.degrees(angleRadians);
        let bez1 = p.dist(segment[4]*scale, segment[5]*scale, segment[2]*scale, segment[3]*scale)
        let bez2 = p.dist(segment[4]*scale, segment[5]*scale, nextSegment[0]*scale, nextSegment[1]*scale)
    
        newVert = {
          x: segment[4]*scale + (1-heightChg)*canvasSize/2,
          y: segment[5]*scale + (1-heightChg)*canvasSize/2,
          angle: angleDegrees+180,
          bez1: bez2,
          bez2: bez1,
        
          targetx: segment[4]*scale + (1-heightChg)*canvasSize/2,
          targety: segment[5]*scale + (1-heightChg)*canvasSize/2,
          targetangle: angleDegrees+180,
          targetbez1: bez2,
          targetbez2: bez1,
        
          step: 0,
          // isMain: false,
          // grp: shape[idx1].grp,
          // subMoves: [],
          zIndex: randCulprit[i][j].zIndex
        }
        
        easyPointsHistory[i].push(newVert);
      }
    }
    easyPointsHistory.push(JSON.parse(JSON.stringify(easyPointsHistory[easyPointsHistory.length-1])));
    // easyPoints = easyPointsHistory[easyPointsHistory.length-1]

    numTangles = Math.floor(randCulprit.length/2)-1

    for (let i = 0; i < easyPointsHistory.length; i++) {
      originalLocations.push([]);
      for (let j = 0; j < easyPointsHistory[i].length; j++) {
          originalLocations[i].push({
              x: easyPointsHistory[i][j].x,
              y: easyPointsHistory[i][j].y
          });
        }
    }

    // easyPointsHistory[11][11] = createTracker(easyPointsHistory[11][11], "targety")


    // hard-coded fixes
    easyPointsHistory[4][1].targetangle += 360
    // easyPointsHistory[10][5].targetx += p.height*.1
    // easyPointsHistory[9][4].targetx += p.height*.1


    // random positioning of select vertices
    randPts = [
      {stage:11,point:12, xBoundLow: -p.height*.2, xBoundHi: -p.height*.02, yBoundLow: -p.height*.06, yBoundHi: p.height*.06,
        partnerPoint: 8, onlyOne: true,
        bez2Hi: p.height*.2, bez2Low: -p.height*.01, bez2Rel: "xInv",
        otherPt1: 2, thisState1: "yLow", otherState1: "xHi", otherMoveMax1: -p.height*.1, otherPt1Which: "targetx"

      },
      {stage:11,point:11, xBoundLow: -p.height*.01, xBoundHi: p.height*.06, yBoundLow: -p.height*.2, yBoundHi: p.height*.06, onlyOne: true,
        angleLow: -30, angleHi: 100, angleRel: "yInv",
        bez2Hi: p.height*.02, bez2Low: -p.height*.001, bez2Rel: "yInv",
        // roundOut: "next", roundDist: p.height*.3, bezAdjust: .25,
        otherPt1: 10, thisState1: "yHi", otherState1: "yLow", otherMoveMax1: -p.height*.2, otherPt1Which: "targetbez1"
      },
      {stage:11,point:10, xBoundLow: -p.height*.06, xBoundHi: p.height*.06, yBoundLow: -p.height*.13, yBoundHi: p.height*.06,  //WORK HERE
        bez1Hi: p.height*.1, bez1Low: -p.height*.01, bez1Rel: "yInv",
        bez2Hi: p.height*.4, bez2Low: -p.height*.01, bez2Rel: "yInv",
        angleLow: -10, angleHi: -1, angleRel: "xDir",
        roundOut: "next", roundRel: "yInv", roundMin: -p.height*.1, roundMax: p.height*.04,
        otherPt1: 4, otherPt1Rel: "yDir", otherPt1Which: "targety", otherPt1Low: -p.height*.1, otherPt1Hi: p.height*.01,
      },
      {stage:11,point:9, xBoundLow: -p.height*.001, xBoundHi: p.height*.06, yBoundLow: -p.height*.02, yBoundHi: p.height*.06},
      {stage:11,point:7, xBoundLow: -p.height*.1, xBoundHi: p.height*0.01, yBoundLow: -p.height*.1, yBoundHi: p.height*0.01, onlyOne: true,
        // bez1Hi: p.height*.2, bez1Low: p.height*.01, bez2Hi: p.height*.2, bez2Low: p.height*.01
        otherPt1: 8, thisState1: "xHi", otherState1: "xLow", otherMoveMax1: p.height*.9, otherPt1Which: "targetbez1"
      },
      {stage:11,point:8, onlyOne: true,
        // bez1Hi: p.height*.2, bez1Low: p.height*.01, bez2Hi: p.height*.2, bez2Low: p.height*.01,
        otherPt1: 7, thisState1: "xLow", otherState1: "xHi", otherMoveMax1: p.height*.9, otherPt1Which: "targetbe21"
      },
      {stage:11,point:6, xBoundLow: -p.height*.3, xBoundHi: -p.height*.1, yBoundLow: -p.height*.06, yBoundHi: -p.height*.03,
        bez1Hi: p.height*.2, bez1Low: p.height*.03, bez1Rel: "xInv",
        bez2Hi: p.height*.2, bez2Low: -p.height*.03, bez2Rel: "xInv",
        angleLow: -60, angleHi: -30, angleRel: "xDir",
        // roundOut: "prev", roundRel: "xInv", roundMin: -p.height*.1, roundMax: p.height*.1,
        // otherPt1: 5, thisState1: "xHi", otherState1: "xLow", otherMoveMax1: p.height*.4, otherPt1Which: "targetbez1"
      },
      {stage:11,point:5, xBoundLow: -p.height*.30, xBoundHi: p.height*.20, yBoundLow: -p.height*.02, yBoundHi: p.height*.20,
        bez1Hi: -p.height*.1, bez1Low: -p.height*.3, bez1Rel: "xDir",
      },
      {stage:11,point:4, xBoundLow: -p.height*.02, xBoundHi: p.height*.02, yBoundLow: p.height*.08, yBoundHi: p.height*.23, onlyOne: true,
        bez1Hi: p.height*.2, bez1Low: -p.height*.01, bez1Rel: "yInv",
      },
      {stage:11,point:3, xBoundLow: -p.height*.02, xBoundHi: p.height*.02, yBoundLow: -p.height*.1, yBoundHi: p.height*.15},
      {stage:11,point:2, xBoundLow: -p.height*.1, xBoundHi: p.height*0.01, yBoundLow: -p.height*.1, yBoundHi: p.height*0.01,
        bez1Hi: p.height*.1, bez1Low: -p.height*.01, bez1Rel: "xInv",
        bez2Hi: p.height*.07, bez2Low: -p.height*.01, bez2Rel: "xDir",
        angleLow: -40, angleHi: 20, angleRel: "xDir",
        onlyOne: true
      },
      {stage:11, point:1, 
        otherPt1: 0, thisState1: "xHi", otherState1: "xHi", otherMoveMax1: p.height*.9, otherPt1Which: "targetbez1"  //not working
      },
      {stage:11, point:0, xBoundLow: -p.height*.2, xBoundHi: p.height*.02, yBoundLow: -p.height*.3, yBoundHi: p.height*.01,
        bez2Hi: p.height*.05, bez2Low: -p.height*.2, bez2Rel: "yDir",
        bez1Hi: p.height*.3, bez1Low: -p.height*.08, bez1Rel: "xInv",
        angleLow: -30, angleHi: 90, angleRel: "yInv",
        otherPt1: 11, thisState1: "yLow", otherState1: "yHi", otherMoveMax1: -p.height*.1, otherPt1Which: "targety"
      },
      {stage:9,point:9, xBoundLow: -p.height*.01, xBoundHi: p.height*.06, yBoundLow: -p.height*.1, yBoundHi: p.height*.06, onlyOne: true,
        angleLow: -30, angleHi: 50, angleRel: "yInv",
        roundOut: "next", roundDist: p.height*.3, bezAdjust: .25
      },
      {stage:9,point:7, xBoundLow: -p.height*.08, xBoundHi: p.height*0.01, yBoundLow: -p.height*.03, yBoundHi: p.height*0.05, onlyOne: true,
        // bez1Hi: p.height*.2, bez1Low: p.height*.01, bez2Hi: p.height*.2, bez2Low: p.height*.01
      },
      {stage:9,point:2, xBoundLow: -p.height*.1, xBoundHi: p.height*0.01, yBoundLow: -p.height*.1, yBoundHi: p.height*0.01,
        bez1Hi: p.height*.1, bez1Low: -p.height*.01, bez1Rel: "xInv",
        bez2Hi: p.height*.07, bez2Low: -p.height*.01, bez2Rel: "xDir",
        angleLow: -60, angleHi: 20, angleRel: "xDir",
        onlyOne: true
      },
      {stage:7, point:1, xBoundLow: -p.height*.05, xBoundHi: p.height*.06, yBoundLow: -p.height*.06, yBoundHi: p.height*.06,
        roundOut: "prev", roundDist: p.height*.2, bezAdjust: .25
      },
      {stage:7, point:8, xBoundLow: -p.height*.03, xBoundHi: p.height*.03, yBoundLow: -p.height*.2, yBoundHi: p.height*.05},
      // {stage:3, point:1, xBoundLow: -p.height*.06, xBoundHi: p.height*.06, yBoundLow: -p.height*.06, yBoundHi: p.height*.06},
      {stage:5, point:5, xBoundLow: -p.height*.002, xBoundHi: p.height*.1, yBoundLow: -p.height*.1, yBoundHi: p.height*.1, onlyOne: true,},
      {stage:3, point:0, xBoundLow: -p.height*.1, xBoundHi: p.height*.4, yBoundLow: -p.height*.2, yBoundHi: p.height*.1},
      {stage:2, point:0, xBoundLow: -p.height*.3, xBoundHi: p.height*.01, yBoundLow: -p.height*.1, yBoundHi: p.height*.1,
        angleLow: -60, angleHi: 1, angleRel: "xDir"
      },
      // {stage:3, point:3, xBoundLow: -p.height*.2, xBoundHi: p.height*.2, yBoundLow: -p.height*.2, yBoundHi: p.height*.2}
    ]

    // randPts = []

    


    for (let k=0; k< randPts.length; k++) {
      
      let indices = randPts[k]

      // set Rels to false if they dont exist
      if (!indices.hasOwnProperty("bez1Rel")) { 
        indices["bez1Rel"] = false;
      }
      if (!indices.hasOwnProperty("bez2Rel")) { 
        indices["bez2Rel"] = false;
      }
      if (!indices.hasOwnProperty("angleRel")) { 
        indices["angleRel"] = false;
      }

      let pt = {
        x: easyPointsHistory[indices.stage][indices.point].x,
        y: easyPointsHistory[indices.stage][indices.point].y
      }
      let partnerPt = {x:0,y:0}
      if (indices.partnerPoint) {
        partnerPt = {
          x: easyPointsHistory[indices.stage][indices.partnerPoint].x,
          y: easyPointsHistory[indices.stage][indices.partnerPoint].y
        }
      }
      let otherPt1 = {x:0,y:0}
      if (indices.otherPt1) {
        otherPt1 = {
          x: easyPointsHistory[indices.stage][indices.otherPt1].x,
          y: easyPointsHistory[indices.stage][indices.otherPt1].y
        }
      }

      let xRand
      let yRand
      if (indices.xBoundHi) {
        xRand = p.random(indices.xBoundLow, indices.xBoundHi)
        yRand = p.random(indices.yBoundLow, indices.yBoundHi)
      }
      let bez1Rand
      let bez2Rand
      if (indices.bez1Hi) {
        // bez1Rand = p.random(indices.bez1Low, indices.bez1Hi)
        bez1Rand = randRelChg(xRand, yRand, indices, indices.bez1Low, indices.bez1Hi, indices.bez1Rel)

      }
      if (indices.bez2Hi) {
        // bez2Rand = p.random(indices.bez2Low, indices.bez2Hi)
        bez2Rand = randRelChg(xRand, yRand, indices, indices.bez2Low, indices.bez2Hi, indices.bez2Rel)
      }

      let angleChange
      if (indices.angleHi) {
        angleChange = randRelChg(xRand, yRand, indices, indices.angleLow, indices.angleHi, indices.angleRel)
      }

      let bezAdjust
      let whichBez


      let start = indices.stopStage || 0;
      if (indices.onlyOne) {start = indices.stage}
      // console.log("start",start, indices.point)

      // let stop = easyPointsHistory.length - 1
      let stop = indices.onlyOne ? start + 2 : easyPointsHistory.length - 1

      // if (indices.stage == 11 && indices.point == 11) {console.log(length,stop)}
      // if (indices.stage == 9 && indices.point == 9) {console.log(length,stop)}

      for (let i=start; i < stop; i++) {
        if(indices.stage == 11 && indices.point == 11) {
          // console.log("start",start, "stop",stop, i)
          // debugger
        }
        // if (indices.stage == 9 && indices.point == 9) {console.log("9,9",i)}
        // if (indices.stage == 11 && indices.point == 11) {console.log("11,11",i)}
        // if (stop != easyPointsHistory.length-1) {console.log("stop",stop)}

        for (let j=0; j < easyPointsHistory[i].length; j++) {
          // if (p.floor(easyPointsHistory[i][j].x) == p.floor(pt.x) && p.floor(easyPointsHistory[i][j].y) == p.floor(pt.y)) {
          if (easyPointsHistory[i][j].x == pt.x && easyPointsHistory[i][j].y == pt.y || easyPointsHistory[i][j].x == partnerPt.x && easyPointsHistory[i][j].y == partnerPt.y) {
            ppAmt = indices.partnerPointAmt || 1
            // if (i == 11 && j == 11) {
            //   yes +=1
            //   console.log("stage",i,"point",j, "times",yes)
            //   console.log(indices.stage,indices.point)
            //   console.log("low",indices.xBoundLow, "hi", indices.xBoundHi)
            //   console.log("xRand",xRand,"\nyRand",yRand)
            //   console.log("x before",easyPointsHistory[i][j].x)
            // }
            if (indices.xBoundHi) {
              easyPointsHistory[i][j].targetx += xRand * ppAmt
              easyPointsHistory[i][j].targety += yRand * ppAmt
            }
            if (indices.bez1Hi) {
              easyPointsHistory[i][j].targetbez1 += bez1Rand
            }
            if (indices.bez2Hi) {
              easyPointsHistory[i][j].targetbez2 += bez2Rand
            }
            if (indices.angleHi) {
              easyPointsHistory[i][j].targetangle += angleChange
            }
            if (i == 11 && j == 11) {
              console.log("x after",easyPointsHistory[i][j].targetx)
            }
          }
          if (easyPointsHistory[i][j].x == otherPt1.x && easyPointsHistory[i][j].y == otherPt1.y){
            if (indices.otherPt1Hi) {
              let which = indices.otherPt1Which
                switch (indices.otherPt1Rel) {
                  case "yInv":
                    easyPointsHistory[i][j][which] += p.map(yRand, indices.yBoundHi, indices.yBoundLow, indices.otherPt1Low, indices.otherPt1Hi)
                    break;
                  case "xInv":
                    easyPointsHistory[i][j][which] += p.map(xRand, indices.xBoundHi, indices.xBoundLow, indices.otherPt1Low, indices.otherPt1Hi)
                    break;
                  case "yDir":
                    easyPointsHistory[i][j][which] += p.map(yRand, indices.yBoundLow, indices.yBoundHi, indices.otherPt1Low, indices.otherPt1Hi)
                    break;
                  case "xDir":
                    easyPointsHistory[i][j][which] += p.map(xRand, indices.xBoundLow, indices.xBoundHi, indices.otherPt1Low, indices.otherPt1Hi)
                    break;
                
                  // default:
                  //   if (distance < indices.roundDist ) {
                  //     bezAdjust = indices.bezAdjust || .5
                  //     console.log("bezAdjust", j)
                  //     easyPointsHistory[i][j][whichBez] *= bezAdjust
                  //   }
                    break;
                }


              easyPointsHistory[i][indices.otherPt1].targetx += 0 //mapped value either 
              easyPointsHistory[i][indices.otherPt1].targety += 0 
            } 
          }
        }
        for (let j=0; j < easyPointsHistory[i].length; j++) { // looping again to make adjustments after last changes
          if (easyPointsHistory[i][j].x == pt.x && easyPointsHistory[i][j].y == pt.y || easyPointsHistory[i][j].x == partnerPt.x && easyPointsHistory[i][j].y == partnerPt.y) {
            if (indices.roundOut) {
              let prevIndex = (j - 1 + easyPointsHistory[i].length) % easyPointsHistory[i].length;
              let nextIndex = (j + 1) % easyPointsHistory[i].length;
              if (indices.roundOut == "next") {
                target = nextIndex
                whichBez = "targetbez1"
              } else {
                target = prevIndex
                whichBez = "targetbez2"
              }
              distance = p.dist(easyPointsHistory[i][j].targetx, easyPointsHistory[i][j].targety, easyPointsHistory[i][target].targetx, easyPointsHistory[i][target].targety)
              angleDiff = Math.abs(easyPointsHistory[i][j].targetangle-easyPointsHistory[i][target].targetangle)
              // console.log(distance)
              let distanceMovedX = easyPointsHistory[i][target].targetx - originalLocations[i][target].x;
              let distanceMovedY = easyPointsHistory[i][target].targety - originalLocations[i][target].y;
              // console.log("distanceMovedX",distanceMovedX, distanceMovedY)
              bezAdjust = indices.bezAdjust || .5
              //grab xBoundLow, xBoundHi, yBoundLow, yBoundHi from "target"
              switch (indices.roundRel) {
                case "yInv":
                  easyPointsHistory[i][j][whichBez] += p.map(distanceMovedY, p.height*.1, -p.height*.1, indices.roundMin, indices.roundMax)
                  break;
                case "xInv":
                  easyPointsHistory[i][j][whichBez] += p.map(distanceMovedX, p.height*.1, -p.height*.1, indices.roundMin, indices.roundMax)
                  break;
                case "yDir":
                  easyPointsHistory[i][j][whichBez] += p.map(distanceMovedY,-p.height*.1, p.height*.1, indices.roundMin, indices.roundMax)
                  break;
                case "xDir":
                  easyPointsHistory[i][j][whichBez] += p.map(distanceMovedX,-p.height*.1, p.height*.1, indices.roundMin, indices.roundMax)
                  break;
              
                default:
                  if (distance < indices.roundDist ) {
                    bezAdjust = indices.bezAdjust || .5
                    console.log("bezAdjust", j)
                    easyPointsHistory[i][j][whichBez] *= bezAdjust
                  }
                  break;
              }
            }
          }
        }
      }
    }
    // 
    // 
    // 
    // loop thru randPts a second time for corrections
    // 
    // 
    // 
    for (let k=0; k< randPts.length; k++) {
      
      let indices = randPts[k]

      // set Rels to false if they dont exist
      if (!indices.hasOwnProperty("bez1Rel")) { 
        indices["bez1Rel"] = false;
      }
      if (!indices.hasOwnProperty("bez2Rel")) { 
        indices["bez2Rel"] = false;
      }
      if (!indices.hasOwnProperty("angleRel")) { 
        indices["angleRel"] = false;
      }

      let pt = {
        x: easyPointsHistory[indices.stage][indices.point].x,
        y: easyPointsHistory[indices.stage][indices.point].y
      }
      let partnerPt = {x:0,y:0}
      if (indices.partnerPoint) {
        partnerPt = {
          x: easyPointsHistory[indices.stage][indices.partnerPoint].x,
          y: easyPointsHistory[indices.stage][indices.partnerPoint].y
        }
      }
      let otherPt1 = {x:0,y:0}
      if (indices.otherPt1) {
        otherPt1 = {
          x: easyPointsHistory[indices.stage][indices.otherPt1].x,
          y: easyPointsHistory[indices.stage][indices.otherPt1].y
        }
      }

      let xRand
      let yRand
      if (indices.xBoundHi) {
        xRand = p.random(indices.xBoundLow, indices.xBoundHi)
        yRand = p.random(indices.yBoundLow, indices.yBoundHi)
      }
      let bez1Rand
      let bez2Rand
      if (indices.bez1Hi) {
        // bez1Rand = p.random(indices.bez1Low, indices.bez1Hi)
        bez1Rand = randRelChg(xRand, yRand, indices, indices.bez1Low, indices.bez1Hi, indices.bez1Rel)

      }
      if (indices.bez2Hi) {
        // bez2Rand = p.random(indices.bez2Low, indices.bez2Hi)
        bez2Rand = randRelChg(xRand, yRand, indices, indices.bez2Low, indices.bez2Hi, indices.bez2Rel)
      }

      let angleChange
      if (indices.angleHi) {
        angleChange = randRelChg(xRand, yRand, indices, indices.angleLow, indices.angleHi, indices.angleRel)
      }

      let bezAdjust
      let whichBez


      let start = indices.stopStage || 0;
      if (indices.onlyOne) {start = indices.stage}
      // console.log("start",start, indices.point)

      // let stop = easyPointsHistory.length - 1
      let stop = indices.onlyOne ? start + 2 : easyPointsHistory.length - 1

      // if (indices.stage == 11 && indices.point == 11) {console.log(length,stop)}
      // if (indices.stage == 9 && indices.point == 9) {console.log(length,stop)}

      for (let i=start; i < stop; i++) {
        if(indices.stage == 11 && indices.point == 11) {
          // console.log("start",start, "stop",stop, i)
          // debugger
        }
        // if (indices.stage == 9 && indices.point == 9) {console.log("9,9",i)}
        // if (indices.stage == 11 && indices.point == 11) {console.log("11,11",i)}
        // if (stop != easyPointsHistory.length-1) {console.log("stop",stop)}


        for (let j=0; j < easyPointsHistory[i].length; j++) { // looping again to make adjustments after last changes
          if (easyPointsHistory[i][j].x == pt.x && easyPointsHistory[i][j].y == pt.y || easyPointsHistory[i][j].x == partnerPt.x && easyPointsHistory[i][j].y == partnerPt.y) {
            if (indices.otherMoveMax1) {
              let otherPt1Entry = randPts.find(x => x.stage == i && x.point == indices.otherPt1)
              if (otherPt1Entry) {
                // console.log("otherPt1Entry",otherPt1Entry)
                console.log("stage",i,"point",j,"otherPt1",indices.otherPt1)
                //make normalized value of distance moved (0 if not in target direction and axis) for both this point and otherPt1
                // multiply the values together, multiply by otherMoveMax1, and change otherPt1's target attribute by that amount
                // console.log("otherPt1Entry",otherPt1Entry)
                let distanceMovedXo = easyPointsHistory[i][indices.otherPt1].targetx - originalLocations[i][indices.otherPt1].x;
                // console.log("easyPointsHistory[i][indices.otherPt1]",easyPointsHistory[i][indices.otherPt1].targetx, "originalLocations[i][indices.otherPt1]",originalLocations[i][indices.otherPt1].x)
                let distanceMovedYo = easyPointsHistory[i][indices.otherPt1].targety - originalLocations[i][indices.otherPt1].y;
                let distanceMovedX = easyPointsHistory[i][indices.point].targetx - originalLocations[i][indices.point].x;
                let distanceMovedY = easyPointsHistory[i][indices.point].targety - originalLocations[i][indices.point].y;
                // console.log("points",indices.otherPt1, indices.point)
                // console.log("distanceMovedXo",distanceMovedXo, "distanceMovedYo",distanceMovedYo)
                // console.log("distanceMovedX",distanceMovedX, "distanceMovedY",distanceMovedY)
                // console.log("distanceMovedXo",distanceMovedXo, "distanceMovedYo",distanceMovedYo)
                // console.log("distanceMovedX",distanceMovedX, "distanceMovedY",distanceMovedY)
                // otherPt1: 11, thisState1: "yLow", otherState1: "yHi", otherMoveMax1: p.height*.1, otherPt1Which: "targety"
                let valueo //x low, x high, y low, y high
                let valueol
                let value
                let valuel
                let disto
                let dist
                switch (indices.otherState1) {
                  case "yLow":
                    valueo = otherPt1Entry.yBoundLow
                    disto = distanceMovedYo
                    valueol = otherPt1Entry.yBoundHi
                    break;
                  case "yHi":
                    valueo = otherPt1Entry.yBoundHi
                    disto = distanceMovedYo
                    valueol = otherPt1Entry.yBoundLow
                    break;
                  case "xLow":
                    valueo = otherPt1Entry.xBoundLow
                    disto = distanceMovedXo
                    valueol = otherPt1Entry.xBoundHi
                    break;
                  case "xHi":
                    valueo = otherPt1Entry.xBoundHi
                    disto = distanceMovedXo
                    valueol = otherPt1Entry.xBoundLow
                    break;
                }
                switch (indices.thisState1) {
                  case "yLow":
                    value = indices.yBoundLow
                    dist = distanceMovedY
                    valuel = indices.yBoundHi
                    break;
                  case "yHi":
                    value = indices.yBoundHi
                    dist = distanceMovedY
                    valuel = indices.yBoundLow
                    break;
                  case "xLow":
                    value = indices.xBoundLow
                    dist = distanceMovedX
                    valuel = indices.xBoundHi
                    break;
                  case "xHi":
                    value = indices.xBoundHi
                    dist = distanceMovedX
                    valuel = indices.xBoundLow
                    break;
                }
                // console.log("valueo",valueo, "value",value)
                let distanceMovedONorm = p.max(0, p.map(disto, valueol, valueo, -1, 1))
                let distanceMovedNorm = p.max(0, p.map(dist, valuel, value, -1, 1))
                console.log("disto",disto, "dist",dist)
                // HELP HERE: why are these values never both positive?
                console.log(indices.stage,indices.otherPt1,"distanceONorm",distanceMovedONorm, "distanceNorm",distanceMovedNorm)
                let distanceMovedMult = distanceMovedONorm * distanceMovedNorm * indices.otherMoveMax1
                console.log("distanceMovedMult",distanceMovedMult)
                // change otherPt1's target attribute by that distanceMovedMult
                easyPointsHistory[i][indices.otherPt1][indices.otherPt1Which] += distanceMovedMult
              }
            }
          }
        }
      }
    }

    // random rotation
    let angle = debugging ? 0 : p.random(360);
    angle = 0
    let radians = angle * (Math.PI / 180);

    for (let i = 0; i < easyPointsHistory.length-1; i++) { //length-1 because rotation was being applied twice to last item for some reason
      // console.log(radians)
      for (let j = 0; j < easyPointsHistory[i].length; j++) {


        // Get the current target coordinates
        let x = easyPointsHistory[i][j].targetx;
        let y = easyPointsHistory[i][j].targety;


        // Translate point to origin
        let translatedX = x - center.x;
        let translatedY = y - center.y;

        // Rotate point
        // let rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
        // let rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);
        let rotatedX = translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
        let rotatedY = translatedX * Math.sin(radians) + translatedY * Math.cos(radians);

        // Translate point back
        easyPointsHistory[i][j].targetx = rotatedX + center.x;
        easyPointsHistory[i][j].targety = rotatedY + center.y;
        easyPointsHistory[i][j].targetangle += angle;

      }

    }

    easyPoints = easyPointsHistory[easyPointsHistory.length-1]

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
    // fullTangle(p)
    // putInPlace();
    // createButtonsForMoves(p);



    function scrollToPercentage(percentage) {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = totalHeight * (percentage / 100);
      window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    }
    
    // used for maintaining scroll point on reload
    if(debugging) {scrollToPercentage(50)};
    

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
  
    // generate new unknot
    if (Math.floor(window.scrollY / interval) == 0 && moveList.length == 1) {
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
    }


  };


  p.draw = function() {

    scrollHeight = document.documentElement.scrollHeight - window.innerHeight-0;
    interval = scrollHeight / numTangles;
    // Divide by the number of intervals
    targetProgress = p.map(window.scrollY, 0,scrollHeight, 0,numTangles)
    // if(mode == "full") {targetProgress = p.max(numTangles-moveList.length, targetProgress)}
    //variable to make passedintervals based on lag progress not actual scroll
    let asdf = p.map(progress, 0,numTangles,  0,scrollHeight)
    passedIntervals = Math.floor(asdf / interval);
    //invert index for history
    passedIntEZ = (numTangles*2) - (passedIntervals*2)
    nextInterval = passedIntEZ + 1;
    remainingIntervals = numTangles - passedIntervals
    let count = 0
    while (remainingIntervals < moveList.length && count<10) {
      // undo()
      count++
    }
    // let step = (targetProgress - progress) * easingFactor;
    // let step = Math.min(Math.abs(targetProgress - progress), 0.02) * Math.sign(targetProgress - progress);
    let targetStep = (targetProgress - progress) * easingFactor;
    let step = Math.min(Math.abs(targetStep), speedLimit) * Math.sign(targetStep);
    if(step){progress += step}
    localT = progress - passedIntervals


    // --------------- update coordinates for motion
    if (p.frameCount%1 == 0){

      if(mode == "full"){
        if (passedIntervals+1) {
          easyPoints = easyPointsHistory[nextInterval]

          for (let i = 0; i < easyPointsHistory[nextInterval].length; i++) {
            let easedT = easeInOut(localT); // Apply easing function to localT
            easyPoints[i].x = p.lerp(easyPointsHistory[nextInterval][i].targetx, easyPointsHistory[passedIntEZ][i].targetx, easedT);
            easyPoints[i].y = p.lerp(easyPointsHistory[nextInterval][i].targety, easyPointsHistory[passedIntEZ][i].targety, easedT);
            easyPoints[i].angle = p.lerp(easyPointsHistory[nextInterval][i].targetangle, easyPointsHistory[passedIntEZ][i].targetangle, easedT);
            easyPoints[i].bez1 = p.lerp(easyPointsHistory[nextInterval][i].targetbez1, easyPointsHistory[passedIntEZ][i].targetbez1, easedT);
            easyPoints[i].bez2 = p.lerp(easyPointsHistory[nextInterval][i].targetbez2, easyPointsHistory[passedIntEZ][i].targetbez2, easedT);
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
    
    drawSegments(p, 0, easyPoints.length);
    // drawWrapSegments(p, "top")
    // p.fill(0,0,255)
    // p.circle(center.x, center.y, 30)




    
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
        p.circle(actualCoords[i][0], actualCoords[i][1], 4);
        p.circle(actualCoords[i][2], actualCoords[i][3], 4);
        p.line(actualCoords[i][4], actualCoords[i][5], actualCoords[nextIndex][0], actualCoords[nextIndex][1]);
        p.line(actualCoords[i][4], actualCoords[i][5], actualCoords[i][2], actualCoords[i][3]);
        p.noStroke()

        p.textSize(20)
        p.fill(255,0,0);
        p.circle(actualCoords[i][4], actualCoords[i][5], 6);
        // p.text(i, actualCoords[i][4]+2, actualCoords[i][5])
      }

      for (let d = 0; d < randPts.length; d++) {
        let indices = randPts[d];
        let originalX = originalLocations[indices.stage][indices.point].x;
        let originalY = originalLocations[indices.stage][indices.point].y;
        let currentX = easyPointsHistory[indices.stage][indices.point].x;
        let currentY = easyPointsHistory[indices.stage][indices.point].y;
        let xBoundLow = originalX + indices.xBoundLow;
        let xBoundHi = originalX + indices.xBoundHi;
        let yBoundLow = originalY + indices.yBoundLow;
        let yBoundHi = originalY + indices.yBoundHi;
        
        p.strokeWeight(1);

        // for (let i = 0; i < easyPointsHistory.length; i++) {
            for (let j = 0; j < easyPointsHistory[passedIntEZ].length; j++) {
              if (easyPointsHistory[passedIntEZ][j].x === currentX && easyPointsHistory[passedIntEZ][j].y === currentY) {
                // p.stroke(255, 0, 0);
                p.stroke(colorthis[d]);
                p.noFill();
                p.text(indices.stage+","+indices.point,xBoundLow, yBoundLow)
                p.rect(xBoundLow, yBoundLow, xBoundHi - xBoundLow, yBoundHi - yBoundLow);

                if (indices.roundOut || indices.otherPt1) {
                  let which
                  // console.log(indices.stage,indices.point)
                  if (indices.roundOut == "next") {
                    which = (indices.point+1)%easyPoints.length
                    p.stroke(0,255,0)
                    p.strokeWeight(2)
                    p.circle(easyPoints[which].x, easyPoints[which].y, 12)
                  } else if (indices.roundOut == "prev") {
                    which = (indices.point-1+easyPoints.length)%easyPoints.length
                    p.stroke(0,255,0)
                    p.strokeWeight(2)
                    p.circle(easyPoints[which].x, easyPoints[which].y, 12)
                  }
                  if (indices.otherPt1) {
                    //not working
                    p.stroke(200,0,200)
                    which = indices.otherPt1
                    p.strokeWeight(2)
                    p.circle(easyPoints[which].x, easyPoints[which].y, 12)
                    console.log("PURPLE")
                  }
                  p.text("i"+which+"\nz"+easyPoints[which].zIndex, easyPoints[which].x, easyPoints[which].y)
                }
              }
            }
            for (let j = 0; j < easyPointsHistory[nextInterval].length; j++) {
              if (easyPointsHistory[nextInterval][j].x === currentX && easyPointsHistory[nextInterval][j].y === currentY) {
                // p.stroke(255, 0, 0);
                p.stroke(colorthis[d]);
                p.noFill();
                p.text(indices.stage+","+indices.point,xBoundLow, yBoundLow)
                p.rect(xBoundLow, yBoundLow, xBoundHi - xBoundLow, yBoundHi - yBoundLow);

                if (indices.roundOut) {
                  let which
                  if (indices.roundOut == "next") {
                    which = (indices.point+1)%easyPoints.length
                  } else if (indices.roundOut == "prev") {
                    which = (indices.point-1+easyPoints.length)%easyPoints.length
                  }
                  // p.text("i"+which+"\nz"+easyPoints[which].zIndex, easyPoints[which].x, easyPoints[which].y)
                  p.stroke(0,255,255)
                  p.strokeWeight(3)
                  p.circle(easyPoints[j].x, easyPoints[j].y, 12)
                }
              }
            }

            p.textSize(20)
            p.fill(255,0,0)
            p.stroke(0)
            for(let i=0; i<easyPoints.length; i++) {
              p.text("i"+i+"\nz"+easyPoints[i].zIndex, easyPoints[i].x, easyPoints[i].y)
            }


            p.fill(255,0,0)
            p.text("Start"+nextInterval+"\nEnd"+passedIntEZ, 10,20)
            p.noFill()
            p.stroke(0)
      }


    }

  }








    // Function to create and append buttons
  

}

let btmSketch = function(p) {
  p.setup = function() {
      canvas = p.createCanvas(canvasSize,canvasSize)
      canvas.style("-webkit-filter", `url("#svgfilter")`).style("filter", `url("#svgfilter")`);
      canvas.style('position', 'absolute');
      canvas.parent('sketch-holder-2');
      canvas.id('btmSketch');
      

      p.noFill();
      p.frameRate(15);
  };

  p.draw = function() {
      p.background("#171C31");
      // drawWrapSegments(p, "bottom")
      drawSegments(p, 0, Math.floor(easyPoints.length / 2)-1);

      // p.background(255,0,0)
      // p.clear()
      // drawHalfSegments(p);
  };

  p.keyPressed = function() {
    if (p.key === 'r') {
      randomMove(p)
    } else if (p.key === 'u') {
      undo()
    } else if (p.key === 's') {
      console.log("nextInterval",nextInterval)
      console.log("passedIntEZ",passedIntEZ)
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
      if (p.mouseX != 0) {
        p.image(imgCursor, p.mouseX, p.mouseY , 16, 22);  // Draw the image at the mouse location
      }
  };
};



new p5(mainSketch, 'canvasContainer1');
// new p5(cursorSketch, 'canvasContainer1');
// new p5(btmSketch, 'canvasContainer2');






function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
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
      if (easyPoints[j].zIndex == i) {
        p.strokeCap(p.SQUARE)
        p.stroke(strokeColor)
        p.strokeWeight(canvasSize/80)
        drawSegment(j, p)
        p.stroke(bgColor)
        // stroke(colors[easyPoints[j].grp])
        p.strokeWeight(canvasSize/160)
        drawSegment(j, p)
      }
    }
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
    subMoves: [],
    zIndex: easyPoints.length
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

}



function subdivideHistory(which, t, p){
  subdivideBezier(easyPoints, which, t, p)
  // for(let i = 0; i<easyPointsHistory.length; i++) {
  //   subdivideBezier(easyPointsHistory[i], which, t, p)
  // }
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





