const chooseSongOverlayView = {
    init(controller) {
        this.controller = controller;
        this.overlayDOMElem = document.querySelector("#choose-song-overlay");
        this.closeModalButtonDOMElem = document.querySelector("#close-modal-button");
        this.chooseSongModalDOMElem = document.querySelector("#choose-song-modal");
        this.searchSongInputDOMElem = document.querySelector("#choose-song-modal input");
        this.searchResultsDOMElem = document.querySelector("#search-results");
        this.overlayDOMElem.addEventListener("mousedown", (e) => {
            // prevents overlay from disappearing when the modal is clicked
            if (this.overlayDOMElem === e.target) {
                // put your code here
                this.controller.setChooseSongOverlayActive(false);
            }
        });

        this.closeModalButtonDOMElem.addEventListener("click", () => {
            this.controller.setChooseSongOverlayActive(false);
        });

        this.searchSongInputDOMElem.addEventListener("keypress", async (e) => {
            if (e.key === "Enter") {
                const songToSearch = e.currentTarget.value;
                if (songToSearch !== "") {
                    console.log("SUBMIT");
                    this.searchResultsDOMElem.style.display = "none";
                    // clear previous results
                    this.searchResultsDOMElem.innerHTML = "";
                    
                    const response = await fetch(`https://api.napster.com/v2.2/search?apikey=ZDIxMDM1NTEtYjk3OS00YTI1LWIyYjItYjBjOWVmMWYyN2I3&query=${songToSearch}&type=track`);

                    const results = await response.json();
                    console.log(results);
                    // figure out which tracks are playable and which aren't 
                    results.search.data.tracks.forEach(track => {
                        let song = document.createElement("div");
                        song.innerHTML = `${track.artistName} - ${track.name}`;
                        this.searchResultsDOMElem.appendChild(song);

                        let audioObj = new Audio(track.previewURL);
                        audioObj.addEventListener("error", () => {
                            song.remove();
                        });

                        song.addEventListener("click", () => {
                            document.querySelector("#current-song span").innerHTML = `${track.artistName} - ${track.name}`;
                            // update model current selected song
                            this.controller.setSelectedSongURL(track.previewURL, track.artistName, track.name);
                        });
                        
                        
                    });
                    /*
                        Show results after all the unplayable songs are filtered out.
                        What's the maximum time that we can wait before showing the results
                        without sacrificing user experience?
                    */
                    setTimeout(() => {
                        this.searchResultsDOMElem.style.display = "block";
                    }, 1000);
                    console.log("done");
                }
            }
        });
        this.render();
    },

    render() {
        if (this.controller.getChooseSongOverlayActive()) {
            this.overlayDOMElem.style.display = "flex";
        } else {
            this.overlayDOMElem.style.display = "none";
        }
    }
};

export default chooseSongOverlayView;