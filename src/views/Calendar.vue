<template>
    <div>
        <CalendarMonth v-bind:month="3" v-bind:year="2020"></CalendarMonth>
    </div>
</template>
<script>
    import CalendarDay from "../components/calendar/CalendarDay";
    import CalendarWeek from "../components/calendar/CalendarWeek";
    import CalendarMonth from "../components/calendar/CalendarMonth";
    export default {
        components: {CalendarMonth, CalendarDay, CalendarWeek}
    }
</script>