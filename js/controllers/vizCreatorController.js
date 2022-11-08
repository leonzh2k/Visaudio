import appConfig from "../appConfig.js";

const vizCreatorController = {
    init(
            vizCreatorModel,
            objectToolbarView, 
            audioPlayerView, 
            canvasView, 
            contextMenuView, 
            chooseSongOverlayView, 
            vizSubmittedOverlayView, 
            vizSubmissionDeniedOverlayView
    ) {
        this.vizCreatorModel = vizCreatorModel,
        this.objectToolbarView = objectToolbarView;
        this.audioPlayerView = audioPlayerView;
        this.canvasView = canvasView;
        this.contextMenuView = contextMenuView;
        this.chooseSongOverlayView = chooseSongOverlayView;
        this.vizSubmittedOverlayView = vizSubmittedOverlayView;
        this.vizSubmissionDeniedOverlayView = vizSubmissionDeniedOverlayView;

        // Audio Player must be initialized before canvasView as canvasView requires its audio object
        objectToolbarView.init(this, canvasView);   
        audioPlayerView.init(this);
        canvasView.init(this, audioPlayerView.audioPlayer.audioObject);
        contextMenuView.init(this);
        chooseSongOverlayView.init(this);
        vizSubmittedOverlayView.init(this);
        vizSubmissionDeniedOverlayView.init(this);
    },

    getContextMenuMode() {
        return this.vizCreatorModel.contextMenu.currentMode;
    },

    // should I combine this with update ContextMenumode?
    setContextMenuMode(mode) {
        this.vizCreatorModel.contextMenu.currentMode = mode;
    },

    getProxyURL() {
        return this.vizCreatorModel.proxyURL;
    },

    setSelectedSongURL(songURL, artistName, trackName) {
        this.vizCreatorModel.audio.selectedSongURL = songURL;
        this.vizCreatorModel.audio.artistName = artistName;
        this.vizCreatorModel.audio.trackName = trackName;
        this.audioPlayerView.audioPlayer.loadAudio(`${this.getProxyURL()}/${songURL}`);
    },

    // getAudioPlayerStatus() {
    //     return vizCreatorModel.audioPlayerStatus;
    // },

    // setAudioPlayerStatus(status) {
    //     vizCreatorModel.audioPlayerStatus = status;
    // },

    getSelectedCanvasObject() {
        return this.vizCreatorModel.selectedCanvasObject;
    },

    // updateDBObjectProperty() {

    // },

    // runs when submit button is clicked
    async submitVizToDB() {
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
        this.vizCreatorModel.databaseObject.vizMetadata.songURL = this.vizCreatorModel.audio.selectedSongURL;
        this.vizCreatorModel.databaseObject.vizMetadata.artistName = this.vizCreatorModel.audio.artistName;
        this.vizCreatorModel.databaseObject.vizMetadata.trackName = this.vizCreatorModel.audio.trackName;
        this.vizCreatorModel.databaseObject.vizMetadata.canvasBackgroundColor = this.vizCreatorModel.canvasBackgroundColor;
        let parentWidth = document.getElementById("canvas").clientWidth;
        let parentHeight = document.getElementById("canvas").clientHeight;
        this.vizCreatorModel.databaseObject.vizMetadata.canvasWidth = parentWidth;
        this.vizCreatorModel.databaseObject.vizMetadata.canvasHeight = parentHeight;
        // clear the array, find more efficient method later
        this.vizCreatorModel.databaseObject.vizMetadata.dbReadableCanvasObjects = []
        this.vizCreatorModel.canvasObjects.forEach(obj => {
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
            this.vizCreatorModel.databaseObject.vizMetadata.dbReadableCanvasObjects.push(dbReadableObject);
        });
        console.log(this.vizCreatorModel.databaseObject);
        // send to DB
        const params = {
            dbEntry: this.vizCreatorModel.databaseObject,
        };
        const options = {
            method: 'POST',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(params)  
        };
        console.log(options);
        // should probably add some error handling here
        await fetch(`${appConfig.BACKEND_URL}/submit`, options);
    },

    setSelectedCanvasObjectProperty(property, value) {
        // console.log(value);
        this.vizCreatorModel.selectedCanvasObject[property] = value;
    },

    setSelectedCanvasObject(newSelection) {
        this.vizCreatorModel.selectedCanvasObject = newSelection;
    },

    setCanvasBackgroundColor(newColor) {
        this.vizCreatorModel.canvasBackgroundColor = newColor;
    },

    getCanvasBackgroundColor() {
        return this.vizCreatorModel.canvasBackgroundColor;
    },

    updateCanvasBackgroundColor(newColor) {
        this.canvasView.sketch.backgroundColor = newColor; // update color shown on canvas
        this.setCanvasBackgroundColor(newColor);
    },

    storeCanvasObject(object) {
        this.vizCreatorModel.canvasObjects.push(object);
        // console.log(vizCreatorModel.canvasObjects);
    },

    updateSelectedCanvasObject(newSelection) {
        this.setSelectedCanvasObject(newSelection);
        // console.log(newSelection);
        this.contextMenuView.render();
    },

    updateContextMenuMode(newMode) {
        // should deciding whether to call render or not handled in View?
        if (this.getContextMenuMode() !== newMode) {
            this.setContextMenuMode(newMode);
            // switch to design properties 
            // render right views
            // should controller decide what should be rendered, or the view?
            this.contextMenuView.render();
        } else {
            console.log("clicked on mode currently on");
        }
    },

    setChooseSongOverlayActive(active) {
        this.vizCreatorModel.chooseSongOverlayActive = active;
        this.chooseSongOverlayView.render();
    }, 

    getChooseSongOverlayActive() {
        return this.vizCreatorModel.chooseSongOverlayActive;
    },

    setSubmitVizOverlayActive(active) {
        this.vizCreatorModel.vizSubmitOverlayActive = active;
        this.vizSubmittedOverlayView.render();
    }, 

    getSubmitVizOverlayActive() {
        return this.vizCreatorModel.vizSubmitOverlayActive;
    },

    setVizSubmissionDeniedOverlayActive(active) {
        this.vizCreatorModel.vizSubmissionDeniedOverlayActive = active;
        this.vizSubmissionDeniedOverlayView.render();
    },

    getVizSubmissionDeniedOverlayActive() {
        return this.vizCreatorModel.vizSubmissionDeniedOverlayActive;
    },

    checkIfVizIsSubmittable() {
        // maybe if no objects it canvas?
        if (this.vizCreatorModel.audio.selectedSongURL != null) {
            return true;
        }
        return false;
    }
}

export default vizCreatorController