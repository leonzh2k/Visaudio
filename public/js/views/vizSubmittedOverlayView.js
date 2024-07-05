const vizSubmittedOverlayView = {
    init(controller) {
        this.controller = controller;
        this.overlayDOMElem = document.querySelector("#viz-submitted-overlay");
        this.closeModalButtonDOMElem = document.querySelector("#close-viz-submitted-modal-button");
        this.vizSubmittedModalDOMElem = document.querySelector("#viz-submitted-modal");
        this.continueWorkingButtonDOMElem = document.querySelector("#continue-working-button");
        console.log("hello world");
        this.overlayDOMElem.addEventListener("mousedown", (e) => {
            // prevents overlay from disappearing when the modal is clicked
            if (this.overlayDOMElem === e.target) {
                // put your code here
                this.controller.setSubmitVizOverlayActive(false);
            }
        });

        this.closeModalButtonDOMElem.addEventListener("click", () => {
            this.controller.setSubmitVizOverlayActive(false);
        });

        this.continueWorkingButtonDOMElem.addEventListener("click", () => {
            this.controller.setSubmitVizOverlayActive(false);
        });

        this.render();
    },
    render() {
        if (this.controller.getSubmitVizOverlayActive()) {
            this.overlayDOMElem.style.display = "flex";
        } else {
            this.overlayDOMElem.style.display = "none";
        }
    }
}

export default vizSubmittedOverlayView;