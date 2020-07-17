const {ipcRenderer, app} = require("electron");
const path = require("path");
const fs = require("fs");
const ffmpegPath = path.join(app.getAppPath(), '..', 'public', "bin", "amd64", "ffmpeg");
const ffprobePath = path.join('public', "bin", "amd64", "ffmpeg");//TODO: might be unnecessary
const FfmpegCommand = require("fluent-ffmpeg");
FfmpegCommand.setFfmpegPath(ffmpegPath);
FfmpegCommand.setFfprobePath(ffprobePath);



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

const renderVideo = (dailyMedia, tmpFolder, event) => {
    const dateName = moment(dailyMedia.mediaDate).format('LL');
    const ffmpeg =  new FfmpegCommand().addInput(dailyMedia.path);
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
        .output(path.join(tmpFolder, dailyMedia.mediaDate + ".mp4"))
        .on('start', function() {
            console.log("Rendering started");
        })
        .on('end', function () {
            console.log('Finished processing ' + vid.date);
            event.reply("video-rendered", dailyMedia);
        })
        .run();
}

module.exports.createScreenshot = createScreenshot;
module.exports.renderVideo = renderVideo;