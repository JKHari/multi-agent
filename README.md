# Hari Movie Ticket Booking Demo

Proof of concept for a movie ticket booking chatbot using:

- Backend: Node.js, Express, OpenRouter API, in-memory movie/booking store
- Frontend: Nuxt 3, Vue 3, Tailwind CSS
- Main agent: Hari

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Update `backend/.env` with your OpenRouter key:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemini-2.5-flash
```

The backend runs on:

```txt
http://localhost:4000
```

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend runs on:

```txt
http://localhost:3000
```

## Demo Prompts

```txt
Leo padathuku 2 ticket venum nalaiku morning
Confirm booking
Cancel booking
Love movie suggest pannunga
Movie details sollu
Jailer showtimes sollu
Refund TXN123456
Yes cancel it
No keep ticket
Weather sollu
```

Hari should only answer movie ticket, showtime, booking, and refund questions.

## Booking Flow

Hari does not book tickets immediately. The Booking Agent first creates a pending booking and asks for confirmation. Seats are reduced only after the user confirms.

```txt
User asks for tickets
  -> prepare_booking
  -> Hari asks confirmation

User confirms
  -> confirm_booking
  -> ticket is booked
  -> movie ticket UI is shown

User cancels before confirmation
  -> cancel_pending_booking
  -> no seats are reduced
```

## Ticket Cancellation Flow

Confirmed tickets are not cancelled immediately. Hari first asks the customer to think once more, then cancels only after a clear yes.

```txt
User asks to cancel TXN747627
  -> prepare_cancellation
  -> Hari asks confirmation with a movie suggestion

User says yes
  -> confirm_cancellation
  -> ticket is cancelled
  -> seats are returned

User says no
  -> decline_cancellation
  -> ticket remains active
  -> Hari sends an enjoy message
```
