(() => {
  var video = document.querySelector("#video"); 
  var modalClose = document.querySelector("#modalExit");
  var modal = document.querySelector("#modal");

  document.querySelector("#playButton").onclick = () => { 
      if (video.paused) 
        video.play(); 
      else 
        video.pause(); 
    } 
  
  const showGif = (fileUrl) => {
    const gifImage = document.querySelector("#gif");
    gifImage.src = fileUrl;
    modal.style.display = "block";
  }

  modalClose.onclick = () => {
    modal.style.display = "none";
  };

  document.querySelector("#scrubber").addEventListener("startTimeChanged", (event) => {
    document.bus.dispatchEvent("setStartTime", {"time": { "startTime": event.startTime}});
  });

  document.querySelector("#scrubber").addEventListener("endTimeChanged", (event) => {
    document.bus.dispatchEvent("setStartTime", {"time": { "duration": event.duration}});
  });

  document.querySelector("#postButton").onclick = () => {
    document.bus.dispatchEvent("giffify");
  }

  document.bus.addEventListener("giffify", (event) => {
    const startTime = event.state.time.startTime;
    const duration = event.state.time.duration;
    const cropString = event.state.crop;
    const video = event.state.video;
    const form = new FormData();
    form.append('startTime', startTime);
    form.append('duration', duration);
    form.append("cropString", cropString);
    form.append('video', video);
    fetch("/", {
      method: 'POST',
      body: form
    }).then((response) => {
      return response.text();
    }).then((fileUrl) => {
      showGif(fileUrl);
    });
  });
  
  setInterval(() => {
    document.querySelector("#currentTime").innerHTML = video.currentTime;
  }, 200)
})()