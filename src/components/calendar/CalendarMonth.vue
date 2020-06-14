<template>
    <section class="section">
        <div class="container is-fluid">
            <CalendarWeek v-for="week in weeks" v-bind:week="week"></CalendarWeek>
            <VideoPlayer></VideoPlayer>
        </div>
    </section>
</template>

<script>
    import CalendarWeek from "./CalendarWeek";
    import VideoPlayer from "../VideoPlayer";

    const calendar = require('calendar');
    let projectCalendar = new calendar.Calendar(1);

    export default {
        name: "CalendarMonth",
        components: {VideoPlayer, CalendarWeek},
        computed: {
            weeks() {
                return projectCalendar.monthDays(this.$store.state.currentYear, this.$store.state.currentMonth);
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>