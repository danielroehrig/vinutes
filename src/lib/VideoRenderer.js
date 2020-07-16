const {app} = require("electron");
const path = require("path");
const fs = require("fs");
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
module.exports.createScreenshot = createScreenshot;