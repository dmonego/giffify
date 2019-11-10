const express = require('express');
const fs = require('fs');
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

app.post('/', (req, res) => {
    const start = req.fields.startTime;
    const duration = req.fields.duration;
    const video = req.fields.video;
    const crop = req.fields.cropString 
        ? `--crop ${req.fields.cropString}`
        : "";
    const cmd = `node process.js --start ${start} --duration ${duration} ${crop} --source video/${video} --output ${video}.gif`
    console.log(cmd)
    exec(cmd, () => {
        res.send("");
    })
})

app.use('/video', express.static('video'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'))
app.listen(port);