//the compass needle moves according to the wind pattern in that area
//for their

"use strict"

var boids = []
var accuColour = []
var canvas 

function setup() {
   canvas = createCanvas(windowWidth, windowHeight)
   canvas.position(0,0)
   canvas.style('z-index', '-1')
   
   colorMode(HSB)

   accuColour = [ //this needs to go befoe we push new boids into the array
      color(15, 84, 93), //accuOrange
      color(15, 70, 93),
      color(15, 50, 93), //light orange
      color(15, 30, 93),
      color(0, 0, 90), //light grey
      color(0, 0, 50)
   ]

   for (var i = 0; i < 70; i++) {
      boids.push(new Boid(width / 2 + random(-1, 1), height / 2 + random(-1, 1)))
   }
}

function draw() {
   background(0, 0, 100);

   for (var i = 0; i < boids.length; i++) {
      var b = boids[i]
      var target = createVector(mouseX, mouseY)
      b.seek(target)
         //b.cohesion(boids)
      b.separate(boids)
         //b.align(boids)
         //b.flock(boids)
      b.update()
      b.checkEdges()
      b.display()
   }
}

function randomPalette() {
   var rando2 = floor(random(0, accuColour.length))
   return accuColour[rando2]
}