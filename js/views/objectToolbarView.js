const objectToolbarView = {
    init(vizCreatorController, canvasView) {
        document.getElementById("rectangle").addEventListener("click", () => {
            vizCreatorController.storeCanvasObject(canvasView.sketch.createObject("rectangle"));
        });
        document.getElementById("ellipse").addEventListener("click", () => {
            vizCreatorController.storeCanvasObject(canvasView.sketch.createObject("ellipse"));
        });
    }
    
};

export default objectToolbarView;