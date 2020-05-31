<template>
    <div>
    <CalendarWeek v-for="week in weeks" v-bind:week="week" v-bind:year="year" v-bind:month="month"></CalendarWeek>
        <div class="modal is-active" v-if="this.$store.state.isVideoPlayerVisible">
            <div class="modal-background"></div>
            <div class="modal-content">
                Hier Video Player
            </div>
        </div>
    </div>
</template>

<script>
    import CalendarWeek from "./CalendarWeek";
    const calendar = require('calendar');
    let projectCalendar = new calendar.Calendar(0);

    export default {
        name: "CalendarMonth",
        components: {CalendarWeek},
        props: {
            'month': Number,
            'year': Number,
        },
        data: function () {
            const monthDates = projectCalendar.monthDays(this.year, this.month);
            return {
                weeks: monthDates,
            }
        }
    }
</script>

<style scoped>

</style>