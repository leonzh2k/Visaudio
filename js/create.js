import canvas from "../viz/canvas.js";
import { asyncFetchTrackData } from "../modules/apiCalls.js";
(() => {
    console.log("ready");
    // MVC?
    // https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/

    // possible resources:
    // https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88
    // 
    const model = {
        // info about state
        /*
            knows about all objects (their positions on canvas, color, etc.)
            knows about current song (playback position)
            knows about wht context menu is on

            ?????
        */
        
        napsterAPIKey: "ZDIxMDM1NTEtYjk3OS00YTI1LWIyYjItYjBjOWVmMWYyN2I3",

        proxyURL: "https://cors-anywhere.herokuapp.com/",

        canvasObjects: [

        ],

        selectedSongURL: null,

        canvasBackgroundColor: "#E5E5E5",

        selectedCanvasObject: null,

        audio: {

        },

        chooseSongOverlayActive: false,

        // object that will be sent to database upon submission containing all info needed to display the viz
        databaseObject: {

        },

        contextMenu: {
            currentMode: "audio"
            // need anything else?
        }
    };

    const objectToolbarView = {
        init() {
            document.getElementById("square").addEventListener("click", () => {
                controller.pushObject(canvasView.sketch.createObject());
            });
        
        }
        
    }

    const canvasView = {
        init() {
            let parentWidth = document.getElementById("canvas").clientWidth;
            let parentHeight = document.getElementById("canvas").clientHeight;
            // the sketch constantly draws itself, thus, changing any member will automatically be rendered
            this.sketch = new p5(canvas("https://cors-anywhere.herokuapp.com", parentWidth, parentHeight, controller.getCanvasBackgroundColor(), controller), "canvas");
        }
    }

    const contextMenuView = {
        init() {
            // save reused DOM objects
            this.designButtonDOMElem = document.querySelector("#context-menu section:nth-child(1) button:nth-child(2)");
            this.audioButtonDOMElem = document.querySelector("#context-menu section:nth-child(1) button:nth-child(1)");

            this.projectSettingsDOMElem = document.querySelector("#project-settings");
            this.objectSettingsDOMElem = document.querySelector("#object-settings");

            // Event listeners

            // switch to design properties button
            this.designButtonDOMElem.addEventListener("click", (e) => {
                controller.updateContextMenuMode("design");
            });

            // switch to audio properties button
            this.audioButtonDOMElem.addEventListener("click", () => {
                controller.updateContextMenuMode("audio");
            });

            // could we call render() instead to automatically perform these?
            this.render();
        },

        render() {
            // check context menu mode
            // maybe can implement something to prevent re-rendering if the same mode is clicked
            if (controller.getContextMenuMode() == "design") {
                this.lightenButton(this.designButtonDOMElem);
                this.darkenButton(this.audioButtonDOMElem);
                // render canvas background settings
                
                this.projectSettingsDOMElem.innerHTML = `
                    <h2>PROJECT</h2>
                    <div id="project-color-settings">
                        <h3>Color</h3>
                        <div>
                            <label for="canvas-color-input">Background Color</label>
                            <input id="canvas-color-input" type="color" value=${controller.getCanvasBackgroundColor()}>
                        </div>
                    </div>
                `;
                // attach event listeners on color picker
                // should there be an interface between this and the canvas?
                document.querySelector("#canvas-color-input").addEventListener("input", (e) => {
                    // canvasView.sketch.backgroundColor = e.currentTarget.value;
                    controller.updateCanvasBackgroundColor(e.currentTarget.value);
                })

                const selectedCanvasObject = controller.getSelectedCanvasObject();
                
                if (selectedCanvasObject != null) {
                    this.objectSettingsDOMElem.innerHTML = `
                        <h2>SHAPES</h2>
                        <div id="size-and-position-settings">
                            <h3>Size & Position</h3>
                            <div id="size-and-position-input">
                                <div id="position">
                                    <div>
                                        <label for="x-coord">X</label>
                                        <input id="x-coord" type="number" value="${selectedCanvasObject.x}">
                                    </div>
                                    <div>
                                        <label for="y-coord">Y</label>
                                        <input id="y-coord" type="number" value="${selectedCanvasObject.y}">
                                    </div>
                                </div>
                                <div id="size">
                                    <div>
                                        <label for="width">W</label>
                                        <input id="width" type="number" value="${selectedCanvasObject.w}">
                                    </div>
                                    <div>
                                        <label for="height">H</label>
                                        <input id="height" type="number" value="${selectedCanvasObject.h}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="object-color-settings">
                            <h3>Color</h3>
                            <div id="object-color-input">
                                <div>
                                    <label for="object-fill-color">Fill</label>
                                    <input id="object-fill-color" type="color" value=${selectedCanvasObject.fill}>
                                </div>
                                <div>
                                    <label for="object-stroke-color">Stroke</label>
                                    <input id="object-stroke-color" type="color" value=${selectedCanvasObject.stroke}>
                                </div>
                            </div>
                        </div>
                    `

                    // event listeners on input fields
                    document.querySelector("#x-coord").addEventListener("input", (e) => {
                        // must be casted to a Number as this property is a number
                        controller.setSelectedCanvasObjectProperty("x", Number(e.currentTarget.value));
                    });

                    document.querySelector("#y-coord").addEventListener("input", (e) => {
                        // must be casted to a Number as this property is a number
                        controller.setSelectedCanvasObjectProperty("y", Number(e.currentTarget.value));
                    });
                        
                    document.querySelector("#width").addEventListener("input", (e) => {
                        // must be casted to a Number as this property is a number
                        controller.setSelectedCanvasObjectProperty("w", Number(e.currentTarget.value));
                    });
                        
                    document.querySelector("#height").addEventListener("input", (e) => {
                        // must be casted to a Number as this property is a number
                        controller.setSelectedCanvasObjectProperty("h", Number(e.currentTarget.value));
                    });

                    document.querySelector("#object-fill-color").addEventListener("input", (e) => {
                        controller.setSelectedCanvasObjectProperty("fill", e.currentTarget.value);
                    });

                    document.querySelector("#object-stroke-color").addEventListener("input", (e) => {
                        controller.setSelectedCanvasObjectProperty("stroke", e.currentTarget.value);
                    });
                } else {
                    this.objectSettingsDOMElem.innerHTML = `
                        <h2>SHAPES</h2>
                        <div id="no-shape-selected">
                            No shape selected
                        </div> 
                    `
                }
            } else {
                this.lightenButton(this.audioButtonDOMElem);
                this.darkenButton(this.designButtonDOMElem);
                // render project audio settings

                this.projectSettingsDOMElem.innerHTML = `
                    <h2>PROJECT</h2>
                    <div id="project-song-settings">
                        <h3>Song</h3>
                        <button>Change Viz Song</button>
                    </div>
                `;

                document.querySelector("#project-song-settings button").addEventListener("click", () => {
                    controller.setChooseSongOverlayActive(true);
                });

                

                const selectedCanvasObject = controller.getSelectedCanvasObject();
                if (selectedCanvasObject != null) {
                    // add custom later
                    this.objectSettingsDOMElem.innerHTML = `
                        <h2>SHAPES</h2>
                        <div id="object-frequency-settings">
                            <h3>Frequency</h3>
                            <select name="frequencies" id="frequencies">
                                <option value="bass" ${selectedCanvasObject.frequency === "bass" ? "selected" : ""}>bass</option>
                                <option value="treble" ${selectedCanvasObject.frequency === "treble" ? "selected" : ""}>treble</option>
                            </select>
                        </div>
                        <div id="object-sensitivity-settings">
                            <h3>Audio Sensitivity</h3>
                            <input id="sensitivity" type="range" min="0" max="10" value="${selectedCanvasObject.audioSensitivity}">
                        </div>
                    `

                    // add event listeners for inputs
                    document.querySelector("#frequencies").addEventListener("change", (e) => {
                        controller.setSelectedCanvasObjectProperty("frequency", e.currentTarget.value);
                    });

                    document.querySelector("#sensitivity").addEventListener("change", (e) => {
                        controller.setSelectedCanvasObjectProperty("audioSensitivity", e.currentTarget.value);
                    });
                } else {
                    this.objectSettingsDOMElem.innerHTML = `
                        <h2>SHAPES</h2>
                        <div id="no-shape-selected">
                            No shape selected
                        </div> 
                    `
                }
            }

        },

        lightenButton(domElem) {
            domElem.classList.remove("not-selected");
            domElem.classList.add("selected");
        },

        darkenButton(domElem) {
            domElem.classList.remove("selected");
            domElem.classList.add("not-selected");
        }
    };

    const chooseSongOverlayView = {
        init() {
            this.overlayDOMElem = document.querySelector("#choose-song-overlay");
            this.closeModalButtonDOMElem = document.querySelector("#close-modal-button");
            this.chooseSongModalDOMElem = document.querySelector("#choose-song-modal");
            this.searchSongInputDOMElem = document.querySelector("#choose-song-modal input");
            this.searchResultsDOMElem = document.querySelector("#search-results");
            this.overlayDOMElem.addEventListener("mousedown", (e) => {
                // prevents overlay from disappearing when the modal is clicked
                if(this.overlayDOMElem === e.target) {
                    // put your code here
                    controller.setChooseSongOverlayActive(false);
                }
            });

            this.closeModalButtonDOMElem.addEventListener("click", () => {
                controller.setChooseSongOverlayActive(false);
            });

            

            this.searchSongInputDOMElem.addEventListener("keypress", async (e) => {
                if (e.key === "Enter") {
                    const songToSearch = e.currentTarget.value;
                    if (songToSearch !== "") {
                        console.log("SUBMIT");
                        this.searchResultsDOMElem.style.display = "none";
                        // clear previous results
                        this.searchResultsDOMElem.innerHTML = "";
                        
                        asyncFetchTrackData(controller.getNapsterAPIKey(), songToSearch).then(searchResults => {
                            console.log(searchResults);
                            // figure out which tracks are playable and which aren't 
                            searchResults.search.data.tracks.forEach(track => {
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
                                    controller.setSelectedSongURL(track.previewURL);
                                });
                                
                                
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
        },

        render() {
            if (controller.getChooseSongOverlayActive()) {
                this.overlayDOMElem.style.display = "flex";
            } else {
                this.overlayDOMElem.style.display = "none";
            }
        }
    }

    // should controller decide what should be rendered, or the view?
    const controller = {
        init() {
            objectToolbarView.init();
            canvasView.init();
            contextMenuView.init();
            chooseSongOverlayView.init();
        },

        getContextMenuMode() {
            return model.contextMenu.currentMode;
        },

        // should I combine this with update ContextMenumode?
        setContextMenuMode(mode) {
            model.contextMenu.currentMode = mode;
        },

        getNapsterAPIKey() {
            return model.napsterAPIKey;
        },

        getProxyURL() {
            return model.proxyURL;
        },

        setSelectedSongURL(songURL) {
            model.selectedSongURL = songURL;
            canvasView.sketch.loadAudio(controller.getProxyURL() + songURL);
        },

        getSelectedCanvasObject() {
            return model.selectedCanvasObject;
        },

        setSelectedCanvasObjectProperty(property, value) {
            console.log(value);
            model.selectedCanvasObject[property] = value;
        },

        setSelectedCanvasObject(newSelection) {
            model.selectedCanvasObject = newSelection;
        },

        setCanvasBackgroundColor(newColor) {
            model.canvasBackgroundColor = newColor;
        },

        getCanvasBackgroundColor() {
            return model.canvasBackgroundColor;
        },

        updateCanvasBackgroundColor(newColor) {
            canvasView.sketch.backgroundColor = newColor; // update color shown on canvas
            this.setCanvasBackgroundColor(newColor);
        },

        pushObject(object) {
            model.canvasObjects.push(object);
            // console.log(model.canvasObjects);
        },

        updateSelectedCanvasObject(newSelection) {
            this.setSelectedCanvasObject(newSelection);
            // console.log(newSelection);
            contextMenuView.render();
        },

        updateContextMenuMode(newMode) {
            // should deciding whether to call render or not handled in View?
            if (this.getContextMenuMode() !== newMode) {
                this.setContextMenuMode(newMode);
                // switch to design properties 
                console.log("switch to ", newMode);
                // render right views
                // should controller decide what should be rendered, or the view?
                contextMenuView.render();
            } else {
                console.log("clicked on mode currently on");
            }
        },

        setChooseSongOverlayActive(active) {
            model.chooseSongOverlayActive = active;
            chooseSongOverlayView.render();
        }, 

        getChooseSongOverlayActive() {
            return model.chooseSongOverlayActive;
        }
    }

    

    controller.init();
    

    
    

})();