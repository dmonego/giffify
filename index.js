const express = require('express');
const fs = require('fs');
const hrid = require('human-readable-ids').hri;
const app = express();
const port = 3000;
const expressFormidable = require('express-formidable')
const exec = require('child_process').exec;

app.set('view engine', 'ejs');
app.use(expressFormidable());

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/allVideos', (req, res) => {
    fs.readdir('video', (err, files) => {
        res.send(JSON.stringify(files));
    })
})

app.post('/upload', (req, res) => {
    let target = "",
        filename = req.files.video.name;
    const cleanAndFinish = () => {
        fs.unlinkSync(req.files.video.path);
        res.send(filename);    
    }
    if(req.files.video.name.endsWith(".ts")) {
        filename = req.files.video.name.slice(0, -3) + ".mp4";
        target = `video/${filename}`;
        const cmd = `ffmpeg -i ${req.files.video.path} -c:v libx264 -c:a aac ${target}`;
        console.log(cmd)
        exec(cmd, cleanAndFinish);
    } else {
        const target = `video/${filename}`;
        console.log("Copy file to " + target);
        fs.copyFileSync(req.files.video.path, target);
        cleanAndFinish()
    }
})

app.post('/', (req, res) => {
    const start = req.fields.startTime;
    const duration = req.fields.duration;
    const video = req.fields.video;
    const gif = `gif/${hrid.random()}.gif`;
    const crop = req.fields.cropString
        ? `--crop ${req.fields.cropString}`
        : "";
    const cmd = `node process.js --start ${start} --duration ${duration} ${crop} --source video/${video} --output ${gif}`
    console.log(cmd)
    exec(cmd, () =>{
        res.send(gif);
    });
})

app.use('/video', express.static('video'));
app.use('/js', express.static('static/js'));
app.use('/css', express.static('static/css'));
app.use('/gif', express.static('gif'));
app.use('/img', express.static('static/img'));

console.log(`Listening on port ${port}`);
app.listen(port);