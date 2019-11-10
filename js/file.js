
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

    //Fire on browser load
    loadVideos();

    document.querySelector("#videoList").onchange = (event) => {
        const video = document.querySelector("#video");
        video.innerHTML = `<source src="/video/${event.target.value}" />`;
        video.load();
    }

})();