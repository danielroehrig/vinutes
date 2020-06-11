<template>
    <div class="column" style="padding: 5px;">
        <div class="box" v-bind:class="{'inactive': (day === 0), 'withMedia': (dailyMedia) }" v-on:click="openMediaFileDialog">
            <div class="date">
                {{ (day !== 0) ?
                momentToday.format('ddd, D. MMM, Y') : '' }} {{ dailyMedia }}
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {mapState} from 'vuex';
    import DailyMedia from "../../lib/DailyMedia";

    let currentDailyMedia = null;

    export default {
        name: "CalendarDay",
        props: {
            day: Number,
        },
        computed: {
            ...mapState([
                'currentYear',
                'currentMonth',
                'mediaFiles',
            ]),
            momentToday() {
                return moment({
                    "year": this.currentYear,
                    "month":this.currentMonth,
                    "day": this.day
                });
            },
            dailyMedia() {
                return this.mediaFiles['k'+moment({
                    "year": this.currentYear,
                    "month":this.currentMonth,
                    "day": this.day
                }).format('YYYYMMDD')];
            }
        },
        methods: {
            openMediaFileDialog: function () {
                let dailyMedia = ipcRenderer.sendSync('show-open-dialog', this.currentYear, this.currentMonth, this.day);
                this.$store.commit('changeMediaFile', dailyMedia);
            }
        },
    }
</script>

<style scoped>
    div.inactive {
        visibility: hidden;
    }
    div.hasDateMedia {
        background-color: #2c3e50;
    }

    div.box {
        width: 100%;
        padding: 56.25% 0 0 0;
        position: relative; /* If you want text inside of it */
    }

    div.date {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        padding: 20px;
    }

    div.box:hover {
        background-color: hsl(171, 100%, 41%);
        color: white;
        cursor: pointer;
    }
</style>