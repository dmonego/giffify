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

  document.querySelector("#startTime").onchange = (e) => {
    video.currentTime = e.target.value;
  }

  document.querySelector("#scrubber").addEventListener("startTimeChanged", (event) => {
    document.querySelector("#startTime").value = event.startTime;
  });

  document.querySelector("#scrubber").addEventListener("endTimeChanged", (event) => {
    document.querySelector("#duration").value = event.duration;
  });

  document.querySelector("#postButton").onclick = () => {
    const startTime = document.querySelector("#startTime").value;
    const duration = document.querySelector("#duration").value;
    const cropString = document.querySelector("#cropString").innerHTML;
    const video = document.querySelector("#videoList").value;
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
  }

  setInterval(() => {
    document.querySelector("#currentTime").innerHTML = video.currentTime;
  }, 200)
})()