(() => {
    const canvas = document.querySelector("#effectsCanvas");
    const video = document.querySelector("#video");
    
    function clear() {
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    video.onloadedmetadata = () => {
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
    }

    let canvasCursorLoc = {},
        mouseDown = false;

    canvas.onmousedown = (event) => {
        canvasCursorLoc.startX = event.offsetX;
        canvasCursorLoc.startY = event.offsetY;
        mouseDown = true;
    }

    canvas.onmousemove = (event) => {
        if(mouseDown)
        {
            clear();
            const context = canvas.getContext("2d");
            context.strokeStyle = "#00FF00";
            context.strokeRect(canvasCursorLoc.startX,
                canvasCursorLoc.startY,
                event.offsetX - canvasCursorLoc.startX,
                event.offsetY - canvasCursorLoc.startY);
        }
    }

    canvas.onmouseup = (event) => {
        clear();
        const startX = Math.min(canvasCursorLoc.startX, event.offsetX),
            startY = Math.min(canvasCursorLoc.startY, event.offsetY),
            width = Math.abs(event.offsetX - canvasCursorLoc.startX),
            height = Math.abs(event.offsetY - canvasCursorLoc.startY),
            context = canvas.getContext("2d")
        context.strokeStyle = "#00FF00";
        context.strokeRect(startX,
            startY,
            width,
            height);
        const cropString = `${width}:${height}:${startX}:${startY}`
        document.querySelector("#cropString").innerHTML = cropString;
        mouseDown = false;
    }
})()