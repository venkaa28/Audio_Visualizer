
var song;
var slider;
var playButton;
var amp;
var wave;
var volhistorySpin=[];
var volhistory = [];
var userInputFile;
var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight-100;
var t=0;
var particles = [];
var d = 50;

function preload() {
    //soundFormats('mp3');
    song = loadSound("RickFlair.mp3");
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    //createCanvas(720,400);
    slider = createSlider(0, 1, 0.5, 0.1);
    playButton = createButton("play");
    playButton.mousePressed(togglePlaying);
    //upload file button doesnt work yet, dont know how to store the file once clicked on
    fileButton = createButton("Upload File");
    fileButton.mousePressed(uploadFile);
    song.setVolume(0.5);
    amp = new p5.Amplitude();
    background(51);
    
}

//don't know how to store file once button is presssed
function uploadFile(){
    
    console.log("button was pressed");
    var input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => { 
        console.log(e.name);
     }
    input.click();
    console.log(userInputFile.name);
}

function togglePlaying() {
    if (!song.isPlaying()) {
        song.play();
        playButton.html("pause");
    } else {
        song.pause()
        playButton.html("play");
    }
}

//functions to generate lines for parametric lines
function x1(t){
    return sin(t/10)*200+sin(t/20)*200+sin(t/30)*200;
  }
  
  // function to change initial y co-ordinate of the line
  function y1(t){
    return cos(t/10)*200+cos(t/20)*200+cos(t/30)*200;
  }
  
  // function to change final x co-ordinate of the line
  function x2(t){
    return sin(t/15)*200+sin(t/25)*125+sin(t/35)*200;
  }
  
  // function to change final y co-ordinate of the line
  function y2(t){
    return cos(t/15)*200+cos(t/25)*125+cos(t/35)*200;
  }

 

function draw() {
    background(0);
    //center revolving audio wave function needs degrees
    angleMode(DEGREES);
    var vol = amp.getLevel();
    volhistory.push(vol);
    volhistorySpin.push(vol);
    stroke(148,27,12);
    noFill();
    //These two are the linear sound wave on top and bottom
    //comment out from here to 
    beginShape().fill('red');
    for(var i =0; i<volhistory.length; i++){
        var y = map(volhistory[i], 0, 1,canvasHeight, ((3*canvasHeight)/4)-100);
        vertex(i,y);
    }
    endShape();
    beginShape().fill('red');
    for(var i =0; i<volhistory.length; i++){
        var y = map(volhistory[i], 0, 1,0, 100+(canvasHeight)/4);
        vertex(i,y);
    }
    endShape();
    noFill();
    //here to remove lines
    //these are the two circles that grow and shrink based on volume
    translate(width / 2, height / 2);
    //comment out from here to 
    stroke(57,147, 221);
    ellipse(0, 0, 8000*vol, 8000*vol);
    stroke('yellow');
    ellipse(0, 0, 3000*vol, 3000*vol);
    stroke('#00FF00');
    beginShape().fill('#00FF00');
    for (var i = 0; i < 360; i++) {
      var r = map(volhistory[i], 0, 1, 1, 300);
      var x = 3 * r * cos(i);
      var y = r * tan(i) * sin(i); // 3d effect
      vertex(x, y);
    }
    endShape();
    noFill();
    beginShape().stroke('purple').strokeWeight(2);
    for (var i = 0; i < 360; i++) {
      var r = map(volhistory[i], 0, 1, 1, 300);
      var x = 3 * r * cos(i);
      var y = r * tan(i) * sin(i); // 3d effect
      vertex(x, y);
    }
    endShape();
    //to here to remove cirlces
    //radians are needed for the parametric line function
    angleMode(RADIANS);
    stroke('white');
    strokeWeight(0.5);
    //loop for adding 100 lines
    for(let i = 0;i<100;i++){
        line(x1(t+i),y1(t+i),x2(t+i)+(100*vol),y2(t+i)+(100*vol));
    }
    t+=0.15;

    //gravity and wind to affect particle explosion

    /*var gravity = createVector(0, 0.05);
    var wind = createVector(0.09, 0);

    if(particles.length > 0) {
        for(var i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].display();
        }
    } */

  
    if (volhistorySpin.length > 360) {
        volhistorySpin.splice(0, 1);
      
    }
    if (volhistory.length > canvasWidth) {
        volhistory.splice(0, 1);
    }
    
  }

  //everything below here is for the particle explosion, copied from an online website
  //if the lines above in the draw function are commented out, there will be no particle explosion
  var i = 0;
  setInterval(function() {
      if(i <= 150) {
          particles[i] = new Particle(width / 2, height / 2, random(3, 35));
          i++;
      }
  }, 15);

  
  class Particle {

    constructor(x, y, r) {
        this.pos   = createVector(x, y);
        this.vel   = createVector(random(-5, 5), random(-5, 5));
        this.acc   = createVector(0, 0);
        this.r     = r ? r : 48;
        this.halfr = r / 2;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);
    }

    display() {
        noStroke();
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }

    edges() {
        if(this.pos.y > (height - this.halfr)) {
            this.vel.y *= -1;
            this.pos.y = (height - this.halfr);
        }

        if(this.pos.y < 0 + this.halfr) {
            this.vel.y *= -1;
            this.pos.y = 0 + this.halfr;
        }

        if(this.pos.x > (width - this.halfr)) {
            this.vel.x *= -1;
            this.pos.x = (width - this.halfr);
        }

        if(this.pos.x < this.halfr) {
            this.vel.x /= -1;
            this.pos.x = this.halfr;
        }
    }

}