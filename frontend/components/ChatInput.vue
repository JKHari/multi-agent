<template>
  <form class="shrink-0 flex items-end gap-3 border-t border-stone-200 bg-white p-4" @submit.prevent="submit">
    <label class="sr-only" for="chat-input">Message Hari</label>
    <textarea
      id="chat-input"
      v-model="draft"
      class="max-h-32 min-h-12 flex-1 resize-none rounded-md border border-stone-300 bg-stone-50 px-4 py-3 text-sm leading-5 text-stone-900 outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
      placeholder="Ask Hari: Leo padathuku 2 ticket venum nalaiku morning"
      rows="1"
      @keydown.enter.exact.prevent="submit"
    />
    <button
      class="inline-flex h-12 items-center justify-center rounded-md bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
      type="submit"
      :disabled="disabled || !draft.trim()"
    >
      Send
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['send'])
const draft = ref('')

function submit() {
  const message = draft.value.trim()

  if (!message) {
    return
  }

  emit('send', message)
  draft.value = ''
}
</script>
