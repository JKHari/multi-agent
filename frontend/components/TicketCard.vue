<template>
  <article class="ml-0 mt-3 max-w-md overflow-hidden rounded-md border border-stone-200 bg-white shadow-panel">
    <div class="flex items-center justify-between bg-stone-900 px-5 py-4 text-white">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-emerald-300">Movie Ticket</p>
        <h3 class="mt-1 text-xl font-bold leading-tight">{{ ticket.title }}</h3>
      </div>
      <div class="rounded-md bg-emerald-500 px-3 py-2 text-sm font-bold text-stone-950">
        {{ ticket.seats }} seats
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 px-5 py-5 text-sm">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-stone-500">Theater</p>
        <p class="mt-1 font-semibold text-stone-900">{{ ticket.theater }}</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-stone-500">Location</p>
        <p class="mt-1 font-semibold text-stone-900">{{ ticket.location }}</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-stone-500">Date</p>
        <p class="mt-1 font-semibold text-stone-900">{{ ticket.date }}</p>
      </div>
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-stone-500">Time</p>
        <p class="mt-1 font-semibold text-stone-900">{{ ticket.time }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between border-t border-dashed border-stone-300 px-5 py-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-stone-500">Booking ID</p>
        <p class="mt-1 font-mono text-sm font-bold text-stone-950">{{ ticket.bookingId }}</p>
      </div>
      <span class="rounded-md bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
        Confirmed
      </span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  ticket: {
    type: Object,
    required: true
  }
})
</script>
