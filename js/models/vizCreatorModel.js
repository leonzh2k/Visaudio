import appConfig from "../appConfig.js";
const vizCreatorModel = {
    /*
        Holds info that must be passed between views,
        as well as general info that doesn't belong
        to any view
    */
    
    proxyURL: appConfig.CORS_PROXY_SERVER_URL,

    canvasObjects: [

    ],

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
            songURL: null,
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

export default vizCreatorModel;