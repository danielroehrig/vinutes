<template>
    <section class="section">
        <div class="container is-fluid" id="calendarContainer">
            <CalendarWeek v-for="week in weeks" v-bind:days="week.days" v-bind:key="week.isoWeek" v-bind:isoWeek="week.isoWeek"></CalendarWeek>
            <VideoPlayer></VideoPlayer>
        </div>
    </section>
</template>

<script>
    import CalendarWeek from "./CalendarWeek";
    import VideoPlayer from "../VideoPlayer";
    import { mapState } from 'vuex';
    import moment from 'moment';

    const calendar = require('calendar');
    let projectCalendar = new calendar.Calendar(1);

    export default {
        name: "CalendarMonth",
        components: {VideoPlayer, CalendarWeek},
        computed: {
            weeks() {
              let isoWeek = moment({'year': this.currentYear, 'month': this.currentMonth, 'day': 1}).isoWeek();
              let calendarWeeks = projectCalendar.monthDays(this.currentYear, this.currentMonth);
              let weeks = [];
              for(const week of calendarWeeks){
                weeks.push({
                  isoWeek: isoWeek++,
                  days: week,
                });
              }
              return weeks;
            },
            ...mapState([
              'currentYear',
              'currentMonth',
            ])
        },
        methods: {

        }
    }
</script>

<style scoped>

</style>