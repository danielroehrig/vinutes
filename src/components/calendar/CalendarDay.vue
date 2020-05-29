<template>
    <div v-bind:class="{'column': true, 'active': (day !== 0) }">{{ (day !== 0) ? formattedDate.format('ll') : 'nope' }}</div>
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
    div.active {
        background-color: red;
    }
</style>