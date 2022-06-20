const vizCreatorModel = {
    /*
        Holds info that must be passed between views,
        as well as general info that doesn't belong
        to any view
    */
    
    napsterAPIKey: "ZDIxMDM1NTEtYjk3OS00YTI1LWIyYjItYjBjOWVmMWYyN2I3",
    // for local dev, use the demo server, for production, use my own server
    // https://mighty-stream-75885.herokuapp.com
    // https://cors-anywhere.herokuapp.com
    proxyURL: "https://cors-anywhere.herokuapp.com",

    canvasObjects: [

    ],

    // assigned to objects
    // nextAvailableObjectID: 1,

    // selectedSongURL: null,


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
            songURL: "die",
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

export default vizCreatorModel;const vizCreatorModel = {
    /*
        Holds info that must be passed between views,
        as well as general info that doesn't belong
        to any view
    */
    
    napsterAPIKey: "ZDIxMDM1NTEtYjk3OS00YTI1LWIyYjItYjBjOWVmMWYyN2I3",
    // for local dev, use the demo server, for production, use my own server
    // https://mighty-stream-75885.herokuapp.com
    // https://mighty-stream-75885.herokuapp.com
    proxyURL: "https://mighty-stream-75885.herokuapp.com",

    canvasObjects: [

    ],

    // assigned to objects
    // nextAvailableObjectID: 1,

    // selectedSongURL: null,


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
            songURL: "die",
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