import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createOpenRouterClient } from './openrouter.js'
import { ticketToolSchemas } from './toolSchemas.js'
import { runTicketTool } from './ticketTools.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)
const model = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash'

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  })
)
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', agent: 'Hari' })
})

app.post('/api/chat', async (req, res) => {
  const userMessage = String(req.body?.message || '').trim()
  const history = Array.isArray(req.body?.history) ? req.body.history : []

  if (!userMessage) {
    return res.status(400).json({
      reply: 'Message is required.',
      action: 'none'
    })
  }

  try {
    const openrouter = createOpenRouterClient()
    const messages = buildMessages(history, userMessage)

    const firstResponse = await openrouter.chat.completions.create({
      model,
      messages,
      tools: ticketToolSchemas,
      tool_choice: 'auto',
      temperature: 0.3
    })

    const assistantMessage = firstResponse.choices[0]?.message
    const toolCalls = assistantMessage?.tool_calls || []

    if (toolCalls.length === 0) {
      return res.json(normalizeAssistantReply(assistantMessage?.content))
    }

    const toolResults = []
    const toolMessages = toolCalls.map((toolCall) => {
      const toolName = toolCall.function.name
      const toolArgs = safeJsonParse(toolCall.function.arguments)
      const result = runTicketTool(toolName, toolArgs)
      toolResults.push(result)

      return {
        role: 'tool',
        tool_call_id: toolCall.id,
        name: toolName,
        content: JSON.stringify(result)
      }
    })

    const finalResponse = await openrouter.chat.completions.create({
      model,
      messages: [
        ...messages,
        assistantMessage,
        ...toolMessages,
        {
          role: 'system',
          content:
            'Return one compact JSON object only with keys reply, action, ticketData, refundData. Use action "ask_confirmation" after prepare_booking, "ask_cancellation_confirmation" after prepare_cancellation, "show_ticket" after confirm_booking, "show_refund" after confirm_cancellation, and "none" otherwise.'
        }
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })

    const parsed = normalizeAssistantReply(
      finalResponse.choices[0]?.message?.content,
      toolResults
    )
    return res.json(parsed)
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      reply:
        'Hari side-la oru technical issue vandhuduchu. Konjam neram kazhichu try pannunga.',
      action: 'none'
    })
  }
})

function buildMessages(history, userMessage) {
  const sanitizedHistory = history
    .filter((item) => item && typeof item.content === 'string')
    .slice(-8)
    .map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: item.content
    }))

  return [
    {
      role: 'system',
      content: [
        'You are Hari, a polite and helpful Movie Ticket Booking Assistant.',
        'You are the Main Agent and route requests to General Agent tools, Booking Agent tools, and Support Agent tools.',
        'You can help users only with movie information, movie suggestions, showtimes, ticket booking, and refunds.',
        'If the user asks anything unrelated to movies, theaters, tickets, bookings, or refunds, politely decline.',
        'Use only the provided tools for movie, seat, booking, and refund data.',
        'Do not invent movie data, showtimes, seat availability, booking IDs, or refund status.',
        'Booking rule: never confirm a ticket on the first booking request. First call prepare_booking and ask the customer to confirm.',
        'Only call confirm_booking after the user clearly says yes, confirm, okay, or book it.',
        'If the user says no, cancel, or venam for a pending booking, call cancel_pending_booking. After cancellation, politely say this is a good film and they can think one more time, but respect their choice.',
        'After a successful confirmed booking, include a short movie review or mood note from the tool result.',
        'Cancellation rule: never cancel or refund a confirmed ticket on the first cancellation request. First call prepare_cancellation and ask the customer to confirm.',
        'When asking cancellation confirmation, say a friendly suggestion like: "Ungal ticket TXN... cancel panna poringa. Leo oru nalla padam, neenga marubadiyum yosikkalam, aana ungal viruppam mukkiyam. Confirm-a cancel pannalama?"',
        'Only call confirm_cancellation if the user clearly says yes, confirm, or asks to cancel it after a pending cancellation exists.',
        'If the user says no, venam, keep ticket, or does not want to cancel after a pending cancellation exists, call decline_cancellation and say the ticket is still active with an enjoy message.',
        'If the user asks for movie details or recommendations without a clear genre or mood, ask what type of movie they like before calling suggestions.',
        'Current app date is 2026-06-26. If users say tomorrow or nalaiku, resolve it as 2026-06-27.',
        'Return user-facing replies in the user language style. Tamil-English mixed replies are okay when the user uses Tanglish.'
      ].join(' ')
    },
    ...sanitizedHistory,
    {
      role: 'user',
      content: userMessage
    }
  ]
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value || '{}')
  } catch {
    return {}
  }
}

function normalizeAssistantReply(content, toolResults = []) {
  const successfulAction = [...toolResults]
    .reverse()
    .find((result) => result?.success && result?.action && result.action !== 'none')

  const fallback = {
    reply: content || 'Hari ready. Movie booking-ku enna help venum?',
    action: successfulAction?.action || 'none',
    ticketData: successfulAction?.ticketData || null,
    refundData: successfulAction?.refundData || null
  }

  if (!content) {
    return fallback
  }

  try {
    const parsed = JSON.parse(content)

    return {
      reply: typeof parsed.reply === 'string' ? parsed.reply : fallback.reply,
      action:
        successfulAction?.action ||
        (typeof parsed.action === 'string' ? parsed.action : 'none'),
      ticketData: successfulAction?.ticketData || parsed.ticketData || null,
      refundData: successfulAction?.refundData || parsed.refundData || null
    }
  } catch {
    return fallback
  }
}

app.listen(port, () => {
  console.log(`Hari movie ticket backend running at http://localhost:${port}`)
})
