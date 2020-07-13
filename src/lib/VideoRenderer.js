const {app} = require("electron");
const path = require("path");
const ffmpegPath = path.join(app.getAppPath(), '..', 'public', "bin", "amd64", "ffmpeg");
const ffprobePath = path.join('public', "bin", "amd64", "ffmpeg");
console.log(ffmpegPath);
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

    new FfmpegCommand(dailyMedia.filePath).screenshots({
        timestamps: [dailyMedia.timeStamp],
        filename: "test.jpg",
        folder: "/tmp",//TODO: Get user temp folder
        size: "320x180",
    }).on("end", function () {
        console.log("screenshot created");
        let buff = fs.readFileSync('stack-abuse-logo.png');
        let base64data = buff.toString('base64');

        dailyMedia.screenshotPath = "/tmp/test.jpg";
        event.reply("screenshot-created", dailyMedia);
    });
};
module.exports.createScreenshot = createScreenshot;