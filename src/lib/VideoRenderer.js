const {app} = require("electron");
const path = require("path");
const ffmpegPath = path.join(app.getAppPath(), '..', 'public', "bin", "amd64", "ffmpeg");
const ffprobePath = path.join('public', "bin", "amd64", "ffmpeg");
console.log(ffmpegPath);
const FfmpegCommand = require("fluent-ffmpeg");
FfmpegCommand.setFfmpegPath(ffmpegPath);
FfmpegCommand.setFfprobePath(ffprobePath);
const screenshotsFolder = path.join(app.getPath("userData"), "screenshots");

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
        folder: "/tmp",
        size: "320x240",
    }).on("end", function () {
        console.log("screenshot created?");
        dailyMedia.screenshotPath = "/tmp/test.jpg";
        event.reply("screenshot-created", dailyMedia);
    });
};
module.exports.createScreenshot = createScreenshot;