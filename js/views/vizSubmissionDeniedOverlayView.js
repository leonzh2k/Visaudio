const vizSubmissionDeniedOverlayView = {
    init(controller) {
        this.controller = controller;
        this.overlayDOMElem = document.querySelector("#viz-submission-denied-overlay");
        // this.closeModalButtonDOMElem = document.querySelector("#close-viz-submission-denied-modal-button");
        this.vizSubmittedModalDOMElem = document.querySelector("#viz-submission-denied-modal");
        this.gotItButtonDOMElem = document.querySelector("#got-it-button");

        this.gotItButtonDOMElem.addEventListener("click", () => {
            this.controller.setVizSubmissionDeniedOverlayActive(false);
        });

        this.overlayDOMElem.addEventListener("mousedown", (e) => {
            // prevents overlay from disappearing when the modal is clicked
            if (this.overlayDOMElem === e.target) {
                // put your code here
                this.controller.setVizSubmissionDeniedOverlayActive(false);
            }
        });



        this.render();
    },

    render() {
        if (this.controller.getVizSubmissionDeniedOverlayActive()) {
            this.overlayDOMElem.style.display = "flex";
        } else {
            this.overlayDOMElem.style.display = "none";
        }
    }
    
};

export default vizSubmissionDeniedOverlayView;