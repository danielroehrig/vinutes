<template>
    <div class="modal is-active" v-if="isVisible">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="columns">
                <div class="column">
                    <video width="400" id="videoPreviewPlayer" controls>
                        <source :src="videoSrc">
                    </video>
                </div>
            </div>
            <div class="columns">
                <div class="column"><button class="button" value="Cancel" @click="closeVideoPlayer">Cancel</button></div>
                <div class="column"><button class="button is-primary" @click="acceptVideo">Accept</button></div>
            </div>
        </div>
        <button class="modal-close is-large" @click="closeVideoPlayer"></button>
    </div>
</template>

<script>
    import * as sc from "@/store-constants";
    export default {
        name: "VideoPlayer",
        computed: {
            videoSrc() {
                return "file://" + this.$store.state.currentDailyMediaShown.filePath;
            },
          isVisible() {
            return this.$store.state.appState === sc.APP_STATE_VIDEO_PLAYER;
          }
        },
        methods: {
            closeVideoPlayer: function () {
                this.$store.commit('changeAppState', sc.APP_STATE_CALENDAR_VIEW);
            },
            acceptVideo: function () {
                const videoPreviewPlayer = document.getElementById('videoPreviewPlayer');
                let currentDailyMedia = this.$store.state.currentDailyMediaShown;
                let currentTimeline = this.$store.state.currentTimeline;
                this.$store.dispatch('acceptVideo', videoPreviewPlayer.currentTime);
                ipcRenderer.send('create-video-screenshot', currentDailyMedia, currentTimeline);
            }
        },
    };
</script>

<style scoped>
    .columns{
        overflow: hidden;
    }
    .modal-content{
        overflow: hidden;
    }
</style>