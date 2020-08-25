<template>
    <div class="columns">
        <CalendarDay v-for="(day, index) in days" v-bind:day="day" v-bind:key="isoWeek+'-'+index"></CalendarDay>
    </div>
</template>

<script>
    import CalendarDay from "./CalendarDay";

    export default {
        name: "CalendarWeek",
        components: {CalendarDay},
        props: {
            days: Array,
            isoWeek: Number,
        },
    }
</script>

<style scoped>

</style>