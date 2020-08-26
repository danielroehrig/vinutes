<template>
    <div>
        <MonthSelector></MonthSelector>
        <CalendarMonth></CalendarMonth>
    </div>
</template>
<script>
import CalendarDay from '../components/calendar/CalendarDay'
import CalendarWeek from '../components/calendar/CalendarWeek'
import CalendarMonth from '../components/calendar/CalendarMonth'
import MonthSelector from '../components/calendar/MonthSelector'
export default {
  components: { MonthSelector, CalendarMonth, CalendarDay, CalendarWeek }
}
</script>
