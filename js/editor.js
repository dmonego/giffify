(() => {
  var video = document.querySelector("#video"); 

  document.querySelector("#playButton").onclick = () => { 
      if (video.paused) 
        video.play(); 
      else 
        video.pause(); 
    } 

  document.querySelector("#startTime").onchange = (e) => {
    video.currentTime = e.target.value;
  }

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
    });
  }

  setInterval(() => {
    document.querySelector("#currentTime").innerHTML = video.currentTime;
  }, 200)
})()