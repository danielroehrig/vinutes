<template>
    <div v-if="day !== 0" class="column">{{ formattedDate.format('ll') }}</div>
</template>

<script>
    const moment = require('moment');
    export default {
        name: "CalendarDay",
        props:{
            day: Number,
            year: Number,
            month: Number,
        },
        data: function () {
            return {
                formattedDate: moment({
                    "year": this.year,
                    "month": this.month,
                    "day": this.day
                }),
            }
        }
    }
</script>

<style scoped>
    div{
        background-color: aliceblue;
    }
</style>