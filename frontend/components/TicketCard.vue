<template>
  <article class="relative mt-3 max-w-xl overflow-hidden rounded-md border border-stone-300 bg-[#fffdf7] shadow-panel">
    <div class="absolute -left-4 top-[58%] h-8 w-8 rounded-full border border-stone-300 bg-stone-50" />
    <div class="absolute -right-4 top-[58%] h-8 w-8 rounded-full border border-stone-300 bg-stone-50" />

    <div class="grid gap-0 sm:grid-cols-[1fr_132px]">
      <section class="min-w-0">
        <div class="flex items-start justify-between gap-4 bg-stone-950 px-5 py-4 text-white">
          <div class="min-w-0">
            <p class="text-xs font-bold uppercase tracking-wide text-emerald-300">
              Movie Ticket
            </p>
            <h3 class="mt-1 break-words text-2xl font-black leading-tight">
              {{ ticket.title }}
            </h3>
            <p class="mt-1 text-sm text-stone-300">{{ ticket.theater }}</p>
          </div>
          <span class="shrink-0 rounded-md bg-emerald-500 px-3 py-1 text-xs font-black uppercase text-stone-950">
            Confirmed
          </span>
        </div>

        <div class="grid grid-cols-2 gap-x-5 gap-y-4 px-5 py-5 text-sm sm:grid-cols-4">
          <div class="col-span-2">
            <p class="text-xs font-bold uppercase tracking-wide text-stone-500">Location</p>
            <p class="mt-1 font-bold text-stone-950">{{ ticket.location }}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-stone-500">Date</p>
            <p class="mt-1 font-bold text-stone-950">{{ ticket.date }}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-stone-500">Time</p>
            <p class="mt-1 font-bold text-stone-950">{{ ticket.time }}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-stone-500">Seats</p>
            <p class="mt-1 font-bold text-stone-950">{{ ticket.seats }}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-stone-500">Screen</p>
            <p class="mt-1 font-bold text-stone-950">{{ ticket.screen || 'Audi 1' }}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-stone-500">Language</p>
            <p class="mt-1 font-bold text-stone-950">{{ ticket.language }}</p>
          </div>
          <div>
            <p class="text-xs font-bold uppercase tracking-wide text-stone-500">Genre</p>
            <p class="mt-1 font-bold text-stone-950">{{ ticket.genre || 'Movie' }}</p>
          </div>
        </div>

        <div class="border-t border-dashed border-stone-300 px-5 py-4">
          <p class="text-xs font-bold uppercase tracking-wide text-stone-500">Booking ID</p>
          <p class="mt-1 font-mono text-base font-black text-stone-950">
            {{ ticket.bookingId }}
          </p>
        </div>
      </section>

      <aside class="flex border-t border-dashed border-stone-300 bg-stone-100 p-4 sm:border-l sm:border-t-0">
        <div class="flex w-full flex-row items-center justify-between gap-4 sm:flex-col">
          <div class="text-left sm:text-center">
            <p class="text-xs font-black uppercase tracking-wide text-stone-500">Admit</p>
            <p class="mt-1 text-3xl font-black text-stone-950">{{ ticket.seats }}</p>
          </div>
          <div class="h-16 w-28 overflow-hidden rounded-sm bg-white p-2 sm:h-32 sm:w-full">
            <div class="flex h-full items-end justify-center gap-[3px]">
              <span
                v-for="bar in barcodeBars"
                :key="bar.id"
                class="block bg-stone-950"
                :style="{ width: `${bar.width}px`, height: `${bar.height}%` }"
              />
            </div>
          </div>
          <p class="max-w-28 break-all text-right font-mono text-[10px] font-bold uppercase leading-4 text-stone-600 sm:text-center">
            {{ ticket.bookingId }}
          </p>
        </div>
      </aside>
    </div>

    <p
      v-if="ticket.reviewNote"
      class="border-t border-dashed border-stone-300 bg-emerald-50 px-5 py-3 text-sm font-semibold leading-6 text-emerald-900"
    >
      {{ ticket.reviewNote }}
    </p>
  </article>
</template>

<script setup>
const barcodeBars = [
  { id: 1, width: 2, height: 82 },
  { id: 2, width: 5, height: 64 },
  { id: 3, width: 3, height: 92 },
  { id: 4, width: 7, height: 70 },
  { id: 5, width: 2, height: 88 },
  { id: 6, width: 4, height: 58 },
  { id: 7, width: 6, height: 96 },
  { id: 8, width: 3, height: 76 },
  { id: 9, width: 5, height: 90 },
  { id: 10, width: 2, height: 68 },
  { id: 11, width: 7, height: 84 },
  { id: 12, width: 3, height: 62 }
]

defineProps({
  ticket: {
    type: Object,
    required: true
  }
})
</script>
