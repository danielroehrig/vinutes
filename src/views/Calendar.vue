<template>
    <div>
        <MonthSelector v-bind:month=month v-bind:year=year></MonthSelector>
        <CalendarMonth v-bind:month=month v-bind:year=year></CalendarMonth>
    </div>
</template>
<script>
    import CalendarDay from "../components/calendar/CalendarDay";
    import CalendarWeek from "../components/calendar/CalendarWeek";
    import CalendarMonth from "../components/calendar/CalendarMonth";
    import MonthSelector from "../components/calendar/MonthSelector";
    export default {
        components: {MonthSelector, CalendarMonth, CalendarDay, CalendarWeek},
        data: function () {
            return {
                month: 3,
                year: 2020
            }
        }
    }
</script>