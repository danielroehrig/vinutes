<template>
    <div class="column" style="padding: 5px;">
        <div class="box" v-bind:class="{'inactive': (day === 0) }" v-on:click="openMediaFileDialog">
            <div class="date">
                {{ (day !== 0) ?
                formattedDate.format('ddd, D. MMM, Y') : '' }}
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "CalendarDay",
        props: {
            day: Number,
        },
        computed: {
            formattedDate() {
                return moment({
                    "year": this.$store.state.currentYear,
                    "month": this.$store.state.currentMonth,
                    "day": this.day
                });
            }
        },
        methods: {
            openMediaFileDialog: function () {
                ipcRenderer.send('show-open-dialog', this.$store.state.currentYear, this.$store.state.currentYear);
            }
        }
    }
</script>

<style scoped>
    div.inactive {
        visibility: hidden;
    }
    div.box {
        width: 100%;
        padding: 56.25% 0 0 0 ;
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