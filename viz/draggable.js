// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>
// https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88

class Draggable {
    constructor(sketch, x, y, w, h) {
        this.dragging = false; // Is the object being dragged?
        this.rollover = false; // Is the mouse over the ellipse?

        this.sketch = sketch;

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
            // console.log("after: ", this.x, this.y);
        }

    }

    show() {
        // saves previous drawing settings (such as fill, stroke, etc.)
        this.sketch.push();
        this.sketch.stroke(0);
        // Different fill based on state
        if (this.dragging) {
            // this.sketch.fill(50);
            this.sketch.fill(200);
        } else if (this.rollover) {
            this.sketch.stroke("#2596FF");
            this.sketch.strokeWeight(5);
            this.sketch.fill(200);
        } else {
            this.sketch.fill(200);
        }
        this.sketch.rect(this.x, this.y, this.w, this.h);
        this.sketch.pop();
    }

    pressed() {
        // Did I click on the rectangle?
        if (this.sketch.mouseX > this.x && this.sketch.mouseX < this.x + this.w && this.sketch.mouseY > this.y && this.sketch.mouseY < this.y + this.h) {
            // console.log("offset change")
            this.dragging = true;
            // If so, keep track of relative location of click to corner of rectangle
            this.offsetX = this.x - this.sketch.mouseX;
            this.offsetY = this.y - this.sketch.mouseY;
            // console.log("offset: ", this.offsetX, this.offsetY);
        }
    }

    released() {
        // Quit dragging
        this.dragging = false;
    }
}

export default Draggable;