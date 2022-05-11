import galleryCanvas from "./viz/galleryCanvas.js";
(() => {

    Parse.initialize("01t8qb2FLCXC70NIrlplthJEfFpLVhvx6RCK2S2Z", "MfK5pEk5haJ95TcyTeIkYQdodIQJ2sk1Pn3jZCXX"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = "https://parseapi.back4app.com/";
    
    let main = document.querySelector('main');
    let gallery = document.querySelector('#gallery');

    let viewGallery = document.querySelector("header nav li:first-child");
    // let createViz = document.querySelector("header nav li:last-child");

    let currentViz;

    const vizNavigator = {
        vizzes: [],

        displayViz(vizIndex) {
            displayVizInViewViz(this.vizzes[vizIndex], vizIndex);
        }
    };

    let state = "gallery";
    // switch to gallery if not already in gallery
    viewGallery.addEventListener("click", () => {
        if (state !== "gallery") {
            console.log("switching to gallery viz")
            fetchAndDisplayVizInGallery();
			state = "gallery";
        }
    });

    async function fetchAndDisplayVizInGallery() {
        // clear everything before doing anything else
        removeViz();
        emptyElement([main, gallery]);  
        let results = await fetchVizData();
        showVizInGallery(results);
    }

    async function fetchVizData() {
        console.log("fetch data")
        const vizMetadata = Parse.Object.extend('vizMetadata');
        const query = new Parse.Query(vizMetadata);
        // results shown by most recent order
        const results = await query.descending('createdAt').find();
        
        vizNavigator.vizzes = results;        
        return results;
    }

    
    
    function showVizInGallery(vizMetadata) {
        for (let i = 0; i < vizMetadata.length; i++) {
            let vizThumbnail = document.createElement("div");
            vizThumbnail.addEventListener("click", () => {
                console.log("switching to view viz")
        
                displayVizInViewViz(vizMetadata[i], i);
                // console.log(vizMetadata[i].get("vizParams"));
                state = "view";
            });
            let thumbnail = document.createElement("img");
            // console.log(vizMetadata[i].attributes.vizThumbnail);
            // error checking if thumbnail doesn't exist?
            if (!vizMetadata[i].attributes.vizThumbnail) {
                console.log("thumbnail no exist");
            } else {
                thumbnail.src = vizMetadata[i].get("vizThumbnail").url();
            }
            vizThumbnail.appendChild(thumbnail);
            gallery.appendChild(vizThumbnail);
        }

        main.append(gallery);
    }

    function removeViz() {
        if (currentViz) {
            console.log("removing sketch");
            currentViz.stopAudio();
            currentViz.remove();
            document.querySelector("body").style.backgroundColor = "black";
        }
    }

    // clears all child elements of each element in ele array
    // also cleans up any p5 sketch on the screen
    function emptyElement(elements) {
        for (let i = 0; i < elements.length; i++) {
            let child = elements[i].firstElementChild;
            while (child) {
                elements[i].removeChild(child);
                child = elements[i].firstElementChild;
            }
        }
    }

    function displayVizInViewViz(vizMetadata, vizIndex) {
        removeViz();
        // console.log(vizMetadata);
        // console.log("viz data: ", vizMetadata.get("vizMetadata").dbReadableCanvasObjects);
        emptyElement([main, gallery]);
        
        let section = document.createElement("section");
        section.id = "view-viz";
        main.appendChild(section);
        // for local dev, use the demo server, for production, use my own server
        // https://mighty-stream-75885.herokuapp.com
        // https://cors-anywhere.herokuapp.com

        currentViz = new p5(galleryCanvas(vizMetadata.get("vizMetadata"), vizIndex, vizNavigator, "https://cors-anywhere.herokuapp.com"), "view-viz");
    }

    

    fetchAndDisplayVizInGallery();
    
})();