<template>
    <section class="section">
        <div class="container">
            <nav class="columns is-vcentered">
                <div class="column has-text-centered">Back</div>
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
        props: {
            month: Number,
            year: Number
        },
        data: function () {
            return {
                formattedDate: moment({year: this.year, month: this.month}).format('MMMM, Y')
            }
        }
    }
</script>

<style scoped>

</style>