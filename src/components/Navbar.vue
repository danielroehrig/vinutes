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

            <div id="navbar" class="navbar-menu">

                <div class="navbar-start">
                    <div v-if="(timelines.length === 0 || currentTimeline === null)" class="navbar-item">
                        <button class="button" @click="showTimelineCreationModal">Create new Timeline</button>
                    </div>
                    <div v-else-if="timelines.length === 1" class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link" v-bind:key="timelines[0].id">
                            {{ timelines[0].name }}
                        </a>
                        <div class="navbar-dropdown">
                            <a class="navbar-item" @click="showTimelineCreationModal">
                                Create new Timeline
                            </a>
                        </div>
                    </div>
                    <div v-else class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link">
                            {{ currentTimeline.name }}
                        </a>
                        <div class="navbar-dropdown">
                            <a v-for="timeline in selectableTimelines" v-bind:key="timeline.id" class="navbar-item"
                               @click="setTimeline(timeline.id)">
                                {{ timeline.name }}
                            </a>
                            <hr class="navbar-divider">
                            <a class="navbar-item" @click="showTimelineCreationModal">
                                Create new Timeline
                            </a>
                        </div>
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
                            <input v-model="newTimelineName" class="input" type="text"
                                   placeholder="Enter name of the timeline">
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
    import {createNewTimeline, getAllTimelines, loadTimeline} from "../lib/TimelineService";

    export default {
        name: "Navbar",
        data: function () {
            return {
                isTimelineCreationModalShown: false,
                newTimelineName: null,
                timelines: getAllTimelines(),
            };
        },
        computed: {
            currentTimeline: function () {
                let currentTimeline = this.$store.state.currentTimeline;
                if(null === currentTimeline){
                    return null;
                }
                return loadTimeline(currentTimeline);
            },
            selectableTimelines: function () {
                return this.timelines.filter((timeline) => {
                    return timeline.id !== this.currentTimeline.id;
                });
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
            hideTimelineCreationModal: function () {
                this.isTimelineCreationModalShown = false;
            },
            createNewTimeline: function () {
                console.log("create new timeline");
                let timelineId = createNewTimeline(this.newTimelineName);
                this.timelines = getAllTimelines();
                this.$store.commit("changeTimeline", timelineId);
                this.newTimelineName = null;
                this.hideTimelineCreationModal();
                //TODO: Saving the timeline
            },
            setTimeline: function (id) {
                this.$store.commit("changeTimeline", id);
            },
        },
    };
</script>

<style scoped>

</style>