const contextMenuView = {
    init(controller) {
        this.controller = controller;
        // save reused DOM objects
        this.designButtonDOMElem = document.querySelector("#context-menu section:nth-child(1) button:nth-child(2)");
        this.audioButtonDOMElem = document.querySelector("#context-menu section:nth-child(1) button:nth-child(1)");

        this.projectSettingsDOMElem = document.querySelector("#project-settings");
        this.objectSettingsDOMElem = document.querySelector("#object-settings");

        document.querySelector("#submit-viz").addEventListener("click", () => {
            
            if (this.controller.checkIfVizIsSubmittable()) {
                this.controller.submitVizToDB();
                this.controller.setSubmitVizOverlayActive(true);
            } else {
                this.controller.setVizSubmissionDeniedOverlayActive(true);
            }
            
        });
        // Event listeners

        // switch to design properties button
        this.designButtonDOMElem.addEventListener("click", (e) => {
            this.controller.updateContextMenuMode("design");
        });

        // switch to audio properties button
        this.audioButtonDOMElem.addEventListener("click", () => {
            this.controller.updateContextMenuMode("audio");
        });

        // could we call render() instead to automatically perform these?
        this.render();
    },

    render() {
        // check context menu mode
        // maybe can implement something to prevent re-rendering if the same mode is clicked
        if (this.controller.getContextMenuMode() == "design") {
            this.lightenButton(this.designButtonDOMElem);
            this.darkenButton(this.audioButtonDOMElem);
            // render canvas background settings
            
            this.projectSettingsDOMElem.innerHTML = `
                <h2>PROJECT</h2>
                <div id="project-color-settings">
                    <h3>Color</h3>
                    <div>
                        <label for="canvas-color-input">Background Color</label>
                        <input id="canvas-color-input" type="color" value=${this.controller.getCanvasBackgroundColor()}>
                    </div>
                </div>
            `;

            // attach event listeners on color picker
            document.querySelector("#canvas-color-input").addEventListener("input", (e) => {
                // canvasView.sketch.backgroundColor = e.currentTarget.value;
                this.controller.updateCanvasBackgroundColor(e.currentTarget.value);
            })

            const selectedCanvasObject = this.controller.getSelectedCanvasObject();
            
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
                    this.controller.setSelectedCanvasObjectProperty("x", Number(e.currentTarget.value));
                });

                document.querySelector("#y-coord").addEventListener("input", (e) => {
                    // must be casted to a Number as this property is a number
                    this.controller.setSelectedCanvasObjectProperty("y", Number(e.currentTarget.value));
                });
                    
                document.querySelector("#width").addEventListener("input", (e) => {
                    // must be casted to a Number as this property is a number
                    this.controller.setSelectedCanvasObjectProperty("w", Number(e.currentTarget.value));
                });
                    
                document.querySelector("#height").addEventListener("input", (e) => {
                    // must be casted to a Number as this property is a number
                    this.controller.setSelectedCanvasObjectProperty("h", Number(e.currentTarget.value));
                });

                document.querySelector("#object-fill-color").addEventListener("input", (e) => {
                    this.controller.setSelectedCanvasObjectProperty("fill", e.currentTarget.value);
                });

                document.querySelector("#object-no-fill").addEventListener("change", (e) => {
                    console.log(e.currentTarget.checked);
                    this.controller.setSelectedCanvasObjectProperty("noFill", e.currentTarget.checked);
                });

                document.querySelector("#object-stroke-color").addEventListener("input", (e) => {
                    this.controller.setSelectedCanvasObjectProperty("stroke", e.currentTarget.value);
                });

                document.querySelector("#object-stroke-weight").addEventListener("input", (e) => {
                    this.controller.setSelectedCanvasObjectProperty("strokeWeight", Number(e.currentTarget.value));
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
                this.controller.setChooseSongOverlayActive(true);
            });

            

            const selectedCanvasObject = this.controller.getSelectedCanvasObject();
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
                    this.controller.setSelectedCanvasObjectProperty("frequency", e.currentTarget.value);
                });

                document.querySelector("#sensitivity").addEventListener("input", (e) => {
                    this.controller.setSelectedCanvasObjectProperty("audioSensitivity", Number(e.currentTarget.value));
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

export default contextMenuView;