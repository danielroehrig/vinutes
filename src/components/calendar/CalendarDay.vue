<template>
    <div v-bind:class="{'column': true, 'active': (day !== 0) }" v-on:click="openMediaFileDialog">{{ (day !== 0) ?
        formattedDate.format('ll') : 'nope' }}
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
    div {
        background-color: aliceblue;
    }

    div.active {
        background-color: red;
    }
</style>