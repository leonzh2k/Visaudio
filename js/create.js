import canvas from "../viz/canvas.js";
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
        canvasObjects: [

        ],

        canvasBackgroundColor: "#E5E5E5",

        selectedCanvasObject: null,

        audio: {

        },

        // object that will be sent to database upon submission containing all info needed to display the viz
        databaseObject: {

        },

        contextMenu: {
            currentMode: "design"
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
            this.designButtonDOMElem = document.querySelector("#context-menu section:nth-child(1) button:nth-child(1)");
            this.audioButtonDOMElem = document.querySelector("#context-menu section:nth-child(1) button:nth-child(2)");

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
                                    <input id="object-fill-color" type="color" value="${selectedCanvasObject.fill}">
                                </div>
                                <div>
                                    <label for="object-stroke-color">Stroke</label>
                                    <input id="object-stroke-color" type="color" value="${selectedCanvasObject.stroke}">
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

                if (controller.getSelectedCanvasObject() != null) {
                    this.objectSettingsDOMElem.innerHTML = `
                        <h2>SHAPES</h2>
                        <div id="object-frequency-settings">
                            <h3>Frequency</h3>
                            <select name="frequencies" id="frequencies">
                                <option value="bass">bass</option>
                                <option value="treble">treble</option>
                                <option value="custom">custom</option>
                            </select>
                        </div>
                        <div id="object-sensitivity-settings">
                            <h3>Audio Sensitivity</h3>
                            <input type="range">
                        </div>
                    `
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

    // should controller decide what should be rendered, or the view?
    const controller = {
        init() {
            objectToolbarView.init();
            canvasView.init();
            contextMenuView.init();
        },

        getContextMenuMode() {
            return model.contextMenu.currentMode;
        },

        // should I combine this with update ContextMenumode?
        setContextMenuMode(mode) {
            model.contextMenu.currentMode = mode;
        },

        getSelectedCanvasObject() {
            return model.selectedCanvasObject;
        },

        setSelectedCanvasObjectProperty(property, value) {
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
        }
    };

    

    controller.init();
    

    
    

})();