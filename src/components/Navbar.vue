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
                            <a class="button is-primary" @click="renderCurrentTimeline()">
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

    <RenderProgress v-if="this.$store.state.renderQueue.length>0 || this.$store.state.renderedQueue.length>0" :progress="renderProgress"></RenderProgress>
    </div>
</template>

<script>
    import {
        createNewTimeline,
        getAllTimelines,
        getDailyMediaForTimeline,
        loadTimeline,
    } from "../lib/TimelineService";
    import RenderProgress from "./RenderProgress";

    export default {
        name: "Navbar",
        components: {RenderProgress},
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
            renderProgress: function () {
                const renderQueueCount = this.$store.state.renderQueue.length + this.$store.state.renderedQueue.length;
                if(renderQueueCount>0){
                    return this.$store.state.renderedQueue.length / renderQueueCount * 100;
                }
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
                this.$store.dispatch("changeTimeline", timelineId);
                this.newTimelineName = null;
                this.hideTimelineCreationModal();
            },
            setTimeline: function (id) {
                this.$store.dispatch("changeTimeline", id);
            },
            renderCurrentTimeline: function () {
                let filePath = ipcRenderer.sendSync("show-save-dialog");
                if(null === filePath){
                    return;
                }
                this.$store.commit('setRenderOutputPath', filePath);
                let mediaFiles = getDailyMediaForTimeline(this.$store.state.currentTimeline);
                this.$store.dispatch('startRenderQueue', mediaFiles);
            }
        },
    };
</script>

<style scoped>

</style>