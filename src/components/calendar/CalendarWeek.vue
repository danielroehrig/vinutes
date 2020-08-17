<template>
    <div class="columns">
        <CalendarDay v-for="(day, index) in days" v-bind:day="day" v-bind:key="isoWeek+'-'+index"
                     @calendarDayClicked="calendarDayClicked"></CalendarDay>
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
      methods: {
        calendarDayClicked: function (day){
          console.log("Day "+day+" clicked");
        }
      }

    }
</script>

<style scoped>

</style>