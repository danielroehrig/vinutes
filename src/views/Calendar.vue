<template>
    <div>
        <CalendarMonth month="3"></CalendarMonth>
    </div>
</template>
<script>
    import CalendarDay from "../components/calendar/CalendarDay";
    import CalendarMonth from "../components/calendar/CalendarMonth";
    export default {
        components: {CalendarMonth, CalendarDay}
    }
</script>