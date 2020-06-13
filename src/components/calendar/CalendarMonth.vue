<template>
    <section class="section">
        <div class="container is-fluid">
            <CalendarWeek v-for="week in weeks" v-bind:week="week"></CalendarWeek>
            <div class="modal is-active" v-if="this.$store.state.isVideoPlayerVisible">
                <div class="modal-background"></div>
                <div class="modal-content">
                    Hier Video Player
                </div>
                <button class="modal-close is-large" aria-label="close" @click="closeVideoPlayer"></button>
            </div>
        </div>
    </section>
</template>

<script>
    import CalendarWeek from "./CalendarWeek";

    const calendar = require('calendar');
    let projectCalendar = new calendar.Calendar(1);

    export default {
        name: "CalendarMonth",
        components: {CalendarWeek},
        computed: {
            weeks() {
                return projectCalendar.monthDays(this.$store.state.currentYear, this.$store.state.currentMonth);
            }
        },
        methods: {
            closeVideoPlayer: function () {
                this.$store.commit('hideVideoPlayer');
            }
        }
    }
</script>

<style scoped>

</style>