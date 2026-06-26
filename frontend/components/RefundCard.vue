<template>
  <article class="mt-3 max-w-md rounded-md border border-amber-200 bg-amber-50 px-5 py-4 text-sm shadow-sm">
    <div class="flex items-center justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-amber-700">Refund Processed</p>
        <h3 class="mt-1 text-lg font-bold text-stone-900">{{ refund.title }}</h3>
      </div>
      <span class="rounded-md bg-white px-3 py-1 text-xs font-bold uppercase text-amber-700">
        Cancelled
      </span>
    </div>
    <dl class="mt-4 grid grid-cols-2 gap-3 text-stone-800">
      <div>
        <dt class="text-xs font-semibold uppercase text-stone-500">Booking ID</dt>
        <dd class="mt-1 font-mono font-bold">{{ refund.bookingId }}</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase text-stone-500">Seats</dt>
        <dd class="mt-1 font-bold">{{ refund.seats }}</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase text-stone-500">Date</dt>
        <dd class="mt-1 font-bold">{{ refund.date }}</dd>
      </div>
      <div>
        <dt class="text-xs font-semibold uppercase text-stone-500">Time</dt>
        <dd class="mt-1 font-bold">{{ refund.time }}</dd>
      </div>
    </dl>
  </article>
</template>

<script setup>
defineProps({
  refund: {
    type: Object,
    required: true
  }
})
</script>
