<template>
  <div>
    <MonthSelector></MonthSelector>
    <CalendarMonth></CalendarMonth>
    <DeleteMediaDialog/>
  </div>
</template>
<script>
import CalendarMonth from '@/components/calendar/CalendarMonth'
import MonthSelector from '@/components/calendar/MonthSelector'
import DeleteMediaDialog from '@/components/DeleteMediaDialog'

export default {
  components: { DeleteMediaDialog, MonthSelector, CalendarMonth }
}
</script>
