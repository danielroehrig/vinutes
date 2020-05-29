<template>
    <div>
    <CalendarWeek v-for="week in weeks" v-bind:week="week"></CalendarWeek>
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
        },
    }
</script>

<style scoped>

</style>