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
                    this.mainDOMEle.classList.remove("main-individual-mode");
                    this.mainDOMEle.classList.add("main-overview-mode");
                    galleryOverviewView.render();
                    break;
                case ("individual"):
                    this.mainDOMEle.classList.remove("main-overview-mode");
                    this.mainDOMEle.classList.add("main-individual-mode");
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
            if (this.vizP5Ref != null) {
                this.vizP5Ref.stopAudio();
                this.vizP5Ref.remove();
            }
        },

        render() {
            let section = document.createElement("section");
            section.id = "view-viz";
            this.mainDOMEle.innerHTML = `
                <section id="prev-viz-navigation-panel">
                </section>
                <section id="view-viz-area">
                
                </section>
                <section id="next-viz-navigation-panel">
                </section>
                <section id="audio-controls">

                </section>
            
            `
            
            // conditionally display buttons to go to prev and next viz
            if (controller.getCurrentVizIndex() != controller.getVizDataSize() - 1) {
                let nextVizButton = document.createElement("button");
                let rightArrow =  document.createElement("img");
                rightArrow.src = "./assets/img/nextVizButton.svg";
                nextVizButton.appendChild(rightArrow);
                
                nextVizButton.addEventListener("click", () => {
                    controller.setCurrentVizIndex(controller.getCurrentVizIndex() + 1);
                });
                document.querySelector("#next-viz-navigation-panel").appendChild(nextVizButton);
            }

            if (controller.getCurrentVizIndex() != 0) {
                let prevVizButton = document.createElement("button");
                let leftArrow =  document.createElement("img");
                leftArrow.src = "./assets/img/previousVizButton.svg";
                prevVizButton.appendChild(leftArrow);
                document.querySelector("#prev-viz-navigation-panel").appendChild(prevVizButton);
                prevVizButton.addEventListener("click", () => {
                    controller.setCurrentVizIndex(controller.getCurrentVizIndex() - 1);
                });
            }

            const currentViz = controller.getCurrentViz();
            // emulate full screen
            // document.querySelector("body").style.backgroundColor = currentViz.canvasBackgroundColor;
            this.vizP5Ref = new p5(galleryCanvas(currentViz, controller, appConfig.CORS_PROXY_SERVER_URL), "view-viz-area");
            
            document.querySelector("#view-viz-area").style.backgroundColor = currentViz.canvasBackgroundColor;

            let artistInfo = document.createElement("span");
            artistInfo.id = "artist-info";
            artistInfo.textContent = `${currentViz.artistName} - ${currentViz.trackName}`;
            document.querySelector("#audio-controls").append(artistInfo);

            let playButton = document.createElement("button");
            let playButtonImg = document.createElement("img");
            playButtonImg.src = "./assets/img/play_button.svg";
            playButton.appendChild(playButtonImg);
            playButton.addEventListener("click", () => {
                const audioStatus = this.vizP5Ref.toggleAudio();
                switch(audioStatus) {
                    case("playing"):
                        playButtonImg.src = "./assets/img/pause_button.svg";
                        break;
                    case("paused"):
                        playButtonImg.src = "./assets/img/play_button.svg";
                        break;
                }
            });
            document.querySelector("#audio-controls").appendChild(playButton);
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