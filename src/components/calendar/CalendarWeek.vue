<template>
    <div class="columns">
        <CalendarDay v-for="day in week" v-bind:day="day" v-bind:month=$store.state.currentMonth v-bind:year=$store.state.currentYear></CalendarDay>
    </div>
</template>

<script>
    import CalendarDay from "./CalendarDay";

    export default {
        name: "CalendarWeek",
        components: {CalendarDay},
        props: {
            week: Array,
        },
    }
</script>

<style scoped>

</style>