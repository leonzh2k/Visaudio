import appConfig from "./appConfig.js";
import galleryCanvas from "./viz/galleryCanvas.js";
import thumbnailCanvas from "./viz/thumbnailCanvas.js";
(() => {

    Parse.initialize(appConfig.BACK4APP_APP_ID, appConfig.BACK4APP_JS_KEY); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
    Parse.serverURL = appConfig.BACK4APP_SERVER_URL;
    
    const model = {
        galleryViewMode: {
            curr: "overview",
            prev: null
        },
        vizData: null,
        vizDataSize: null,
        currentViz: null,
        previousViz: null,
        nextViz: null,
        currentVizIndex: null
    };

    const navbarView = {
        init() {
            const viewGalleryButtonDOMEle = document.querySelector("header nav li:first-child");
            viewGalleryButtonDOMEle.addEventListener("click", () => {
                controller.setGalleryViewMode("overview");
            });
        }
    };

    // view that contains both the 
    const galleryWrapperView = {
        init() {
            this.mainDOMEle = document.querySelector('main');
            this.galleryDOMEle = document.querySelector('#gallery');
            this.render();
        },

        render() {
            const galleryViewMode = controller.getGalleryViewMode();
            console.log(galleryViewMode)
            if (galleryViewMode.prev === galleryViewMode.curr) {
                return
            }
            this.mainDOMEle.innerHTML = "";
            this.galleryDOMEle.innerHTML = "";
            switch (galleryViewMode.curr) {
                case ("overview"):
                    console.log("overview");
                    galleryOverviewView.render();
                    break;
                case ("individual"):
                    console.log("individual");
                    galleryIndividualView.render();
                    break;
            }
        }
    }

    const galleryOverviewView = {
        init() {
            this.mainDOMEle = document.querySelector('main');
            this.galleryDOMEle = document.querySelector('#gallery');
        },

        render() {
            this.mainDOMEle.append(this.galleryDOMEle);
            const vizData = controller.getVizData();
            for (let i = 0; i < vizData.length; i++) {
                let vizThumbnail = document.createElement("div");
                vizThumbnail.id = `viz-thumbnail-${i}`;
                this.galleryDOMEle.appendChild(vizThumbnail);
                let thumbnailWidth = document.getElementById(vizThumbnail.id).clientWidth;
                let thumbnailHeight = document.getElementById(vizThumbnail.id).clientHeight;
                // do the canvas thumbnail creation here
                vizThumbnail.addEventListener("click", () => {
                    console.log("viewing an individual viz now.")
                    // displayVizInViewViz(vizData[i], i);
                    if (i != 0) {
                        controller.setPreviousViz(vizData[i - 1].get("vizMetadata"));
                    } else {
                        controller.setPreviousViz(null)
                    }
            
                    controller.setCurrentViz(vizData[i].get("vizMetadata"));

                    if (i != vizData.length - 1) {
                        controller.setNextViz(vizData[i + 1].get("vizMetadata"));
                    } else {
                        controller.setNextViz(null)
                    }

                    controller.setCurrentVizIndex(i);
                    controller.setGalleryViewMode("individual");
                });
                new p5(thumbnailCanvas(vizData[i].get("vizMetadata"), thumbnailWidth, thumbnailHeight), vizThumbnail.id);
            }
        }
    };

    const galleryIndividualView = {
        init() {
            this.mainDOMEle = document.querySelector('main');
        },

        render() {
            let section = document.createElement("section");
            section.id = "view-viz";
            this.mainDOMEle.appendChild(section);
            // for dev, use the demo server, for production, use my own server
            console.log("data to sow", controller.getCurrentViz());
            new p5(galleryCanvas(controller.getCurrentViz(), controller.getCurrentVizIndex(), controller, appConfig.CORS_PROXY_SERVER_URL), "view-viz");
        }
    };

    const controller = {
        async fetchVizData() {
            console.log("fetching visualizations...")
            const vizMetadata = Parse.Object.extend('vizMetadata');
            const query = new Parse.Query(vizMetadata);
            // results shown by most recent order
            const results = await query.descending('createdAt').find();
            this.setVizData(results);
            
            // vizNavigator.vizzes = results;        
            // return results;
        },

        // async fetchAndDisplayVizInGallery() {
        //     // removeViz();
        //     // emptyElement([main, gallery]);  
        //     let results = await this.fetchVizData();
        //     showVizInGallery(results);
        // },

        async init() {
            navbarView.init();
            await this.fetchVizData();
            galleryOverviewView.init();
            galleryIndividualView.init();
            galleryWrapperView.init();
            
        },

        getGalleryViewMode() {
            return model.galleryViewMode;
        },

        setGalleryViewMode(newMode) {
            model.galleryViewMode.prev = model.galleryViewMode.curr;
            model.galleryViewMode.curr = newMode;
            galleryWrapperView.render();
        },

        getVizData() {
            return model.vizData;
        },

        setVizData(data) {
            model.vizData = data;
        },

        setVizDataSize(size) {
            model.vizDataSize = size;
        },

        getVizDataSize() {
            return model.vizDataSize;
        },

        setPreviousViz(viz) {
            model.previousViz = viz;
        },

        getPreviousViz() {
            return model.previousViz;
        },

        setCurrentViz(viz) {
            model.currentViz = viz;
        },

        getCurrentViz() {
            return model.currentViz;
        },

        setNextViz(viz) {
            model.nextViz = viz;
        },

        getNextViz() {
            return model.nextViz;
        },

        setCurrentVizIndex(index) {
            model.currentVizIndex = index;
        },

        getCurrentVizIndex() {
            return model.currentVizIndex;
        }
    };

    // let main = document.querySelector('main');
    // let gallery = document.querySelector('#gallery');

    // let viewGallery = document.querySelector("header nav li:first-child");
    // let createViz = document.querySelector("header nav li:last-child");

    // let currentViz;

    const vizNavigator = {
        vizzes: [],

        displayViz(vizIndex) {
            displayVizInViewViz(this.vizzes[vizIndex], vizIndex);
        }
    };

    // let state = "gallery";
    // // switch to gallery if not already in gallery
    // viewGallery.addEventListener("click", () => {
    //     if (state !== "gallery") {
    //         console.log("switching to gallery viz")
    //         fetchAndDisplayVizInGallery();
	// 		state = "gallery";
    //     }
    // });

    

    
    
    // function showVizInGallery(vizMetadata) {
    //     main.append(gallery);
    //     for (let i = 0; i < vizMetadata.length; i++) {
    //         let vizThumbnail = document.createElement("div");
    //         vizThumbnail.id = `viz-thumbnail-${i}`;
    //         gallery.appendChild(vizThumbnail);
    //         let thumbnailWidth = document.getElementById(vizThumbnail.id).clientWidth;
    //         let thumbnailHeight = document.getElementById(vizThumbnail.id).clientHeight;
    //         // do the canvas thumbnail creation here
    //         vizThumbnail.addEventListener("click", () => {
    //             console.log("switching to view viz")
        
    //             displayVizInViewViz(vizMetadata[i], i);
    //             // console.log(vizMetadata[i].get("vizParams"));
    //             state = "view";
    //         });
    //         new p5(thumbnailCanvas(vizMetadata[i].get("vizMetadata"), thumbnailWidth, thumbnailHeight), vizThumbnail.id);
    //         // let thumbnail = document.createElement("img");
    //         // // console.log(vizMetadata[i].attributes.vizThumbnail);
    //         // // error checking if thumbnail doesn't exist?
    //         // if (!vizMetadata[i].attributes.vizThumbnail) {
    //         //     console.log("thumbnail no exist");
    //         // } else {
    //         //     thumbnail.src = vizMetadata[i].get("vizThumbnail").url();
    //         // }
    //         // vizThumbnail.appendChild(thumbnail);
            
    //     }

        
    // }

    // function removeViz() {
    //     if (currentViz) {
    //         console.log("removing sketch");
    //         currentViz.stopAudio();
    //         currentViz.remove();
    //         document.querySelector("body").style.backgroundColor = "black";
    //     }
    // }

    // clears all child elements of each element in ele array
    // also cleans up any p5 sketch on the screen
    // function emptyElement(elements) {
    //     for (let i = 0; i < elements.length; i++) {
    //         let child = elements[i].firstElementChild;
    //         while (child) {
    //             elements[i].removeChild(child);
    //             child = elements[i].firstElementChild;
    //         }
    //     }
    // }

    // function displayVizInViewViz(vizMetadata, vizIndex) {
    //     removeViz();
    //     // console.log(vizMetadata);
    //     // console.log("viz data: ", vizMetadata.get("vizMetadata").dbReadableCanvasObjects);
    //     emptyElement([main, gallery]);
        
    //     let section = document.createElement("section");
    //     section.id = "view-viz";
    //     main.appendChild(section);
    //     // for dev, use the demo server, for production, use my own server
    //     currentViz = new p5(galleryCanvas(vizMetadata.get("vizMetadata"), vizIndex, vizNavigator, appConfig.CORS_PROXY_SERVER_URL), "view-viz");
    // }

    

    controller.init();
    
})();