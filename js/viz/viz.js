// functions to be bound to p5 instance for any viz type
export function bindBoilerplateFunctions(sketch) {
    /*
        Force stop audio, since audio occasionally keeps on playing even when the sketch is removed.
        Is called in removeViz() in main script.
    */
    sketch.stopAudio = () => {
        if (sketch.song != undefined) {
            sketch.song.pause();
        } else {
            console.log("song removed before audio was loaded.")
        }
        
    }

    // sketch.dumb = "hi";


    return sketch;
}

// export function toggleAudio(sketch) {
//     if (sketch.song != null) {
//         if (sketch.song.isPlaying()) {
//             sketch.song.pause();
//             p.html('play');
//             // sketch.noLoop();
//         } else {
//             sketch.song.play();
//             p.html('pause');
//             // sketch.loop();
//         }
//     } else {
//         console.log("song not ready")
//     }
    
//                // let fs = sketch.fullscreen();
//     // sketch.fullscreen(!fs);
// };