<template>
    <div class="modal is-active" v-if="this.$store.state.isVideoPlayerVisible">
        <div class="modal-background"></div>
        <div class="modal-content">
            <video width="400" controls>
                <source :src="videoSrc">
            </video>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="closeVideoPlayer"></button>
    </div>
</template>

<script>
    export default {
        name: "VideoPlayer",
        computed: {
            videoSrc() {
                return 'file://'+this.$store.state.currentDailyMediaShown.filePath;
            },
        },
        methods: {
            closeVideoPlayer: function () {
                this.$store.commit("hideVideoPlayer");
            },
        },
    };
</script>

<style scoped>

</style>