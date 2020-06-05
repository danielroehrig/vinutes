<template>
    <section class="section">
        <div class="container">
            <nav class="columns is-vcentered">
                <div class="column has-text-centered" v-on:click="$store.commit('moveToPreviousMonth')">Back</div>
                <div class="column has-text-centered is-three-fifths"><h1 class="title is-1">{{ formattedDate }}</h1></div>
                <div class="column has-text-centered">Forward</div>
            </nav>
        </div>
    </section>
</template>

<script>
    import moment from "moment";
    export default {
        name: "MonthSelector",
        data: function () {
            return {
                formattedDate: moment({year: this.$store.state.currentYear, month: this.$store.state.currentMonth}).format('MMMM, Y')
            }
        }
    }
</script>

<style scoped>

</style>