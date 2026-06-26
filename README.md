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
Jailer showtimes sollu
Refund TXN123456
Weather sollu
```

Hari should only answer movie ticket, showtime, booking, and refund questions.
