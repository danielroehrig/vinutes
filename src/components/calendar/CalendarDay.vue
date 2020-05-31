<template>
    <div v-bind:class="{'column': true, 'active': (day !== 0) }" v-on:click="showVideoPlayer">{{ (day !== 0) ?
        formattedDate.format('ll') : 'nope' }}
    </div>
</template>

<script>
    import store from "../../store";

    const moment = require('moment');
    export default {
        name: "CalendarDay",
        props: {
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
        },
        methods: {
            showVideoPlayer: function (event) {
                console.log(event);
                this.$store.commit('toggleVideoPlayerVisibility');
            }
        }
    }
</script>

<style scoped>
    div {
        background-color: aliceblue;
    }

    div.active {
        background-color: red;
    }
</style>