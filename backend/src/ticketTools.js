import { moviesData, userBookingsCache } from './store.js'

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function createBookingId() {
  return `TXN${Math.floor(100000 + Math.random() * 900000)}`
}

function findMovie(movieName) {
  const requestedMovie = normalize(movieName)
  return moviesData.find((movie) => normalize(movie.title) === requestedMovie)
}

function findShowtime(movie, date, time) {
  const requestedDate = String(date || '').trim()
  const requestedTime = normalize(time)

  return movie.showtimes.find(
    (showtime) =>
      showtime.date === requestedDate && normalize(showtime.time) === requestedTime
  )
}

export function getMoviesInfo() {
  return {
    success: true,
    movies: moviesData
  }
}

export function bookTicket({ movieName, date, time, seatCount }) {
  const seats = Number(seatCount)

  if (!movieName || !date || !time || !Number.isInteger(seats) || seats <= 0) {
    return {
      success: false,
      reason: 'missing_or_invalid_booking_details',
      message: 'Movie name, date, time, and a valid seat count are required.'
    }
  }

  const movie = findMovie(movieName)

  if (!movie) {
    return {
      success: false,
      reason: 'movie_not_found',
      message: `Movie "${movieName}" is not available.`,
      availableMovies: moviesData.map((item) => item.title)
    }
  }

  const showtime = findShowtime(movie, date, time)

  if (!showtime) {
    return {
      success: false,
      reason: 'showtime_not_found',
      message: `${movie.title} is not available for ${date} at ${time}.`,
      availableShowtimes: movie.showtimes
    }
  }

  if (showtime.availableSeats < seats) {
    return {
      success: false,
      reason: 'not_enough_seats',
      message: `Only ${showtime.availableSeats} seats are available.`,
      availableSeats: showtime.availableSeats
    }
  }

  showtime.availableSeats -= seats

  const ticketData = {
    bookingId: createBookingId(),
    movieId: movie.movieId,
    title: movie.title,
    theater: movie.theater,
    location: movie.location,
    language: movie.language,
    date,
    time: showtime.time,
    seats,
    status: 'confirmed'
  }

  userBookingsCache.push(ticketData)

  return {
    success: true,
    action: 'show_ticket',
    ticketData
  }
}

export function processRefund({ bookingId }) {
  const normalizedBookingId = normalize(bookingId)
  const booking = userBookingsCache.find(
    (item) => normalize(item.bookingId) === normalizedBookingId
  )

  if (!booking) {
    return {
      success: false,
      reason: 'booking_not_found',
      message: `Booking ${bookingId} was not found.`
    }
  }

  if (booking.status === 'cancelled') {
    return {
      success: false,
      reason: 'already_cancelled',
      message: `Booking ${booking.bookingId} is already cancelled.`
    }
  }

  const movie = moviesData.find((item) => item.movieId === booking.movieId)
  const showtime = movie ? findShowtime(movie, booking.date, booking.time) : null

  if (showtime) {
    showtime.availableSeats += booking.seats
  }

  booking.status = 'cancelled'

  return {
    success: true,
    action: 'show_refund',
    refundData: {
      bookingId: booking.bookingId,
      title: booking.title,
      theater: booking.theater,
      date: booking.date,
      time: booking.time,
      seats: booking.seats,
      status: booking.status
    }
  }
}

export function runTicketTool(name, args) {
  if (name === 'get_movies_info') {
    return getMoviesInfo()
  }

  if (name === 'book_ticket') {
    return bookTicket(args)
  }

  if (name === 'process_refund') {
    return processRefund(args)
  }

  return {
    success: false,
    reason: 'unknown_tool',
    message: `Unknown tool: ${name}`
  }
}
