
(() => {
    const loadVideos = (currentVideo) => {
        fetch('/allVideos')
        .then((response) => {
            response.json().then((data) => {
                const newState = {videoList: data};
                if(currentVideo) {
                    newState["video"] = currentVideo;
                }
                document.bus.dispatchEvent("loadVideoList", newState);
            });
       });
    }
    
    const updateVideo = (event) => {
        const videoName = event.state.video;
        const video = document.querySelector("#video");
        video.innerHTML = `<source src="/video/${videoName}" />`;
        video.load();
    }

    const updateVideoList = (event) => {
        console.log(event);
        const videoOptions = event.state.videoList.map((video) => {
            if(video == event.state.video) {
                return `<option value="${video}" selected>${video}</option>`
            }
            
            return `<option value="${video}">${video}</option>`;
        });
        videoOptions.unshift("<option>Select a video...</option>");
        document.querySelector("#videoList").innerHTML = videoOptions.join('\n');
    }

    document.bus.addEventListener("loadVideoList", updateVideoList)
    document.bus.addEventListener("changeVideo", updateVideo)


    //Light reading on drag and drop api and all these preventDefault calls
    // https://www.quirksmode.org/blog/archives/2009/09/the_html5_drag.html
    document.querySelector('#drop').ondragenter = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    document.querySelector('#drop').ondragover = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    document.querySelector('#drop').ondrop = (event) => {
        event.preventDefault();
        console.log("Loading files")
        uploadFiles(event.dataTransfer.files)
    }

    const uploadFiles = (files) => {
        const form = new FormData();
        form.append("video", files[0], files[0].name);
        fetch("/upload", {
            body: form,
            method: "POST"
        }).then((response) => {
            return response.text();
        }).then((filename) => {
            loadVideos(filename);
            document.bus.dispatchEvent("changeVideo", {video: filename});
        })
    }

    //Fire on browser load
    loadVideos();

    document.querySelector("#videoList").onchange = (event) => {
        const videoName = event.target.value;
        document.bus.dispatchEvent("changeVideo", {video: videoName});
    }

})();