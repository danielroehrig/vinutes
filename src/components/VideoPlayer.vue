<template>
    <div class="modal is-active" v-if="this.$store.state.isVideoPlayerVisible">
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
    export default {
        name: "VideoPlayer",
        computed: {
            videoSrc() {
                return "file://" + this.$store.state.currentDailyMediaShown.filePath;
            },
        },
        methods: {
            closeVideoPlayer: function () {
                this.$store.commit("hideVideoPlayer");
            },
            acceptVideo: function () {
                const videoPreviewPlayer = document.getElementById('videoPreviewPlayer');
                this.$store.dispatch('saveTimeStamp', videoPreviewPlayer.currentTime);
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