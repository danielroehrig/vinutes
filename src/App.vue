<template>
    <div id="app">
        <Navbar></Navbar>
        <router-view/>
    </div>
</template>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    #nav {
        padding: 30px;
    }

    #nav a {
        font-weight: bold;
        color: #2c3e50;
    }

    #nav a.router-link-exact-active {
        color: #42b983;
    }
</style>
<script>
    import Navbar from "./components/Navbar";
    import {applyConfig, configValidate} from "./lib/ConfigService";
    import Timeline from "./lib/Timeline";

    export default {
        components: {Navbar},
        mounted() {
            ipcRenderer.on("screenshot-created", (event, dailyMedia) => {
                this.$store.commit("changeMediaFile", dailyMedia);
            });
            ipcRenderer.on("file-written", event => {
                console.log("File written");
            });
            init(this.$store);
        },
    };

    /**
     *
     * @param {Store} store
     */
    const init = (store) => {
        const config = readConfig(store);
        applyConfig(config, store);
        //TODO: Might not exist, on first boot e.g
        let timeline = getCurrentTimeline(config);
        store.commit("changeTimeline", timeline);

    };
    const currentTimelinePath = (config) => {
        return config.currentTimeline.path;
    };

    const readConfig = () => {
        let configJson = ipcRenderer.sendSync("read-file-sync", "config.json");
        if (configJson instanceof Error) {
            console.log("Error while reading config: " + configJson.message);
            ipcRenderer.send("app-exit", 1);
            window.close();
        }

        return configJson;
    };

    const getCurrentTimeline = (config) => {
        if (config.currentTimeline.path) {
            const timelineJson = ipcRenderer.sendSync("read-file-sync", config.currentTimeline.path);
            //TODO: look for another timeline before creating one
            if (null === timelineJson) {
                return new Timeline("Default", 1);
            }
            return Timeline.from(timelineJson);//TODO this might also fail
        }
        return new Timeline("Default", 1);
    };

    const configWriter = (mutation, state) => {
        let isStateValidConfig = configValidate(state);
        if (!isStateValidConfig) {
            console.log(configValidate.errors);
            ipcRenderer.send("app-exit", 1);
        }
        ipcRenderer.send("write-file", state, "config.json");
    };
</script>