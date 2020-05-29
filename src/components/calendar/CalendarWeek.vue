<template>
    <div class="columns">
        <CalendarDay v-for="day in week" v-bind:day="day" v-bind:month="month" v-bind:year="year"></CalendarDay>
    </div>
</template>

<script>
    import CalendarDay from "./CalendarDay";

    export default {
        name: "CalendarWeek",
        components: {CalendarDay},
        props: {
            week: Array,
            month: Number,
            year: Number,
        }
    }
</script>

<style scoped>

</style>