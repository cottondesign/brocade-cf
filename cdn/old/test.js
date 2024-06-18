


<script>

let mainSketch = function(p) {


  p.setup = function() {
    
    canvasSize = (p.windowWidth > 1000) ? 1000 : p.windowWidth
    canvas = p.createCanvas(canvasSize, canvasSize)
    canvas.style('position', 'absolute');
    canvas.parent('sketch-holder');
    
    

  }


  window.onscroll = function() {


    // Store the last interval passed in a variable, initialize if not exist
    window.lastInterval = window.lastInterval || 0;


  
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
    if(p.frameCount%5==0) {
      p.fill(0,255,0)
      p.circle(p.random(p.width), p.random(p.height), 100)
    }
  }
}



new p5(mainSketch, 'canvasContainer1');


</script>