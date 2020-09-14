const program = require('commander');
const hrid = require('human-readable-ids').hri;
const execSync = require('child_process').execSync;
program
    .option('--start <start>', 'start time', parseFloat)
    .option('--duration <duration>', 'duration to use', parseFloat)
    .option('--source <source>', 'file name to read')
    .option('--output <output>', 'file name to write')
    .option('--slow')
    .option('--filmgrain')
    .option('--outputwidth <width>', 'Width of output', parseInt)
    .option('--crop <coords>', 'Location to crop in w:h:x:y format')

program.parse(process.argv);

const buildPreprocessFilter = () => {
    const filters = [];
    if(program.slow){
        filters.push('setpts=2*PTS')
    }
    if(program.filmgrain) {
        filters.push('noise=c0s=7:allf=t')
    }
    if(!!program.crop) {
        filters.push(`crop=${program.crop}`)
    }
    const combined = filters.join(',');
    if(!!combined) {
        return `-vf ${combined}`;
    } else {
        return ''
    }
}

const buildPostProcessFilter = () => {
    let scale = null;
    if(program.outputwidth) {
        scale = `scale=w=${program.outputwidth}:h=-1:flags=lanczos[x]`;
    } else {
        scale = `scale=w=450:h=-1:flags=lanczos[x]`;
    }
    return `${scale}, [x][1:v] paletteuse`;
}

const main = () => {
    const slug = hrid.random();
    //trim, crop, and apply color effects
    const preprocessFilter = buildPreprocessFilter();
    execSync(`ffmpeg -ss ${program.start} -t ${program.duration} -i ${program.source} ${preprocessFilter} tmp/${slug}.mp4`) 

    //create palette
    execSync(`ffmpeg -i tmp/${slug}.mp4 -filter_complex "[0:v] palettegen" tmp/${slug}-palette.png`)

    //produce gif
    const postprocessFilter = buildPostProcessFilter();
    execSync(`ffmpeg -i tmp/${slug}.mp4 -i tmp/${slug}-palette.png -r 18 -f gif -filter_complex "${postprocessFilter}" ${program.output}`)
}

main()