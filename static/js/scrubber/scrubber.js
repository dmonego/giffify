
class Scrubber extends HTMLElement {
    createDom() {
        const style = document.createElement("link");
        style.setAttribute("rel", "stylesheet");
        style.setAttribute("href", "js/scrubber/scrubber.css");
        this.shadowRoot.append(style);

        this.handle = document.createElement("button");
        this.handle.setAttribute("class", "handle");
        this.handle.setAttribute("id", "handle-start");
        this.handle.addEventListener("mousedown", this.handleHandleMouseDown.bind(this));
        document.addEventListener("mouseup", this.handleDocumentMouseUp.bind(this));
        document.addEventListener("mousemove", this.handleDocumentMouseMove.bind(this));

        this.endHandle = document.createElement("button");
        this.endHandle.setAttribute("class", "handle");
        this.endHandle.setAttribute("id", "handle-end");
        this.endHandle.style.left = this.width + "px";
        this.endHandle.addEventListener("mousedown", this.handleEndHandleMouseDown.bind(this));

        this.gutter = document.createElement("div");
        this.gutter.setAttribute("class", "gutter");
        this.gutter.append(this.handle);
        this.gutter.append(this.endHandle);
        this.shadowRoot.append(this.gutter);
    }

    handleHandleMouseDown(event) {
        this.isPressed = true;
        this.handle.style.backgroundColor = "green";
    }

    handleEndHandleMouseDown(event) {
        this.endHandlePressed = true;
        this.endHandle.style.backgroundColor = "green";
        if(this.endTime) {
            const videoId = this.attributes["video-id"].value;
            const videoElement = document.getElementById(videoId);
            videoElement.currentTime = this.endTime;    
        }
    }


    handleDocumentMouseUp(event) {
        this.isPressed = false;
        this.endHandlePressed = false;
        this.handle.style.backgroundColor = "red";
        this.endHandle.style.backgroundColor = "red";

        const videoId = this.attributes["video-id"].value;
        const videoElement = document.getElementById(videoId);
        videoElement.currentTime = this.currentTime;
    }

    handleDocumentMouseMove(event) {
        const position = Math.max(0, Math.min(this.width, event.offsetX));
        if(this.isPressed) {
            this.handle.style.left = position + "px";

            const ratio = position / this.width;
            const videoId = this.attributes["video-id"].value;
            const videoElement = document.getElementById(videoId);
            const selectedTime = videoElement.duration * ratio;
            this.currentTime = selectedTime;
            videoElement.currentTime = selectedTime;
        }
        if(this.endHandlePressed) {
            this.endHandle.style.left = position + "px";

            const ratio = position / this.width;
            const videoId = this.attributes["video-id"].value;
            const videoElement = document.getElementById(videoId);
            const selectedTime = videoElement.duration * ratio;
            this.endTime = selectedTime;
            videoElement.currentTime = selectedTime;
        }
    }

    constructor() {
        super();
        this.handleStart
        console.log('Creating Scrubber')
        this.width = 300;
        this.currentTime = 0;
        this.endTime = null;
        this.attachShadow({mode: 'open'});
        this.createDom();
    }

    connectedCallback() {
        console.log("Scrubber added to board");
    }
}

customElements.define('video-scrubber', Scrubber);