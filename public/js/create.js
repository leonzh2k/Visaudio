
import vizCreatorModel from "./models/vizCreatorModel.js";
import vizCreatorController from "./controllers/vizCreatorController.js";
import objectToolbarView from "./views/objectToolbarView.js";
import canvasView from "./views/canvasView.js";
import audioPlayerView from "./views/audioPlayerView.js";
import contextMenuView from "./views/contextMenuView.js";
import vizSubmissionDeniedOverlayView from "./views/vizSubmissionDeniedOverlayView.js";
import vizSubmittedOverlayView from "./views/vizSubmittedOverlayView.js";
import chooseSongOverlayView from "./views/chooseSongOverlayView.js";
(() => {

    // https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/

    const model = vizCreatorModel;
    const objToolbarView = objectToolbarView;
    const cnvView = canvasView;
    const ctxMenuView = contextMenuView;
    const vizSubmssnDeniedOverlayView = vizSubmissionDeniedOverlayView;
    const vizSubmttedOverlayView = vizSubmittedOverlayView;
    const chooseSngOverlayView = chooseSongOverlayView;

    const controller = vizCreatorController;
    controller.init(
        model,
        objToolbarView, 
        audioPlayerView, 
        cnvView, 
        ctxMenuView, 
        chooseSngOverlayView, 
        vizSubmttedOverlayView, 
        vizSubmssnDeniedOverlayView
    );

})();