<template>
    <div class="container">
        <div class="field has-text-left">
            <label class="label">Language</label>
            <div class="control">
                <div class="select">
                    <select v-model="language">
                        <option value="de">Deutsch</option>
                        <option value="en">English</option>
                    </select>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Preferences",
        computed: {
            language: {
                set(language) {
                    console.log("Set Language " + language);
                    this.$store.commit("changeLanguage", language);
                },
                get() {
                    console.log("Get Language " + this.$store.state.language);
                    return this.$store.state.language;
                },
            },
        },
        methods: {},
    };
</script>

<style scoped>

</style>