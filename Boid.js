"use strict"

class Boid {
   constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(random(-2, 2), random(-2, 2));
      this.acc = createVector();

      this.maxSpeed = 2; // max speed;
      this.maxSteerForce = 0.05; // max steering force

      this.separateDistance = 50
      this.neighbourDistance = 30
      
      this.fillCol = randomPalette()
   }

   update() {
      this.vel.add(this.acc);
      //this.vel.limit(this.maxSpeed); // ***
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.angle = this.vel.heading();
   }

   applyForce(force) {
      this.acc.add(force);
   }

   flock(others) {
      var cForce = this.cohesion(others)
      var sForce = this.separate(others)
      var aForce = this.align(others)

      cForce.mult(1.0)
      sForce.mult(1.0)
      aForce.mult(1.0)

      this.applyForce(cForce)
      this.applyForce(sForce)
      this.applyForce(aForce)
   }

   align(others) {
      //sum
      var velocity = createVector()
      var count = 0
         //for loop 
      for (var i = 0; i < others.length; i++) {
         var other = others[i]
         var distance = this.pos.dist(other.pos)
         if (distance < this.neighbourDistance && distance > 0) {
            velocity.add(other.vel)
            count++
         }
      }
      //avg
      if (count > 0) {
         velocity.div(count)
         velocity.setMag(this.maxSpeed)
         var steer = p5.Vector.sub(velocity, this.vel)
         steer.limit(this.maxSteerForce)
         this.applyForce(steer)
      }


   }

   cohesion(others) {
      //sum
      var position = createVector()
      var count = 0

      //for loop
      for (var i = 0; i < others.length; i++) {
         var other = others[i]
         var distance = this.pos.dist(other.pos)
         if (distance > 0 && distance < this.neighbourDistance) {
            position.add(other.pos)
            count++
         }
      }
      //avg
      if (count > 0) {
         position.div(count)
         this.seek(position)
      }

      //position will be edited later
   }

   separate(others) {
      //avg of vectors
      var vector = createVector() //vector is actually the variable for sum
      var count = 0
      for (var i = 0; i < others.length; i++) {
         var other = others[i]
         var distance = this.pos.dist(other.pos)

         if (distance < this.separateDistance && distance > 0) {
            //sum+=value
            var diff = p5.Vector.sub(this.pos, other.pos)
            diff.normalize()
            diff.div(distance)
               //finally sum
            vector.add(diff)
            count++
         }
      }
      //avg -- we do it here cos we won't get the var count until the for loop finishes
      if (count > 0) {
         vector.div(count)
      }

      if (vector.mag() > 0) {
         //desired vector
         vector.setMag(this.maxSpeed)

         //steering force
         vector.sub(this.vel)
         vector.limit(this.maxSteerForce)
            //return vector //--ask Moon
      }

      //apply
      this.applyForce(vector) //--ask Moon
      //return vector //ask Moon
   }

   seek(target) {
      var desired = p5.Vector.sub(target, this.pos);
      desired.setMag(this.maxSpeed); // ***
      var steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxSteerForce);
      this.applyForce(steer);
   }

   checkEdges() {
      // x
      if (this.pos.x < 0) {
         this.pos.x = width;
      } else if (this.pos.x > width) {
         this.pos.x = 0;
      }
      // y
      if (this.pos.y < 0) {
         this.pos.y = height;
      } else if (this.pos.y > height) {
         this.pos.y = 0;
      }
   }

   display() {
      push()
      translate(this.pos.x, this.pos.y)
      rotate(this.angle)
      noStroke()
      fill(this.fillCol);
      triangle(0, 0, -20, 0, -30, -8)
      triangle(0, 0, -20, 0, -30, 8)
      pop()
   }
}