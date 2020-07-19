const {app} = require("electron");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const ffmpegPath = path.join(app.getAppPath(), '..', 'public', "bin", "amd64", "ffmpeg");
const FfmpegCommand = require("fluent-ffmpeg");
const sharp = require("sharp");
FfmpegCommand.setFfmpegPath(ffmpegPath);



/**
 * Create screenshot at the given time stamp from file path
 *
 * @param {DailyMedia} dailyMedia
 * @param {Timeline} timeline
 * @param {IpcMainEvent} event
 */
const createScreenshot = (dailyMedia, timeline, event) => {
    let screenshotName = `justasec-${dailyMedia.year}${dailyMedia.month}${dailyMedia.day}.jpg`;
    new FfmpegCommand(dailyMedia.filePath).screenshots({
        timestamps: [dailyMedia.timeStamp],
        filename: screenshotName,
        folder: app.getPath('temp'),
        size: "320x180",
    }).on("end", function () {
        console.log("screenshot created");
        let buff = fs.readFileSync(path.join(app.getPath('temp'), screenshotName));
        dailyMedia.videoStill = buff.toString('base64');
        event.reply("screenshot-created", dailyMedia);
    });
};

const createImagePreview = (dailyMedia, event) => {
    sharp(dailyMedia.filePath)
        .resize(320,180, {
            fit: 'cover',
        })
        .jpeg()
        .toBuffer()
        .then((outputBuffer)=>{
            dailyMedia.videoStill = outputBuffer.toString('base64');
            event.reply("screenshot-created", dailyMedia);
        })
}

const renderVideo = (dailyMedia, tmpFolder, event) => {
    const dateName = moment(dailyMedia.mediaDate).format('LL');
    const ffmpeg =  new FfmpegCommand().addInput(dailyMedia.path);
    const tmpFileName = path.join(tmpFolder, dailyMedia.mediaDate + ".mp4");
    ffmpeg.seekInput(dailyMedia.videoTimestamp).duration(1.5);
    ffmpeg
        .videoFilters({
            filter: 'drawtext',
            options: {
                text: dateName,
                fontcolor: 'white',
                fontsize: 80,
                x: "(w)/2",
                y: "(h)*0.75",
                shadowcolor: 'black',
                shadowx: 2,
                shadowy: 2,
            }
        })
        .size('1920x1080')
        .autopad('black')
        .output(tmpFileName)
        .on('start', function() {
            console.log("Rendering started");
        })
        .on('end', function () {
            console.log('Finished processing ' + dailyMedia.mediaDate);
            dailyMedia.tmpFilePath=tmpFileName;
            event.reply("video-rendered", dailyMedia);
        })
        .run();
}
const mergeVideos = (videoPaths, outputPath, event) => {
    let outputPathObject = path.parse(outputPath);
    outputPath = path.join(outputPathObject.dir, outputPathObject.name+'.mp4');
    const mergeCommand = new FfmpegCommand();
    videoPaths.forEach((path) => {
        try {
            fs.statSync(path);
        } catch (e) {
            console.log("File does not exist.");
            return;
        }
        mergeCommand.addInput(path);
    });
    mergeCommand
        .on('end', function () {
            event.reply("video-merged")
        }).mergeToFile(outputPath, app.getPath('temp'));
}


module.exports.createScreenshot = createScreenshot;
module.exports.renderVideo = renderVideo;
module.exports.mergeVideos = mergeVideos;
module.exports.createImagePreview = createImagePreview;