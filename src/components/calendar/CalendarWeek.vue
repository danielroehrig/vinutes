<template>
    <div class="columns">
        <CalendarDay v-for="day in week" v-bind:day="day"></CalendarDay>
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