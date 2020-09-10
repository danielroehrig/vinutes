<template>
  <div>
    <MonthSelector></MonthSelector>
    <CalendarMonth></CalendarMonth>
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Delete Media</p>
        </header>
        <section class="modal-card-body">
          Do you want to delete media for xxx-xx-xx from this timeline?
        </section>
        <footer class="modal-card-foot">
          <button class="button">Cancel</button>
          <button class="button is-danger">Delete</button>
        </footer>
      </div>
    </div>
  </div>
</template>
<script>
import CalendarMonth from '@/components/calendar/CalendarMonth'
import MonthSelector from '@/components/calendar/MonthSelector'

export default {
  components: { MonthSelector, CalendarMonth }
}
</script>
