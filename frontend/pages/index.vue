<template>
  <main class="fixed inset-0 overflow-hidden bg-[#f7f2ea]">
    <div class="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-4 lg:px-6">
      <section class="grid h-full min-h-0 grid-cols-1 overflow-hidden rounded-md border border-stone-200 bg-white shadow-panel lg:grid-cols-[360px_1fr]">
        <aside class="min-h-0 overflow-y-auto border-b border-stone-200 bg-stone-950 text-white lg:border-b-0 lg:border-r">
          <div class="p-6">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-md bg-emerald-500 text-lg font-black text-stone-950">
                H
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Main Agent
                </p>
                <h1 class="text-2xl font-bold leading-tight">Hari</h1>
              </div>
            </div>

            <p class="mt-5 text-sm leading-6 text-stone-300">
              Movie tickets, showtimes, booking confirmation, and refunds handled through a tool-based assistant.
            </p>
          </div>

          <div class="border-t border-stone-800 p-6">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-stone-400">
              Now Showing
            </h2>
            <div class="mt-4 space-y-3">
              <div
                v-for="movie in movies"
                :key="movie.title"
                class="rounded-md border border-stone-800 bg-stone-900 p-4"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-bold">{{ movie.title }}</h3>
                    <p class="mt-1 text-xs text-stone-400">{{ movie.theater }}</p>
                    <p class="mt-1 text-xs font-semibold text-emerald-300">{{ movie.genre }}</p>
                  </div>
                  <span class="rounded-md bg-stone-800 px-2 py-1 text-xs text-emerald-300">
                    {{ movie.language }}
                  </span>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="show in movie.showtimes"
                    :key="`${movie.title}-${show.date}-${show.time}`"
                    class="rounded-md bg-white/10 px-2 py-1 text-xs text-stone-200"
                  >
                    {{ show.time }} · {{ show.availableSeats }} left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section class="flex min-h-0 flex-col bg-stone-50">
          <header class="shrink-0 flex items-center justify-between gap-4 border-b border-stone-200 bg-white px-5 py-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Movie Ticket Booking Web App
              </p>
              <h2 class="text-xl font-bold text-stone-950">Chat with Hari</h2>
            </div>
            <div class="hidden rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 sm:block">
              Online
            </div>
          </header>

          <div ref="messagesEl" class="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
            <div
              v-for="message in messages"
              :key="message.id"
              class="space-y-2"
            >
              <ChatBubble :message="message" />
              <div v-if="message.action === 'show_ticket' && message.ticketData" class="pl-0">
                <TicketCard :ticket="message.ticketData" />
              </div>
              <div v-if="message.action === 'show_refund' && message.refundData" class="pl-0">
                <RefundCard :refund="message.refundData" />
              </div>
            </div>

            <div v-if="isLoading" class="flex justify-start">
              <div class="rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 shadow-sm">
                Hari is checking seats...
              </div>
            </div>
          </div>

          <div class="shrink-0 border-t border-stone-200 bg-white px-4 py-3">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="prompt in quickPrompts"
                :key="prompt"
                class="rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-emerald-500 hover:text-emerald-700"
                type="button"
                :disabled="isLoading"
                @click="sendMessage(prompt)"
              >
                {{ prompt }}
              </button>
            </div>
          </div>

          <ChatInput :disabled="isLoading" @send="sendMessage" />
        </section>
      </section>
    </div>
  </main>
</template>

<script setup>
import { nextTick, ref } from 'vue'

const config = useRuntimeConfig()
const messagesEl = ref(null)
const isLoading = ref(false)

const movies = [
  {
    title: 'Leo',
    theater: 'Vetri Cinemas',
    language: 'Tamil',
    genre: 'Action Thriller',
    showtimes: [
      { time: '10:00 AM', availableSeats: 50 },
      { time: '06:00 PM', availableSeats: 5 }
    ]
  },
  {
    title: 'Jailer',
    theater: 'Inox',
    language: 'Tamil',
    genre: 'Action Comedy',
    showtimes: [
      { time: '02:00 PM', availableSeats: 20 },
      { time: '09:30 PM', availableSeats: 12 }
    ]
  },
  {
    title: 'Vikram',
    theater: 'PVR Escape',
    language: 'Tamil',
    genre: 'Action Thriller',
    showtimes: [
      { time: '11:30 AM', availableSeats: 34 },
      { time: '07:15 PM', availableSeats: 18 }
    ]
  },
  {
    title: '96',
    theater: 'Sathyam Cinemas',
    language: 'Tamil',
    genre: 'Love Drama',
    showtimes: [
      { time: '01:00 PM', availableSeats: 28 },
      { time: '08:00 PM', availableSeats: 16 }
    ]
  }
]

const quickPrompts = [
  'Leo padathuku 2 ticket venum nalaiku morning',
  'Love movie suggest pannunga',
  'Confirm booking',
  'Cancel booking'
]

let messageId = 1

const messages = ref([
  {
    id: `message-${messageId++}`,
    sender: 'bot',
    reply:
      'Vanakkam, naan Hari. Movie showtimes, ticket booking, refund ellathukkum help pannuren. Entha padam paakalaam?',
    action: 'none'
  }
])

async function sendMessage(text) {
  if (isLoading.value) {
    return
  }

  const userText = text.trim()

  if (!userText) {
    return
  }

  messages.value.push({
    id: `message-${messageId++}`,
    sender: 'user',
    reply: userText,
    action: 'none'
  })

  await scrollToBottom()
  isLoading.value = true

  try {
    const history = messages.value.slice(0, -1).slice(-8).map((message) => ({
      role: message.sender === 'bot' ? 'assistant' : 'user',
      content: message.reply
    }))

    const response = await $fetch(`${config.public.apiBase}/api/chat`, {
      method: 'POST',
      body: {
        message: userText,
        history
      }
    })

    messages.value.push({
      id: `message-${messageId++}`,
      sender: 'bot',
      reply: response.reply,
      action: response.action || 'none',
      ticketData: response.ticketData || null,
      refundData: response.refundData || null
    })
  } catch {
    messages.value.push({
      id: `message-${messageId++}`,
      sender: 'bot',
      reply:
        'Hari backend connect aagala. Express server http://localhost:4000-la run aagudha check pannunga.',
      action: 'none'
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

async function scrollToBottom() {
  await nextTick()

  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}
</script>
