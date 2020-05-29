<template>
    <div v-if="day !== 0">Calendar Day {{ day }}</div>
</template>

<script>
    export default {
        name: "CalendarDay",
        props:{
            day: Number
        }
    }
</script>

<style scoped>

</style>