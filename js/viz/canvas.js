import Rectangle from "./Rectangle.js";
import Ellipse from "./Ellipse.js";
/*

    p5 instance mode, all p5 methods are bound to "sketch"

*/
/*

    TODO
    =========
        - Create shapes by dragging mouse
        - Resize shapes by dragging mouse
        - Highlight only foremost shape (shape that will be selected) if hovering over multiple shapes
        - Click on shape to select it

*/
// We need to pass in a reference to the controller because we need to update other views when interacting with the canvas
function canvas(proxyUrl, canvasWidth, canvasHeight, initialCanvasBackgroundColor, audioObject, controller) {
    // console.log(canvasHeight);
    const canvas = ( sketch ) => {
        // variables bound to the sketch are accessible whereever the object is in scope
        // ex. we can modify them in the main JS file
        sketch.canvasDOMElement = document.getElementById("canvas");

        sketch.selectedObject = null;
        sketch.objects = [];

        sketch.song = null;
        
        let fft = new p5.FFT(audioObject);

        sketch.backgroundColor = initialCanvasBackgroundColor;
        
        sketch.setup = () => {
            let cnv = sketch.createCanvas(canvasWidth, canvasHeight);
            sketch.rectMode(sketch.CENTER);
            cnv.mousePressed(canvasPressed); // mouse events will only apply to canvas area
        };

        // p5 will constantly call this draw function, so re-rendering of canvas is automatically handled.
        sketch.draw = () => {
            fft.analyze();
            sketch.background(sketch.backgroundColor);
            sketch.fill(255);
            let hoveredObjects = [];
            let objectsToOutline = [];
            // figure out which object to highlight
            /*
                Rules to highlight an object
                1. there is no selected object, then the topmost object hovered will be highlighted
                2. an object is selected and not being dragged, it should be highlighted
                    - the top most unselected object hovered will also be highlighted. 
            */

            sketch.objects.forEach(obj => {
                if (obj.rollover) {
                    hoveredObjects.push(obj);
                }
            });

            if (hoveredObjects.length > 0) {
                objectsToOutline.push(hoveredObjects[hoveredObjects.length - 1]);
            }

            if (sketch.selectedObject !== null && sketch.selectedObject.dragging) {
                objectsToOutline = [];
            }
            
            if (sketch.selectedObject !== null && !sketch.selectedObject.dragging) {
                // console.log("not dragging");
                objectsToOutline.push(sketch.selectedObject);
            }
            
            // draw each object
            sketch.objects.forEach(obj => {
                // update positions of objects if needed
                /*
                    Turns out re-rendering the input fields constantly makes it impossible to change
                    them. This way we only re-render if the object's position changed, better 
                    performance and doesn't break input fields
                */
                if (obj.update()) {
                    controller.updateSelectedCanvasObject(sketch.selectedObject);

                } 
                obj.over();   // checks if mouse is over object
                if (objectsToOutline.includes(obj)) {
                    // console.log("highlight something")
                    if (obj === sketch.selectedObject) {
                        obj.highlight(fft, "selected");
                    } else {
                        obj.highlight(fft, "unselected");
                    }
                    
                }
                obj.show(fft);   // draws object on the canvas
            })
            
        };

        function canvasPressed() {
            // console.log("mouse pressed");
            let hoveredObjects = [];
            // keep track of all objects that the cursor is over
            sketch.objects.forEach(obj => {
                if (obj.rollover) {
                    hoveredObjects.push(obj);
                }
            });

            /*
                If mouse is over multiple objects, select only the foremost object to
                be draggable. The foremost object is defined is the most recently created object
                (i.e. the last object in the sketch.objects array).

                This handles hovered over one or more objects.
            */
            if (hoveredObjects.length > 0) {
                sketch.selectedObject = hoveredObjects[hoveredObjects.length - 1];
                sketch.selectedObject.pressed();

                // Change context menu to object properties
                controller.updateSelectedCanvasObject(sketch.selectedObject); 
            } else { // Means we selected no object (click on the background)
                sketch.selectedObject = null;
                controller.updateSelectedCanvasObject(sketch.selectedObject);
            }
        }

        sketch.mouseReleased = () => {
            // console.log("mouse released");
            sketch.objects.forEach(obj => {
                obj.released();
            });
        }

        // creates and returns a new object (so model can keep track of all objects)
        sketch.createObject = (shapeType) => {
            let newObject;
            switch(shapeType) {
                case("rectangle"):
                    newObject = new Rectangle(sketch, sketch.canvasDOMElement.clientWidth / 2, sketch.canvasDOMElement.clientHeight / 2, 50, 50, controller);
                    break;
                case("ellipse"):
                    newObject = new Ellipse(sketch, sketch.canvasDOMElement.clientWidth / 2, sketch.canvasDOMElement.clientHeight / 2, 50, 50, controller);
                    break;
            }
            sketch.objects.push(newObject);
            sketch.selectedObject = newObject;
            // new object is set as selected
            controller.updateSelectedCanvasObject(newObject);
            return newObject;
        }

        sketch.windowResized = () => {
            // sketch.resizeCanvas(sketch.canvasDOMElement.clientWidth,sketch.canvasDOMElement.clientHeight);
            console.log("resize");
        };
    };

    return canvas;
}


export default canvas;