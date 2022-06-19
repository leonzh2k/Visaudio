/*

    p5 instance mode, all p5 methods are bound to "sketch"

*/
// We need to pass in a reference to the controller because we need to update other views when interacting with the canvas
function galleryCanvas(vizData, vizIndex, vizNavigator, proxyUrl) {
    const galleryCanvas = ( sketch ) => {
        // variables bound to the sketch are accessible whereever the object is in scope
        // ex. we can modify them in the main JS file
        console.log(vizData, proxyUrl);
        sketch.canvasDOMElement = document.getElementById("canvas");

        sketch.objects = vizData.dbReadableCanvasObjects;
        console.log("OBJECTS: ", sketch.objects)
        sketch.song = null;
        // let audioLoading = true;

        let fft = new p5.FFT();
        sketch.backgroundColor = vizData.canvasBackgroundColor;
        // emulate full screen
        document.querySelector("body").style.backgroundColor = vizData.canvasBackgroundColor;
        
        sketch.preload = () => {
            sketch.soundFormats('mp3');
            if (vizData.songURL != null) {
                sketch.song = sketch.loadSound(`${proxyUrl}/${vizData.songURL}`)
            }
        }

        sketch.setup = () => {
            let cnv = sketch.createCanvas(vizData.canvasWidth, vizData.canvasHeight);
            sketch.rectMode(sketch.CENTER);
            cnv.mousePressed(canvasPressed); // mouse events will only apply to canvas area

            let songDetails = sketch.createP(`${vizData.artistName} - ${vizData.trackName} `);
            songDetails.position(100, sketch.windowHeight - 115);
            songDetails.elt.style.color = "white";
            songDetails.elt.style.backgroundColor = "black";
            songDetails.elt.style.fontSize = "20px";

            sketch.playButton = sketch.createImg('./assets/img/play_button.svg');
            sketch.song.onended(() => {
                console.log("ended");
                sketch.playButton.elt.src = './assets/img/play_button.svg';
            });
            // p.parent("view-viz");
            sketch.playButton.style('font-size', '25px');
            sketch.playButton.position(sketch.windowWidth / 2 - 100, sketch.windowHeight - 100);
            sketch.playButton.mousePressed(toggleAudio);

            if (vizIndex != vizNavigator.vizzes.length - 1) {
                sketch.nextVizButton = sketch.createImg('./assets/img/nextVizButton.svg');
                sketch.nextVizButton.position(sketch.windowWidth - 180, vizData.canvasHeight / 2);
                sketch.nextVizButton.elt.style.cursor = "pointer";
                sketch.nextVizButton.mousePressed(() => {
                    vizNavigator.displayViz(vizIndex + 1);
                });
            }
            if (vizIndex != 0) {
                sketch.previousVizButton = sketch.createImg('./assets/img/previousVizButton.svg');
                sketch.previousVizButton.position(-50, vizData.canvasHeight / 2);
                sketch.previousVizButton.elt.style.cursor = "pointer";
                sketch.previousVizButton.mousePressed(() => {
                    vizNavigator.displayViz(vizIndex - 1);
                });
            }
            
            
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
            toggleAudio();
        }

        sketch.windowResized = () => {
            // sketch.resizeCanvas(sketch.canvasDOMElement.clientWidth,sketch.canvasDOMElement.clientHeight);
            console.log("resize");
        };

        // Force stop audio, since audio occasionally keeps on playing even when the sketch is removed.
        // Is called in removeViz() in main script.
        sketch.stopAudio = () => {
            if (sketch.song != null) {
                sketch.song.pause();
            } else {
                console.log("song removed before assigned")
            }
            
        }

        function toggleAudio() {
            if (sketch.song != null) {
                if (sketch.song.isPlaying()) {
                    sketch.song.pause();
                    sketch.playButton.elt.src = './assets/img/play_button.svg';
                    // p.html('play');
                    // sketch.noLoop();
                } else {
                    sketch.song.play();
                    sketch.playButton.elt.src = './assets/img/pause_button.svg';
                    // p.html('pause');
                    // sketch.loop();
                }
            } else {
                console.log("song not ready")
            }
        };
    };

    return galleryCanvas;
}


export default galleryCanvas;