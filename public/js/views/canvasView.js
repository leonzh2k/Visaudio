import canvas from "../viz/canvas.js";
const canvasView = {
    init(controller, audioObject) {
        let parentWidth = document.getElementById("canvas").clientWidth;
        let parentHeight = document.getElementById("canvas").clientHeight;
        // the sketch constantly draws itself, thus, changing any member will automatically be rendered
        this.sketch = new p5(canvas(parentWidth, parentHeight, controller.getCanvasBackgroundColor(), audioObject, controller), "canvas");
        // debug
        // canvasView.sketch.createObject()
    }
};

export default canvasView; 