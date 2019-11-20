
(() => {
    const getVideos = (cb) => {
        fetch('/allVideos')
            .then((response) => {
            response.json().then((data) => {
                cb(data)
            });
        })
    }
    const loadVideos = () => {
        getVideos((videoList) => {
            const videoOptions = videoList.map((video) => `<option value="${video}">${video}</option>`);
            videoOptions.unshift("<option>Select a video...</option>");
            document.querySelector("#videoList").innerHTML = videoOptions.join('\n');
        })
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
        const file = event.dataTransfer.files[0];
        console.log(`Time to upload ${file.name}`)
    }

    //Fire on browser load
    loadVideos();

    document.querySelector("#videoList").onchange = (event) => {
        const video = document.querySelector("#video");
        video.innerHTML = `<source src="/video/${event.target.value}" />`;
        video.load();
    }

})();