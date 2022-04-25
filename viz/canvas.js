import Rectangle from "./Rectangle.js";
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
            // console.log(fft.getEnergy("bass"));
            sketch.background(sketch.backgroundColor);
            sketch.fill(255);
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
                obj.show(fft);   // draws object on the canvas
            })
            
            // if (sketch.selectedObject != null) {
            //     controller.updateSelectedCanvasObject(sketch.selectedObject);
            // }
        };

        sketch.respond = () => {
            console.log("draw mode");
        }

        function canvasPressed() {
            console.log("mouse pressed");
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
        sketch.createObject = () => {
            let newObject = new Rectangle(sketch, sketch.canvasDOMElement.clientWidth / 2, sketch.canvasDOMElement.clientHeight / 2, 50, 50, controller);
            sketch.objects.push(newObject);
            // new object is set as selected
            controller.updateSelectedCanvasObject(newObject);
            return newObject;
        }

        // should the canvas be responsible for managing audio, or the audio player?
        /*
            separation of concerns... maybe have all the playback and audio loading be handled
            only by audio player view, then canvasview only takes in an audio object to analyze
            the audio data?

            https://p5js.org/reference/#/p5.FFT/setInput

        */
        // sketch.loadAudio = (audioURL) => {
        //     console.log("loading audio...")
        //     // prevents multiple audio objects from being created (singleton)
        //     if (sketch.song != null) { // when audio object already exists
        //         console.log("audio object already created, changing url")
        //         if (sketch.song.isPlaying()) {
        //             sketch.song.stop();
        //         }
        //         sketch.song.setPath(audioURL, () => {
        //             console.log("success")
        //             // sketch.song.play();
        //             // tell audio player view that it's ready to play 
        //             controller.setAudioPlayerStatus("ready");
        //         });
        //     } else {
        //         console.log("first audio to be loaded")
        //         // on first song load
        //         sketch.song = sketch.loadSound(audioURL, () => {
        //             console.log("success")
        //             // sketch.song.play();
        //             // tell audio player view that it's ready to play 
        //             controller.setAudioPlayerStatus("ready");
        //         });
        //     }
        // }

        // sketch.playAudio = () => {
        //     sketch.song.play();
        // }


        sketch.windowResized = () => {
            sketch.resizeCanvas(sketch.canvasDOMElement.clientWidth,sketch.canvasDOMElement.clientHeight);
            console.log("resize");
        };
    };

    return canvas;
}


export default canvas;