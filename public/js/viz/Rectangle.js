
// Inspired by Daniel Shiffman <http://www.shiffman.net>
// https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88

/*
    TODO: rework visual cues on hover

    Only highlight the shape that would be selected if you clicked

    Note: hit detection algorithm depends on what rectMode is used.
    The shape is drawn differently b/c different rectModes interpret
    the parameters given differently.
*/
class Rectangle {
    constructor(sketch, x, y, w, h, controller) {
        this.shapeType = "Rectangle";
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

        this.strokeWeight = 1;

        this.frequency = "bass";
        this.audioSensitivity = 1;
        
        this.noFill = false;
        
        this.x = x;
        this.y = y;
        // Dimensions
        this.w = w;
        this.h = h;
    }

    cornerRectModeHitDetection() {
        if (this.sketch.mouseX > this.x && this.sketch.mouseX < this.x + this.w && this.sketch.mouseY > this.y && this.sketch.mouseY < this.y + this.h) {
            return true;
        } else {
            return false;
        }
    }

    centerRectModeHitDetection(fft) {
        // console.log(fft.getEnergy("bass"))
        let dimensionModifier = fft.getEnergy(this.frequency) * this.audioSensitivity;
        if (this.sketch.mouseX > this.x - ((this.w + this.strokeWeight + dimensionModifier) / 2) && this.sketch.mouseX < this.x + ((this.w + this.strokeWeight + dimensionModifier) / 2) && this.sketch.mouseY > this.y - ((this.h + this.strokeWeight + dimensionModifier) / 2) && this.sketch.mouseY < this.y + ((this.h + this.strokeWeight + dimensionModifier) / 2)) {
            return true;
        } else {
            return false;
        }
    }

    over(fft) {
        // Is mouse over object
        
        if (this.centerRectModeHitDetection(fft)) {
            this.rollover = true;
        } else {
            this.rollover = false;
        }
    }

    update() {

      // Adjust location if being dragged
        if (this.dragging) {
            this.x = this.sketch.mouseX + this.offsetX;
            this.y = this.sketch.mouseY + this.offsetY;
            
            return true;
        }

    }

    // highlights shape
    // is called when mouse hovers over the object.
    highlight(fft, selected) {
        // draw outline highlighting shape indicating you're hovering over it
        this.sketch.push();
        this.sketch.noFill();
        // this.sketch.fill("#2596FF");
        switch (selected) {
            case ("selected"):
                this.sketch.stroke("#2596FF");
                break;
            case ("unselected"):
                this.sketch.stroke("#04FF00");
                break;
        }
        this.sketch.strokeWeight(this.strokeWeight+5);
        let dimensionModifier = fft.getEnergy(this.frequency) * this.audioSensitivity;
        this.sketch.rect(this.x, this.y, this.w + dimensionModifier, this.h + dimensionModifier);
        this.sketch.pop();
    }

    show(fft) {
        // push saves current drawing settings (such as fill, stroke, etc.)
        this.sketch.push();
        // this.sketch.stroke(this.stroke);
        this.sketch.strokeWeight(this.strokeWeight);
        this.sketch.stroke(this.stroke);
        if (this.noFill) {
            this.sketch.noFill();
        } else {
            this.sketch.fill(this.fill);
        }
        let dimensionModifier = fft.getEnergy(this.frequency) * this.audioSensitivity;
        this.sketch.rect(this.x, this.y, this.w + dimensionModifier, this.h + dimensionModifier);
        this.sketch.pop();
    }

    pressed(fft) {
        // Did I click on the rectangle?
        if (this.centerRectModeHitDetection(fft)) {
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