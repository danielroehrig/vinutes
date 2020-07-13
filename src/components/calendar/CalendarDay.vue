<template>
    <div class="column" style="padding: 5px;">
        <div class="box" :class="{'inactive': (day === 0), 'withMedia': (dailyMedia) }" :style="styling"
             @click="openMediaFileDialog">
            <div class="date">
                {{ (day !== 0) ?
                momentToday.format(timestampFormatting) : "" }}
            </div>
        </div>
    </div>
</template>

<script>
    import moment from "moment";
    import {mapMutations, mapState} from "vuex";

    export default {
        name: "CalendarDay",
        props: {
            day: Number,
        },
        computed: {
            ...mapState([
                "currentYear",
                "currentMonth",
                "mediaFiles",
            ]),
            momentToday() {
                moment.locale(this.$store.state.language);
                return moment({
                    "year": this.currentYear,
                    "month": this.currentMonth,
                    "day": this.day,
                });
            },
            timestampFormatting() {
                return this.$store.state.calendarTimeStampFormat;
            },
            dailyMedia() {
                return this.mediaFiles[this.day];
            },
            styling() {
                /*let mediaFile = this.mediaFiles[this.generateMediaFilesKey()];
                if (mediaFile) {
                    const currentFileType = fileTypeCategory(mediaFile);
                    if (currentFileType === "video" && mediaFile.screenshotPath !== null) {//TODO: Check if not yet deleted
                        return {
                            backgroundImage: "url('file://" + mediaFile.screenshotPath + "')",
                        };
                    } else if (currentFileType === "image") {
                        return {
                            backgroundImage: "url('file://" + mediaFile.filePath + "')",
                        };
                    }
                }*/
                return {};
            },
        },
        methods: {
            ...mapMutations([
                "removeMediaFile",
                "showVideoPlayer",
            ]),
            openMediaFileDialog: function () {
                let dailyMedia = ipcRenderer.sendSync("show-open-dialog", this.currentYear, this.currentMonth, this.day);
                if (null !== dailyMedia) {
                    this.showVideoPlayer(dailyMedia);
                }
            },
            currentMoment: function () {
                return moment({
                    "year": this.currentYear,
                    "month": this.currentMonth,
                    "day": this.day,
                });
            },
        },
    };
</script>

<style scoped>
    div.inactive {
        visibility: hidden;
    }

    div.withMedia {
        background-position: center;
        background-size: cover;
        color: white;
        text-shadow: 1px 1px #333333;
    }

    div.box {
        width: 100%;
        padding: 56.25% 0 0 0;
        position: relative; /* If you want text inside of it */
    }

    div.date {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        padding: 20px;
    }

    div.box:hover {
        background-color: hsl(171, 100%, 41%);
        color: white;
        cursor: pointer;
    }
</style>