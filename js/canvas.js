(() => {
    const canvas = document.querySelector("#effectsCanvas"),
        video = document.querySelector("#video"),
        STATE_CROP_BLANK = 0,
        STATE_CROP_DRAWING = 1,
        STATE_CROP_DONE = 2;
    let canvasCursorLoc = {},
        canvasState = STATE_CROP_BLANK;

    function clear() {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    function redrawCropRect(offsetX, offsetY) {
        clear();
        const context = canvas.getContext("2d");
        context.strokeStyle = "#00FF00";
        context.strokeRect(canvasCursorLoc.startX,
            canvasCursorLoc.startY,
            offsetX - canvasCursorLoc.startX,
            offsetY - canvasCursorLoc.startY);

    }

    function finishCropRect(offsetX, offsetY) {
        clear();
        const startX = Math.min(canvasCursorLoc.startX, offsetX),
            startY = Math.min(canvasCursorLoc.startY, offsetY),
            width = Math.abs(offsetX - canvasCursorLoc.startX),
            height = Math.abs(offsetY - canvasCursorLoc.startY),
            context = canvas.getContext("2d")
        context.strokeStyle = "#00FF00";
        context.strokeRect(startX,
            startY,
            width,
            height);
        const cropString = `${width}:${height}:${startX}:${startY}`
        document.querySelector("#cropString").innerHTML = cropString;

    }

    video.onloadedmetadata = () => {
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
    }


    canvas.onclick = (event) => {
        if(canvasState == STATE_CROP_BLANK) {
            canvasCursorLoc.startX = event.offsetX;
            canvasCursorLoc.startY = event.offsetY;
            canvasState = STATE_CROP_DRAWING
        }
        else if(canvasState == STATE_CROP_DRAWING) {
            finishCropRect(event.offsetX, event.offsetY);
            canvasState = STATE_CROP_DONE;
        }
        else if(canvasState == STATE_CROP_DONE) {
            document.querySelector("#cropString").innerHTML = "";
            clear();
            canvasState = STATE_CROP_BLANK;
        }
    }

    canvas.onmousemove = (event) => {
        if(canvasState == STATE_CROP_DRAWING)
        {
            redrawCropRect(event.offsetX, event.offsetY);
        }
    }

})()