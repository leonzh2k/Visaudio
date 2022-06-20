import audioPlayer from "../viz/audioPlayer.js";
const audioPlayerView = {
    init(controller) {
        this.audioPlayer = new p5(audioPlayer(controller), "audio-player-canvas-wrapper");
        this.playAudioButtonDomElem = document.querySelector("#audio-player img");
        
        
        this.playAudioButtonDomElem.addEventListener("click", () => {
            switch (this.audioPlayer.playAudio()) {
                case ("playing"):
                    this.playAudioButtonDomElem.src = "./assets/img/pause_button.svg";
                    break;
                case ("paused"):
                    this.playAudioButtonDomElem.src = "./assets/img/play_button.svg";
                    break;
                case ("not ready"):
                    break;
            }
        
        });
        // console.log(this.audioPlayer.audioObject)
    },

    render() {
        // if (audioStatus == "ready")
    }
};

export default audioPlayerView;