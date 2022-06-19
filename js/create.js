import canvas from "./viz/canvas.js";
import audioPlayer from "./viz/audioPlayer.js";
import { asyncFetchTrackData } from "./modules/apiCalls.js";

(() => {
    console.log("ready");
    Parse.initialize("01t8qb2FLCXC70NIrlplthJEfFpLVhvx6RCK2S2Z", "MfK5pEk5haJ95TcyTeIkYQdodIQJ2sk1Pn3jZCXX"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";
    // MVC?
    // https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/

    // possible resources:
    // https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88
    // 
    const model = {
        /*
            Holds info that must be passed between views,
            as well as general info that doesn't belong
            to any view
        */
        
        napsterAPIKey: "ZDIxMDM1NTEtYjk3OS00YTI1LWIyYjItYjBjOWVmMWYyN2I3",

        proxyURL: "https://mighty-stream-75885.herokuapp.com",

        canvasObjects: [

        ],

        // assigned to objects
        // nextAvailableObjectID: 1,

        // selectedSongURL: null,


        canvasBackgroundColor: "#E5E5E5",

        selectedCanvasObject: null,

        audio: {
            selectedSongURL: null,
            trackName: null,
            artistName: null
        },

        chooseSongOverlayActive: !true,
        vizSubmitOverlayActive: false,
        vizSubmissionDeniedOverlayActive: !true,

        // object that will be sent to database upon submission containing all info needed to display the viz
        databaseObject: {
            vizMetadata: {
                songURL: "die",
                canvasBackgroundColor: "#E5E5E5",
                canvasWidth: null,
                canvasHeight: null,
                dbReadableCanvasObjects: []
            }
        },

        contextMenu: {
            currentMode: "audio"
            // need anything else?
        }
    };

    const objectToolbarView = {
        init() {
            document.getElementById("rectangle").addEventListener("click", () => {
                controller.storeCanvasObject(canvasView.sketch.createObject("rectangle"));
            });
            document.getElementById("ellipse").addEventListener("click", () => {
                controller.storeCanvasObject(canvasView.sketch.createObject("ellipse"));
            });
        }
        
    };

    const canvasView = {
        init(audioObject) {
            let parentWidth = document.getElementById("canvas").clientWidth;
            let parentHeight = document.getElementById("canvas").clientHeight;
            // the sketch constantly draws itself, thus, changing any member will automatically be rendered
            this.sketch = new p5(canvas(parentWidth, parentHeight, controller.getCanvasBackgroundColor(), audioObject, controller), "canvas");
            // debug
            // canvasView.sketch.createObject()
        }
    };

    const audioPlayerView = {
        init() {
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

    const contextMenuView = {
        init() {
            // save reused DOM objects
            this.designButtonDOMElem = document.querySelector("#context-menu section:nth-child(1) button:nth-child(2)");
            this.audioButtonDOMElem = document.querySelector("#context-menu section:nth-child(1) button:nth-child(1)");

            this.projectSettingsDOMElem = document.querySelector("#project-settings");
            this.objectSettingsDOMElem = document.querySelector("#object-settings");

            document.querySelector("#submit-viz").addEventListener("click", () => {
                
                if (controller.checkIfVizIsSubmittable()) {
                    controller.submitVizToDB();
                    controller.setSubmitVizOverlayActive(true);
                } else {
                    controller.setVizSubmissionDeniedOverlayActive(true);
                }
                
            });
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
                        <div id="object-fill-settings">
                            <h3>Fill</h3>
                            <div id="object-fill-input">
                                <div>
                                    <label for="object-fill-color">Color</label>
                                    <input id="object-fill-color" type="color" value=${selectedCanvasObject.fill}>
                                </div>
                            </div>
                            <div id="object-no-fill-input">
                                <div>
                                    <label for="object-no-fill">No Fill</label>
                                    <input id="object-no-fill" type="checkbox" ${selectedCanvasObject.noFill ? "checked" : ""}>
                                </div>
                            </div>
                        </div>
                        <div id="object-stroke-settings">
                            <h3>Outline</h3>
                            <div id="object-stroke-input">
                                <div>
                                    <label for="object-stroke-color">Color</label>
                                    <input id="object-stroke-color" type="color" value=${selectedCanvasObject.stroke}>
                                </div>
                            </div>
                            <div id="object-stroke-weight-input">
                                <div>
                                    <label for="object-stroke-weight">Thickness</label>
                                    <input id="object-stroke-weight" type="number" value=${selectedCanvasObject.strokeWeight}>
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

                    document.querySelector("#object-no-fill").addEventListener("change", (e) => {
                        console.log(e.currentTarget.checked);
                        controller.setSelectedCanvasObjectProperty("noFill", e.currentTarget.checked);
                    });

                    document.querySelector("#object-stroke-color").addEventListener("input", (e) => {
                        controller.setSelectedCanvasObjectProperty("stroke", e.currentTarget.value);
                    });

                    document.querySelector("#object-stroke-weight").addEventListener("input", (e) => {
                        controller.setSelectedCanvasObjectProperty("strokeWeight", Number(e.currentTarget.value));
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
                        <button>Choose Viz Song</button>
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
                    document.querySelector("#frequencies").addEventListener("input", (e) => {
                        controller.setSelectedCanvasObjectProperty("frequency", e.currentTarget.value);
                    });

                    document.querySelector("#sensitivity").addEventListener("input", (e) => {
                        controller.setSelectedCanvasObjectProperty("audioSensitivity", Number(e.currentTarget.value));
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

    const vizSubmissionDeniedOverlayView = {
        init() {
            this.overlayDOMElem = document.querySelector("#viz-submission-denied-overlay");
            // this.closeModalButtonDOMElem = document.querySelector("#close-viz-submission-denied-modal-button");
            this.vizSubmittedModalDOMElem = document.querySelector("#viz-submission-denied-modal");
            this.gotItButtonDOMElem = document.querySelector("#got-it-button");

            this.gotItButtonDOMElem.addEventListener("click", () => {
                controller.setVizSubmissionDeniedOverlayActive(false);
            });

            this.overlayDOMElem.addEventListener("mousedown", (e) => {
                // prevents overlay from disappearing when the modal is clicked
                if (this.overlayDOMElem === e.target) {
                    // put your code here
                    controller.setVizSubmissionDeniedOverlayActive(false);
                }
            });



            this.render();
        },

        render() {
            if (controller.getVizSubmissionDeniedOverlayActive()) {
                this.overlayDOMElem.style.display = "flex";
            } else {
                this.overlayDOMElem.style.display = "none";
            }
        }
        
    };

    const vizSubmittedOverlayView = {
        init() {
            this.overlayDOMElem = document.querySelector("#viz-submitted-overlay");
            this.closeModalButtonDOMElem = document.querySelector("#close-viz-submitted-modal-button");
            this.vizSubmittedModalDOMElem = document.querySelector("#viz-submitted-modal");
            this.continueWorkingButtonDOMElem = document.querySelector("#continue-working-button");
            console.log("hello world");
            this.overlayDOMElem.addEventListener("mousedown", (e) => {
                // prevents overlay from disappearing when the modal is clicked
                if (this.overlayDOMElem === e.target) {
                    // put your code here
                    controller.setSubmitVizOverlayActive(false);
                }
            });

            this.closeModalButtonDOMElem.addEventListener("click", () => {
                controller.setSubmitVizOverlayActive(false);
            });

            this.continueWorkingButtonDOMElem.addEventListener("click", () => {
                controller.setSubmitVizOverlayActive(false);
            });

            this.render();
        },
        render() {
            if (controller.getSubmitVizOverlayActive()) {
                this.overlayDOMElem.style.display = "flex";
            } else {
                this.overlayDOMElem.style.display = "none";
            }
        }
    }

    const chooseSongOverlayView = {
        init() {
            this.overlayDOMElem = document.querySelector("#choose-song-overlay");
            this.closeModalButtonDOMElem = document.querySelector("#close-modal-button");
            this.chooseSongModalDOMElem = document.querySelector("#choose-song-modal");
            this.searchSongInputDOMElem = document.querySelector("#choose-song-modal input");
            this.searchResultsDOMElem = document.querySelector("#search-results");
            this.overlayDOMElem.addEventListener("mousedown", (e) => {
                // prevents overlay from disappearing when the modal is clicked
                if (this.overlayDOMElem === e.target) {
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
                                    controller.setSelectedSongURL(track.previewURL, track.artistName, track.name);
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
            this.render();
        },

        render() {
            if (controller.getChooseSongOverlayActive()) {
                this.overlayDOMElem.style.display = "flex";
            } else {
                this.overlayDOMElem.style.display = "none";
            }
        }
    };

    // should controller decide what should be rendered, or the view?
    const controller = {
        init() {
            objectToolbarView.init();
            // Audio Player must be initialized before canvasView as canvasView requires its audio object
            audioPlayerView.init();
            canvasView.init(audioPlayerView.audioPlayer.audioObject);
            contextMenuView.init();
            chooseSongOverlayView.init();
            vizSubmittedOverlayView.init();
            vizSubmissionDeniedOverlayView.init();
            // const vizMetadata = Parse.Object.extend("vizMetadata");
            // const VizMetadata = new vizMetadata();

            // VizMetadata.save(model.databaseObject);
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

        setSelectedSongURL(songURL, artistName, trackName) {
            model.audio.selectedSongURL = songURL;
            model.audio.artistName = artistName;
            model.audio.trackName = trackName;
            audioPlayerView.audioPlayer.loadAudio(`${this.getProxyURL()}/${songURL}`);
        },

        // getAudioPlayerStatus() {
        //     return model.audioPlayerStatus;
        // },

        // setAudioPlayerStatus(status) {
        //     model.audioPlayerStatus = status;
        // },

        getSelectedCanvasObject() {
            return model.selectedCanvasObject;
        },

        // updateDBObjectProperty() {

        // },

        // runs when submit button is clicked
        submitVizToDB() {
            // {
            //     x: 10,
            //     y: 10,
            //     w: 10,
            //     h: 10,
            //     fill: "#C4C4C4",
            //     stroke: "#000000",
            //     strokeWeight: 1,
            //     frequency: "bass",
            //     audioSensitivity: 1,
            //     transparent: false
            // }
            // load all info into the database object
            model.databaseObject.vizMetadata.songURL = model.audio.selectedSongURL;
            model.databaseObject.vizMetadata.artistName = model.audio.artistName;
            model.databaseObject.vizMetadata.trackName = model.audio.trackName;
            model.databaseObject.vizMetadata.canvasBackgroundColor = model.canvasBackgroundColor;
            let parentWidth = document.getElementById("canvas").clientWidth;
            let parentHeight = document.getElementById("canvas").clientHeight;
            model.databaseObject.vizMetadata.canvasWidth = parentWidth;
            model.databaseObject.vizMetadata.canvasHeight = parentHeight;
            // clear the array, find more efficient method later
            model.databaseObject.vizMetadata.dbReadableCanvasObjects = []
            model.canvasObjects.forEach(obj => {
                let dbReadableObject = {}
                dbReadableObject.shapeType = obj.shapeType;
                dbReadableObject.x = obj.x;
                dbReadableObject.y = obj.y;
                dbReadableObject.w = obj.w;
                dbReadableObject.h = obj.h;
                dbReadableObject.fill = obj.fill;
                dbReadableObject.stroke = obj.stroke;
                dbReadableObject.strokeWeight = obj.strokeWeight;
                dbReadableObject.frequency = obj.frequency;
                dbReadableObject.audioSensitivity = obj.audioSensitivity;
                dbReadableObject.noFill = obj.noFill;
                model.databaseObject.vizMetadata.dbReadableCanvasObjects.push(dbReadableObject);
            });

            console.log(model.databaseObject);
            // send to DB
            const vizMetadata = Parse.Object.extend("vizMetadata");
            const VizMetadata = new vizMetadata();

            VizMetadata.save(model.databaseObject);
        },

        setSelectedCanvasObjectProperty(property, value) {
            // console.log(value);
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

        storeCanvasObject(object) {
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
        },

        setSubmitVizOverlayActive(active) {
            model.vizSubmitOverlayActive = active;
            vizSubmittedOverlayView.render();
        }, 

        getSubmitVizOverlayActive() {
            return model.vizSubmitOverlayActive;
        },

        setVizSubmissionDeniedOverlayActive(active) {
            model.vizSubmissionDeniedOverlayActive = active;
            vizSubmissionDeniedOverlayView.render();
        },

        getVizSubmissionDeniedOverlayActive() {
            return model.vizSubmissionDeniedOverlayActive;
        },

        checkIfVizIsSubmittable() {
            // maybe if no objects it canvas?
            if (model.audio.selectedSongURL != null) {
                return true;
            }
            return false;
        }
    }

    

    controller.init();
    

    
    // need like a welcome to the project screen
    // maybe welcome page on navbar 

})();