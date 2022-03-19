function squares(vizMetadata) {
    const s = ( sketch ) => {
        let rotate = 0;
        let windowHeight = window.innerHeight;
        let songName = `https://cors-anywhere.herokuapp.com/${vizMetadata.get("vizParams").songUrl}`;
        let song;
        let fft;
        let audioLoading = true;
        sketch.preload = () => {

            console.log("load");
            sketch.soundFormats('mp3');
            // var request = new XMLHttpRequest();
            // request.open('GET', songName);
            // request.responseType = 'blob';
            // // I put "XMLHttpRequest" here, but you can use anything you want.
            // request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            // request.onload = function() {
            //     // alert(x.responseText);
            //     // console.log(request);
            //     // var url = URL.createObjectURL(request.response);
            //     // console.log(url);
            //     // song = new Audio(url);
            //     song = sketch.loadSound(request.response);
            //     console.log("song ready")
            // };
            // request.send();

            console.log("preload done")
        }
        sketch.setup = () => {
            console.log("setup")
            let cnv = sketch.createCanvas(document.getElementById("view-viz").clientWidth, windowHeight / 1.2);
            cnv.mousePressed(toggleAudio);
            

            fft = new p5.FFT();
            sketch.rectMode(sketch.CENTER);
            
            // var request = new XMLHttpRequest();
            // request.open('GET', songName);
            // request.responseType = 'blob';
            // // I put "XMLHttpRequest" here, but you can use anything you want.
            // request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            // request.onload = function() {
            //     song = sketch.loadSound(request.response);
            //     audioLoading = false;
            //     console.log("song ready")
            // };
            // request.send();
        };
    
        sketch.windowResized = () => {
            windowHeight = window.innerHeight;
            sketch.resizeCanvas(document.getElementById("view-viz").clientWidth, windowHeight / 1.2);
            console.log("resize");
        };
    
        sketch.draw = () => {
            // console.log("draw");
            sketch.background(0); // clears previous drawings (without it would keep)
            sketch.fill(255);
            
            sketch.textSize(21);
            sketch.text(`${vizMetadata.get("vizParams").artist} - ${vizMetadata.get("vizParams").songTitle} `, 50, windowHeight / 1.3);

            fft.analyze();
            let trebEnergy = fft.getEnergy("treble");
            let lowMidEnergy = fft.getEnergy("lowMid");

            sketch.translate(document.getElementById("view-viz").clientWidth / 2, windowHeight / (2 * 1.2));

            if (audioLoading) {
                sketch.textSize(32);
                sketch.text("LOADING...", 0-75, 0);
            }

            sketch.rotate(-rotate);
            sketch.noFill();
            sketch.stroke(vizMetadata.get("vizParams").bassColor);
            sketch.rect(0,0,lowMidEnergy+40,lowMidEnergy+40);

            sketch.rotate(rotate*2);
            sketch.noFill();
            sketch.stroke(vizMetadata.get("vizParams").trebleColor);
            sketch.rect(0,0,trebEnergy+40,trebEnergy+40);

            
            rotate -= 0.01;
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
            console.log("canvas pressed");
            console.log(song)
            if (song != undefined) {

                if (song.isPlaying()) {
                    song.pause();
                    // sketch.noLoop();
                } else {
                    song.play();
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




export default squares;