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

    export default {
        components: {Navbar},
        mounted() {
            ipcRenderer.on("screenshot-created", (event, dailyMedia) => {
                this.$store.commit("changeMediaFile", dailyMedia);
            });
            let config = ipcRenderer.sendSync("load-config");
            this.$store.commit("changeLanguage", config.language.toLowerCase());
        },
    };
</script>