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
            if (galleryViewMode.prev === galleryViewMode.curr && galleryViewMode.curr != "individual") {
                return
            }
            if (galleryViewMode.prev === "individual") {
                galleryIndividualView.cleanup();
            }
            this.mainDOMEle.innerHTML = "";
            this.galleryDOMEle.innerHTML = "";
            switch (galleryViewMode.curr) {
                case ("overview"):
                    console.log("overview");
                    galleryOverviewView.render();
                    break;
                case ("individual"):
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
            document.querySelector("body").style.backgroundColor = "black";
            for (let i = 0; i < vizData.length; i++) {
                let vizThumbnail = document.createElement("div");
                vizThumbnail.id = `viz-thumbnail-${i}`;
                this.galleryDOMEle.appendChild(vizThumbnail);
                let thumbnailWidth = document.getElementById(vizThumbnail.id).clientWidth;
                let thumbnailHeight = document.getElementById(vizThumbnail.id).clientHeight;
                // do the canvas thumbnail creation here
                vizThumbnail.addEventListener("click", () => {
                    console.log("viewing an individual viz now.")

                    controller.setCurrentVizIndex(i);
                    
                });
                new p5(thumbnailCanvas(vizData[i].get("vizMetadata"), thumbnailWidth, thumbnailHeight), vizThumbnail.id);
                
            }
        }
    };

    const galleryIndividualView = {
        init() {
            this.mainDOMEle = document.querySelector('main');
            this.vizP5Ref = null;
        },

        cleanup() {
            this.vizP5Ref.stopAudio();
            this.vizP5Ref.remove();
        },

        render() {
            let section = document.createElement("section");
            section.id = "view-viz";
            this.mainDOMEle.appendChild(section);
            const currentViz = controller.getCurrentViz();
            // emulate full screen
            document.querySelector("body").style.backgroundColor = currentViz.canvasBackgroundColor;
            this.vizP5Ref = new p5(galleryCanvas(currentViz, controller, appConfig.CORS_PROXY_SERVER_URL), "view-viz");
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
            this.setVizDataSize(results.length);
        },

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

        getCurrentViz() {
            return model.vizData[this.getCurrentVizIndex()].get("vizMetadata");
        },

        setCurrentVizIndex(index) {
            model.currentVizIndex = index;
            this.setGalleryViewMode("individual");
        },

        getCurrentVizIndex() {
            return model.currentVizIndex;
        },
    };

    controller.init();
    
})();