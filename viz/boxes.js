function boxes(vizMetadata, proxyUrl) {
    const s = ( sketch ) => {
        // let rotate = 0;
        let windowHeight = window.innerHeight;
  
        let songName = `${proxyUrl}/${vizMetadata.get("vizParams").songUrl}`;
        let song;
        let fft;
        let audioLoading = true;
        let p;
        let font;
        sketch.preload = () => {

            console.log("load");
            sketch.soundFormats('mp3');
            let filepath = "./assets/VPSCOURT.TTF";
            font = sketch.loadFont(filepath);

            console.log("preload done")
        }
        sketch.setup = () => {
            console.log("setup")
            let cnv = sketch.createCanvas(document.getElementById("view-viz").clientWidth, windowHeight / 1.2, sketch.WEBGL);
            cnv.mousePressed(toggleAudio);
            p = sketch.createP('play');
            // p.parent("view-viz");
            p.style('font-size', '25px');
            p.position(650, 635);
            p.mousePressed(toggleAudio);

            fft = new p5.FFT();
            sketch.rectMode(sketch.CENTER);
            
            var request = new XMLHttpRequest();
            request.open('GET', songName);
            request.responseType = 'blob';
            // I put "XMLHttpRequest" here, but you can use anything you want.
            request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            request.onload = function() {
                song = sketch.loadSound(request.response);
                audioLoading = false;
                console.log("song ready")
            };
            request.send();
        };
    
        sketch.windowResized = () => {
            windowHeight = window.innerHeight;
            sketch.resizeCanvas(document.getElementById("view-viz").clientWidth, windowHeight / 1.2);
            console.log("resize");
        };
    
        sketch.draw = () => {
            // console.log("draw");
            sketch.background(0); // clears previous drawings (without it would keep shapes from previous draw)
            sketch.fill(255);
            
            sketch.textSize(21);
            sketch.textFont(font);
  
            sketch.text(`${vizMetadata.get("vizParams").artist} - ${vizMetadata.get("vizParams").songTitle} `, -550, 275);

            fft.analyze();
            let trebEnergy = fft.getEnergy("treble");
            let lowMidEnergy = fft.getEnergy("lowMid");

            // sketch.translate(document.getElementById("view-viz").clientWidth / 2, windowHeight / (2 * 1.2));

            if (audioLoading) {
                sketch.textSize(32);
                sketch.text("LOADING...", 0-75, 0);
            }

            sketch.rotateX(sketch.frameCount * 0.01);

            sketch.rotateY(sketch.frameCount * 0.01);

            sketch.noFill();
            sketch.stroke(vizMetadata.get("vizParams").bassColor);
            sketch.box(lowMidEnergy+40);

            sketch.noFill();
            sketch.stroke(vizMetadata.get("vizParams").trebleColor);
            sketch.box(trebEnergy+40);

            
            // rotate -= 0.01;
        };

        // Force stop audio, since audio occasionally keeps on playing even when the sketch is removed.
        // Is called in removeViz() in main script.
        sketch.stopAudio = () => {
            if (song != undefined) {
                song.pause();
            } else {
                console.log("song removed before assigned")
            }
            
        }

        function toggleAudio() {
            // console.log("canvas pressed");
            // console.log(song)
            if (song != undefined) {

                if (song.isPlaying()) {
                    song.pause();
                    p.html('play');
                    // sketch.noLoop();
                } else {
                    song.play();
                    p.html('pause');
                    // sketch.loop();
                }
            } else {
                console.log("song not ready")
            }
            
                       // let fs = sketch.fullscreen();
            // sketch.fullscreen(!fs);
        };
        console.log("squres ready");
    };
    return s;
}




export default boxes;