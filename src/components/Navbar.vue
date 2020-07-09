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
                <div class="box">
                    <div class="field">
                        <label class="label">Name</label>
                        <div class="control">
                            <input v-model="newTimelineName" class="input" type="text" placeholder="Enter name of the timeline">
                        </div>
                    </div>
                    <div class="field is-grouped">
                        <div class="control">
                            <button class="button is-link" @click="createNewTimeline">Submit</button>
                        </div>
                        <div class="control">
                            <button class="button is-link is-light" @click="cancelTimelineCreation">Cancel</button>
                        </div>
                    </div>
                </div>
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
                newTimelineName: null,
            };
        },
        computed: {
            timelines() {
                return getAllTimelines();
            },
        },
        methods: {
            showTimelineCreationModal: function () {
                this.isTimelineCreationModalShown = true;
            },
            cancelTimelineCreation: function () {
                this.newTimelineName = null;
                this.hideTimelineCreationModal();
            },
            hideTimelineCreationModal: function() {
                this.isTimelineCreationModalShown = false;
            },
            createNewTimeline: function () {
                console.log("create new timeline");
                //TODO: Saving the timeline
                this.newTimelineName = null;
                this.hideTimelineCreationModal();
            }
        },
    };
</script>

<style scoped>

</style>