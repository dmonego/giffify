
(() => {
    const _getVideos = (cb) => {
        fetch('/allVideos')
        .then((response) => {
            response.json().then((data) => {
                cb(data)
            });
       });
    }
    
    const loadVideos = (cb) => {
        _getVideos((videoList) => {
            const videoOptions = videoList.map((video) => `<option value="${video}">${video}</option>`);
            videoOptions.unshift("<option>Select a video...</option>");
            document.querySelector("#videoList").innerHTML = videoOptions.join('\n');
            if(cb) {
                cb();
            }
        })
    }

    const updateVideo = (videoName) => {
        const video = document.querySelector("#video");
        video.innerHTML = `<source src="/video/${videoName}" />`;
        video.load();
    }

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
            loadVideos(() => {
                document.querySelector("#videoList").value = filename;
            });
            updateVideo(filename);
        })
    }

    //Fire on browser load
    loadVideos();

    document.querySelector("#videoList").onchange = (event) => {
        const videoName = event.target.value;
        document.bus.dispatchEvent("changeVideo", {video: videoName});
        updateVideo(videoName);
    }

})();