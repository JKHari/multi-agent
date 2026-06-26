<template>
  <div class="flex" :class="message.sender === 'user' ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[82%] rounded-md px-4 py-3 text-sm leading-6 shadow-sm"
      :class="
        message.sender === 'user'
          ? 'bg-emerald-700 text-white'
          : 'border border-stone-200 bg-white text-stone-800'
      "
    >
      <div
        v-if="message.sender === 'bot'"
        class="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700"
      >
        Hari
      </div>
      <p class="whitespace-pre-line">{{ message.reply }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: Object,
    required: true
  }
})
</script>
