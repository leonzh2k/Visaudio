import canvas from "../viz/canvas.js";
(() => {
    console.log("ready");
    // MVC?


    // possible resources:
    // https://editor.p5js.org/codingtrain/sketches/U0R5B6Z88
    // 
    let model = {
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

        }
    };

    let view = {

    };

    let controller = {

    };

    

    console.log(document.getElementById("canvas").clientWidth)

    let parentWidth = document.getElementById("canvas").clientWidth;
    let parentHeight = document.getElementById("canvas").clientHeight;
    let sketch = new p5(canvas("https://cors-anywhere.herokuapp.com", parentWidth, parentHeight), "canvas");

    document.getElementById("square").addEventListener("click", () => {
        sketch.createObject();
    })
})();