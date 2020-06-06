<template>
    <section class="section">
        <div class="container">
            <nav class="columns is-vcentered">
                <div class="column has-text-centered" v-on:click="moveToPreviousMonth">Back</div>
                <div class="column has-text-centered is-three-fifths"><h1 class="title is-1">{{ formattedDate }}</h1></div>
                <div class="column has-text-centered" v-on:click="moveToNextMonth">Forward</div>
            </nav>
        </div>
    </section>
</template>

<script>
    import moment from "moment";
    export default {
        name: "MonthSelector",
        computed: {
            formattedDate ()
            {
                return moment({year: this.$store.state.currentYear, month: this.$store.state.currentMonth}).format('MMMM, Y');
            }
        },
        methods: {
            moveToPreviousMonth: function () {
                this.$store.commit('moveToPreviousMonth');
            },
            moveToNextMonth: function () {
                this.$store.commit('moveToNextMonth');
            }
        }
    }
</script>

<style scoped>

</style>