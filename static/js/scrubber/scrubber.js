const LEFT_KEY = 37;
const RIGHT_KEY = 39;

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
        this.handle.addEventListener("keydown", this.handleStartHandleKeydown.bind(this));
        document.addEventListener("mouseup", this.handleDocumentMouseUp.bind(this));
        document.addEventListener("mousemove", this.handleDocumentMouseMove.bind(this));

        this.endHandle = document.createElement("button");
        this.endHandle.setAttribute("class", "handle");
        this.endHandle.setAttribute("id", "handle-end");
        this.endHandle.style.left = this.width + "px";
        this.endHandle.addEventListener("keydown", this.handleEndHandleKeydown.bind(this));
        this.endHandle.addEventListener("keyup", this.handleEndHandleKeyup.bind(this));
        this.endHandle.addEventListener("mousedown", this.handleEndHandleMouseDown.bind(this));

        this.gutter = document.createElement("div");
        this.gutter.setAttribute("class", "gutter");
        this.gutter.append(this.handle);
        this.gutter.append(this.endHandle);
        this.shadowRoot.append(this.gutter);
    }

    handleStartHandleKeydown(event) {
        const middle = 38; // left is 37, right is 39 - this helps us make them -1 and 1
        if(event.keyCode == LEFT_KEY || event.keyCode == RIGHT_KEY) {
            this.startPosition += event.keyCode - middle;
            this.handle.style.left = this.startPosition + "px";

            const ratio = this.startPosition / this.width;
            this.currentTime = this.setVideoTimeByRatio(ratio);
            this.emitStartTimeChanged();
        }
    }

    handleEndHandleKeydown(event) {
        const middle = 38; // left is 37, right is 39 - this helps us make them -1 and 1
        if(event.keyCode == LEFT_KEY || event.keyCode == RIGHT_KEY) {
            this.endPosition += event.keyCode - middle;
            this.endHandle.style.left = this.endPosition + "px";

            const ratio = this.endPosition / this.width;
            this.endTime = this.setVideoTimeByRatio(ratio);
            this.emitEndTimeChanged();
        }
    }

    handleEndHandleKeyup(event) {
        console.log("keyup")
        if(event.keyCode == LEFT_KEY || event.keyCode == RIGHT_KEY) {
            this.setVideoTime(this.currentTime);
        }
    }

    handleHandleMouseDown(event) {
        this.startHandlePressed = true;
        this.handle.style.backgroundColor = "green";
    }

    handleEndHandleMouseDown(event) {
        this.endHandlePressed = true;
        this.endHandle.style.backgroundColor = "green";
        if(this.endTime) {
            this.setVideoTime(this.endTime);
        }
    }

    handleDocumentMouseUp(event) {
        if(this.startHandlePressed) {
            this.startHandlePressed = false;
            this.emitStartTimeChanged();
        }
        if(this.endHandlePressed) {
            this.endHandlePressed = false;
            this.emitEndTimeChanged();
        }
        this.handle.style.backgroundColor = "red";
        this.endHandle.style.backgroundColor = "red";
        this.setVideoTime(this.currentTime);
    }

    emitStartTimeChanged() {
        const startTimeChanged = new Event("startTimeChanged");
        startTimeChanged.startTime = this.currentTime;
        this.dispatchEvent(startTimeChanged);

    }

    emitEndTimeChanged() {
        const endTimeChanged = new Event("endTimeChanged");
        endTimeChanged.startTime = this.currentTime;
        if(this.endTime) {
            endTimeChanged.endTime = this.endTime;
            endTimeChanged.duration = this.endTime - this.currentTime;
        }
        this.dispatchEvent(endTimeChanged);

    }

    setVideoTimeByRatio(ratio) {
        const videoId = this.attributes["video-id"].value;
        const videoElement = document.getElementById(videoId);
        const selectedTime = videoElement.duration * ratio;
        videoElement.currentTime = selectedTime;
        return selectedTime;
    }

    setVideoTime(time) {
        const videoId = this.attributes["video-id"].value;
        const videoElement = document.getElementById(videoId);
        videoElement.currentTime = time;
    }

    handleDocumentMouseMove(event) {
        let position = Math.max(0, Math.min(this.width, event.offsetX));
        if(this.startHandlePressed) {
            position = Math.min(position, this.endPosition)
            this.startPosition = position;
            this.handle.style.left = position + "px";

            const ratio = position / this.width;
            this.currentTime = this.setVideoTimeByRatio(ratio);
        }
        if(this.endHandlePressed) {
            position = Math.max(position, this.startPosition)
            this.endPosition = position;
            this.endHandle.style.left = position + "px";

            const ratio = position / this.width;
            this.endTime = this.setVideoTimeByRatio(ratio);
        }
    }

    constructor() {
        super();
        this.handleStart
        console.log('Creating Scrubber')
        this.width = 500;
        this.startPosition = 0;
        this.endPosition = this.width;
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