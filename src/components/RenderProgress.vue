<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="columns">
                <div class="column">
                    <progress class="progress is-primary" :value="progress" max="100">{{ progress }}%</progress>
                </div>
            </div>
            <div class="columns">
                <div class="column"><button class="button" value="Cancel">Cancel</button></div>
            </div>
        </div>
        <button class="modal-close is-large"></button>
    </div>
</template>

<script>
export default {
  name: 'RenderProgress',
  props: {
    progress: Number
  },
  computed: {

  },
  methods: {
  }
}
</script>

<style scoped>
    .columns{
        overflow: hidden;
    }
    .modal-content{
        overflow: hidden;
    }
</style>
