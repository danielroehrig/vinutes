<template>
    <div>
        <MonthSelector></MonthSelector>
        <CalendarMonth></CalendarMonth>
    </div>
</template>
<script>
import CalendarMonth from '@/components/calendar/CalendarMonth'
import MonthSelector from '@/components/calendar/MonthSelector'
export default {
  components: { MonthSelector, CalendarMonth }
}
</script>
