import Draggable from "./draggable.js";
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
function canvas(proxyUrl, canvasWidth, canvasHeight) {
    const canvas = ( sketch ) => {
        sketch.canvasDOMElement = document.getElementById("canvas");
        sketch.objects = [
            // new Draggable(sketch, 100, 100, 50, 50),
            // new Draggable(sketch, 200, 200, 50, 50),
            // new Draggable(sketch, 300, 300, 50, 50)
            // {
            //     type: "rect",
            //     xPos: 100,
            //     yPos: 100,
            //     width: 100,
            //     height: 100,
            //     draw: sketch.rect
            // },

            // {
            //     type: "rect",
            //     xPos: 200,
            //     yPos: 200,
            //     width: 100,
            //     height: 100,
            //     draw: sketch.rect
            // }
        ];
        
    
        sketch.setup = () => {
            sketch.createCanvas(canvasWidth, canvasHeight);
        };

        sketch.draw = () => {
            sketch.background("#E5E5E5");
            sketch.fill(255);
            // draw each object
            sketch.objects.forEach(obj => {
                obj.update();
                obj.over();
                obj.show();
            })
        };
        

        sketch.respond = () => {
            console.log("draw mode");
        }
        console.log("p5 ready");

        // sketch.mouseDragged = () => {
        //     console.log("mouse dragged");
        //     sketch.objects.forEach(obj => {
                
        //         obj.pressed();
        //     })
        // }

        sketch.mousePressed = () => {
            // sketch.objects[0].pressed();
            let hoveredObjects = [];
            sketch.objects.forEach(obj => {
                if (obj.rollover) {
                    hoveredObjects.push(obj);
                }
            })

            /*
                If mouse is over multiple objects, only drag the foremost object.
                The foremost object is defined is the most recently created object
                (i.e. the last object in the sketch.objects array).

                This handles hovered over one or more objects.
            */
            if (hoveredObjects.length > 0) {
                hoveredObjects[hoveredObjects.length - 1].pressed();
            }
        }

        sketch.mouseReleased = () => {
            console.log("mouse released");
            sketch.objects.forEach(obj => {
                obj.released();
            })
        }


        sketch.createObject = () => {
            sketch.objects.push(new Draggable(sketch, sketch.canvasDOMElement.clientWidth / 2, sketch.canvasDOMElement.clientHeight / 2, 50, 50));
        }


        sketch.windowResized = () => {
            sketch.resizeCanvas(sketch.canvasDOMElement.clientWidth,sketch.canvasDOMElement.clientHeight);
            console.log("resize");
        };
    };

    return canvas;
}


export default canvas;