/*

    p5 instance mode, all p5 methods are bound to "sketch"

*/
// We need to pass in a reference to the controller because we need to update other views when interacting with the canvas
function galleryCanvas(vizData, controller, proxyUrl) {
    const galleryCanvas = ( sketch ) => {
        // variables bound to the sketch are accessible whereever the object is in scope
        // ex. we can modify them in the main JS file
        console.log(vizData, proxyUrl);
        sketch.canvasDOMElement = document.getElementById("canvas");

        sketch.objects = vizData.dbReadableCanvasObjects;
        sketch.song = null;

        let fft = new p5.FFT();
        sketch.backgroundColor = vizData.canvasBackgroundColor;
        // emulate full screen
        // document.querySelector("body").style.backgroundColor = vizData.canvasBackgroundColor;
        
        sketch.preload = () => {
            sketch.soundFormats('mp3');
            if (vizData.songURL != null) {
                sketch.song = sketch.loadSound(`${proxyUrl}/${vizData.songURL}`);
            }
        }

        sketch.setup = () => {
            let cnv = sketch.createCanvas(vizData.canvasWidth, vizData.canvasHeight);
            sketch.rectMode(sketch.CENTER);
            cnv.mousePressed(canvasPressed); // mouse events will only apply to canvas area

            // let songDetails = sketch.createP(`${vizData.artistName} - ${vizData.trackName} `);
            // songDetails.position(100, sketch.windowHeight - 115);
            // songDetails.elt.style.color = "white";
            // songDetails.elt.style.backgroundColor = "black";
            // songDetails.elt.style.fontSize = "20px";

                    
        };

        // p5 will constantly call this draw function, so re-rendering of canvas is automatically handled.
        sketch.draw = () => {
            fft.analyze();
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
                let dimensionModifier = fft.getEnergy(obj.frequency) * obj.audioSensitivity;
                switch (obj.shapeType) {
                    case("Rectangle"):
                        sketch.rect(obj.x, obj.y, obj.w + dimensionModifier, obj.h + dimensionModifier);
                        break;
                    case("Ellipse"):
                        sketch.ellipse(obj.x, obj.y, obj.w + dimensionModifier, obj.h + dimensionModifier);
                        break;
                }
                sketch.pop();
            })
            
        };

        function canvasPressed() {
            sketch.toggleAudio();
        }

        // sketch.windowResized = () => {
        //     // sketch.resizeCanvas(sketch.canvasDOMElement.clientWidth,sketch.canvasDOMElement.clientHeight);
        //     console.log("resize");
        // };

        // Force stop audio, since audio occasionally keeps on playing even when the sketch is removed.
        sketch.stopAudio = () => {
            if (sketch.song != null) {
                sketch.song.pause();
            } 
        }

        sketch.toggleAudio = () => {
            if (sketch.song != null) {
                if (sketch.song.isPlaying()) {
                    sketch.song.pause();
                    return "paused";
                } else {
                    sketch.song.play();
                    return "playing";
                }
            } else {
                console.log("song not ready")
            }
        };
    };

    return galleryCanvas;
}


export default galleryCanvas;