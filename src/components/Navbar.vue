<template>
    <div>
        <nav class="navbar is-dark" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <div class="navbar-item">
                    <router-link to="/"><img src="img/shutterIcon.png" width="28" height="28"></router-link>
                </div>

                <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
                   data-target="navbarBasicExample">
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>

            <div id="navbarBasicExample" class="navbar-menu">
                <div class="navbar-start">
                    <div class="navbar-item">
                        <button class="button" @click="showTimelineCreationModal">Create new Timeline</button>
                    </div>
                </div>

                <div class="navbar-end">
                    <div class="navbar-item">
                        <div class="buttons">
                            <a class="button is-primary">
                                <strong>Render</strong>
                            </a>
                            <router-link to="/preferences">
                                <span class="button mdi mdi-24px mdi-cog"></span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="modal" :class="{'is-active': isTimelineCreationModalShown }">
            <div class="modal-background"></div>
            <div class="modal-content">
                <!-- Any other Bulma elements you want -->
            </div>
            <button class="modal-close is-large" aria-label="close" @click="cancelTimelineCreation"></button>
        </div>

    </div>
</template>

<script>
    import {getAllTimelines} from "../lib/TimelineService";

    export default {
        name: "Navbar",
        data: function () {
            return {
                isTimelineCreationModalShown: false,
            }
        },
        computed: {
            timelines() {
                return getAllTimelines();
            },
        },
        methods: {
            showTimelineCreationModal: function () {
                console.log("Yes");
                this.isTimelineCreationModalShown = true;
            },
            cancelTimelineCreation: function () {
                console.log("Yes");
                this.isTimelineCreationModalShown = false;
            },
        },
    };
</script>

<style scoped>

</style>