// We need to pass in a reference to the controller because we need to update other views when interacting with the canvas
function audioPlayer(controller) {
    const audioPlayer = ( sketch ) => {
        // variables bound to the sketch are accessible whereever the object is in scope
        // ex. we can modify them in the main JS file
        sketch.setup = () => {
            sketch.audioObject = new p5.SoundFile();
            sketch.audioObject.onended(() => {
                console.log("ended");
                document.querySelector("#audio-player img").src = "../assets/img/play_button.svg";
            });
            sketch.audioPlayerStatus = "not ready";
            sketch.noLoop();
        };

        // should the canvas be responsible for managing audio, or the audio player?
        /*
            separation of concerns... maybe have all the playback and audio loading be handled
            only by audio player view, then canvasview only takes in an audio object to analyze
            the audio data?

            https://p5js.org/reference/#/p5.FFT/setInput

        */
        sketch.loadAudio = (audioURL) => {
            console.log("loading audio...")
            document.querySelector("#no-song-notice").classList.remove("hidden");
            document.querySelector("#no-song-notice span").innerHTML = "loading audio...";
            // console.log(document.querySelector("#audio-player div").classList);
            if (sketch.audioObject.isPlaying()) {
                sketch.audioObject.pause();
            }
            sketch.audioPlayerStatus = "not ready";
            // prevents multiple audio objects from being created (singleton)
            sketch.audioObject.setPath(audioURL, () => {
                console.log("success")
                sketch.audioPlayerStatus = "ready";
                document.querySelector("#no-song-notice").classList.add("hidden");
                // tell audio player view that it's ready to play 
                // controller.setAudioPlayerStatus("ready");
            });
        }

        sketch.playAudio = () => {
            if (sketch.audioPlayerStatus == "ready") {
                if (!sketch.audioObject.isPlaying()) {
                    sketch.audioObject.play();
                    return "playing";
                } else {
                    sketch.audioObject.pause();
                    return "paused";
                }
            } else {
                console.log("audio not ready");
                return "not ready"
            }
            
        }
    };

    return audioPlayer;
}


export default audioPlayer;