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
        objects: [

        ],

        audio: {

        },

        // object that will be sent to database upon submission containing all info needed to display the viz
        databaseObject: {

        },

        contextMenu: {
            currentMode: "design"
        }
    };

    const objectToolbarView = {
        init() {
            document.getElementById("square").addEventListener("click", () => {
                canvasView.sketch.createObject();
            });
        
        }
        
    }

    const canvasView = {
        init() {
            let parentWidth = document.getElementById("canvas").clientWidth;
            let parentHeight = document.getElementById("canvas").clientHeight;
            let sketch = new p5(canvas("https://cors-anywhere.herokuapp.com", parentWidth, parentHeight), "canvas");
        }
    }

    const contextMenuView = {
        init() {
            // switch to design properties button
            document.querySelector("#context-menu section:nth-child(1) button:nth-child(1)").addEventListener("click", (e) => {
                controller.updateContextMenuMode("design");
            });

            // switch to audio properties button
            document.querySelector("#context-menu section:nth-child(1) button:nth-child(2)").addEventListener("click", () => {
                controller.updateContextMenuMode("audio");
            });
        },
        render() {

        }
    };

    const controller = {
        init() {
            objectToolbarView.init();
            canvasView.init();
            contextMenuView.init();
        },
        updateContextMenuMode(newMode) {
            if (model.contextMenu.currentMode !== newMode) {
                model.contextMenu.currentMode = newMode;
                // switch to design properties 
                console.log("switch to ", newMode);
                // render right views
            } else {
                console.log("clicked on mode currently on");
            }
        }
    };

    

    controller.init();
    

    
    

})();