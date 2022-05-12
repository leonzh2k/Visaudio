/*

    p5 instance mode, all p5 methods are bound to "sketch"

*/
// We need to pass in a reference to the controller because we need to update other views when interacting with the canvas
function thumbnailCanvas(vizData, containerWidth, containerHeight) {
    const thumbnailCanvas = ( sketch ) => {
        // variables bound to the sketch are accessible whereever the object is in scope
        // ex. we can modify them in the main JS file
        sketch.canvasDOMElement = document.getElementById("canvas");

        sketch.objects = vizData.dbReadableCanvasObjects;
        console.log("OBJECTS: ", sketch.objects)

        sketch.backgroundColor = vizData.canvasBackgroundColor;
        
        sketch.preload = () => {

        }

        sketch.setup = () => {
            sketch.createCanvas(containerWidth, containerHeight);
            sketch.rectMode(sketch.CENTER);
            sketch.widthRatio = containerWidth / vizData.canvasWidth;
            sketch.heightRatio = containerHeight / vizData.canvasHeight;
            console.log(sketch.widthRatio, sketch.heightRatio);
            sketch.noLoop();
        };

        // p5 will constantly call this draw function, so re-rendering of canvas is automatically handled.
        sketch.draw = () => {
            sketch.background(sketch.backgroundColor);
            sketch.fill(255);

            // draw each object
            sketch.objects.forEach(obj => {
                sketch.push();
                if (obj.noFill) {
                    sketch.noFill();
                } else {
                    sketch.fill(obj.fill);
                }
                sketch.stroke(obj.stroke);
                sketch.strokeWeight(obj.strokeWeight);
                // let dimensionModifier = fft.getEnergy(obj.frequency) * obj.audioSensitivity;
                let dimensionModifier = sketch.random(150);
                switch (obj.shapeType) {
                    case("Rectangle"):
                        sketch.rect(obj.x * sketch.widthRatio, obj.y * sketch.heightRatio, obj.w + dimensionModifier, obj.h + dimensionModifier);
                        break;
                    case("Ellipse"):
                        sketch.ellipse(obj.x * sketch.widthRatio, obj.y * sketch.heightRatio, obj.w + dimensionModifier, obj.h + dimensionModifier);
                        break;
                }
                sketch.pop();
            })
            
        }


    }


    return thumbnailCanvas;
}


export default thumbnailCanvas;