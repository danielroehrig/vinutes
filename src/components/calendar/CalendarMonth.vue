<template>
    <div>
    <CalendarDay v-for="day in days"></CalendarDay>

    </div>
</template>

<script>
    import CalendarDay from "./CalendarDay";
    export default {
        name: "CalendarMonth",
        components: {CalendarDay},
        props: ['month'],
        data: function () {
            return {
                days: [2,3,4]
            }
        },
    }
</script>

<style scoped>

</style>