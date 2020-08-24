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

</style>
<script>
import Navbar from "./components/Navbar";
import {initDBStructure} from "./lib/PersistenceService";

export default {
  components: {Navbar},
  //Before any window is created, load database structure
  beforeCreate() {
    //TODO Migration comes here
    initDBStructure();
  },
  //As soon as app is ready, load the last saved state
  mounted() {
    this.$store.dispatch("loadTimelines");
    this.$store.dispatch("loadLastState");
  },
};
</script>