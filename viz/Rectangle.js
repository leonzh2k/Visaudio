// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>
// https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88

/*
    TODO: rework visual cues on hover

*/
class Rectangle {
    constructor(sketch, x, y, w, h, controller) {
        this.dragging = false; // Is the object being dragged?
        this.rollover = false; // Is the mouse over the ellipse?

        // we are using p5 instance mode, so all p5 functions are called as methods
        // and so we need to keep a reference to the instance object
        this.sketch = sketch;
        // we need to use the controller when position changes to re-render context menu
        this.controller = controller;
        // initial color settings on creation
        // all colors must be in hex as value attribute of html color pickers requires this
        this.fill = "#C4C4C4";
        this.stroke = "#000000";

        this.frequency = "bass";
        this.audioSensitivity = 5;
        
        this.x = x;
        this.y = y;
        // Dimensions
        this.w = w;
        this.h = h;
    }

    over() {
        // Is mouse over object
        if (this.sketch.mouseX > this.x && this.sketch.mouseX < this.x + this.w && this.sketch.mouseY > this.y && this.sketch.mouseY < this.y + this.h) {
            this.rollover = true;
        } else {
            this.rollover = false;
        }
    }

    update() {

      // Adjust location if being dragged
        if (this.dragging) {
            // console.log("object moved")
            // console.log("update coords");
            // console.log("before: ", this.x, this.y);
            // console.log(this.offsetX, this.offsetY);
            // console.log(this.sketch.mouseX, this.sketch.mouseY);
            this.x = this.sketch.mouseX + this.offsetX;
            this.y = this.sketch.mouseY + this.offsetY;
            
            return true;
        }

    }

    show() {
        // saves previous drawing settings (such as fill, stroke, etc.)
        this.sketch.push();
        // this.sketch.stroke(this.stroke);
        // Different fill based on state
        if (this.dragging) {
            this.sketch.fill(this.fill);
        } else if (this.rollover) {
            this.sketch.stroke("#2596FF");
            this.sketch.strokeWeight(5);
            this.sketch.fill(this.fill);
        } else {
            this.sketch.stroke(this.stroke);
            this.sketch.fill(this.fill);
        }
        this.sketch.rect(this.x, this.y, this.w, this.h);
        this.sketch.pop();
    }

    pressed() {
        // Did I click on the rectangle?
        if (this.sketch.mouseX > this.x && this.sketch.mouseX < this.x + this.w && this.sketch.mouseY > this.y && this.sketch.mouseY < this.y + this.h) {
            this.dragging = true;
            // If so, keep track of relative location of click to corner of rectangle
            this.offsetX = this.x - this.sketch.mouseX;
            this.offsetY = this.y - this.sketch.mouseY;
        }
    }

    released() {
        // Quit dragging
        this.dragging = false;
    }
}

export default Rectangle;