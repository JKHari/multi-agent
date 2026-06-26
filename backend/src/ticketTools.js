import {
  moviesData,
  pendingBookingsCache,
  pendingCancellationsCache,
  userBookingsCache
} from './store.js'

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function createBookingId() {
  return `TXN${Math.floor(100000 + Math.random() * 900000)}`
}

function createPendingBookingId() {
  return `PENDING${Math.floor(100000 + Math.random() * 900000)}`
}

function createPendingCancellationId() {
  return `CANCEL${Math.floor(100000 + Math.random() * 900000)}`
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

export function getMovieSuggestions({ genreOrMood }) {
  const preference = normalize(genreOrMood)
  const matchedMovies = preference
    ? moviesData.filter((movie) => {
        const searchableText = [
          movie.title,
          movie.genre,
          movie.reviewNote,
          ...(movie.moodTags || [])
        ]
          .join(' ')
          .toLowerCase()

        return searchableText.includes(preference)
      })
    : []

  return {
    success: true,
    preference: genreOrMood || null,
    movies: matchedMovies.length > 0 ? matchedMovies : moviesData,
    message:
      matchedMovies.length > 0
        ? `Found ${matchedMovies.length} movie suggestion(s).`
        : 'No exact preference match found, returning all available movies.'
  }
}

export function prepareBooking({ movieName, date, time, seatCount }) {
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

  const pendingBooking = {
    pendingBookingId: createPendingBookingId(),
    movieId: movie.movieId,
    title: movie.title,
    theater: movie.theater,
    location: movie.location,
    language: movie.language,
    genre: movie.genre,
    reviewNote: movie.reviewNote,
    date,
    time: showtime.time,
    screen: showtime.screen,
    seats,
    status: 'pending'
  }

  pendingBookingsCache.push(pendingBooking)

  return {
    success: true,
    action: 'ask_confirmation',
    pendingBooking,
    message:
      'Seats are available. Ask the customer to confirm before booking. Do not show a ticket yet.'
  }
}

export function confirmBooking({ pendingBookingId } = {}) {
  const normalizedPendingId = normalize(pendingBookingId)
  const pendingBooking = normalizedPendingId
    ? pendingBookingsCache.find(
        (item) =>
          normalize(item.pendingBookingId) === normalizedPendingId &&
          item.status === 'pending'
      )
    : [...pendingBookingsCache].reverse().find((item) => item.status === 'pending')

  if (!pendingBooking) {
    return {
      success: false,
      reason: 'pending_booking_not_found',
      message:
        'No pending booking was found. Ask the customer for movie, date, time, and seat count again.'
    }
  }

  const movie = moviesData.find((item) => item.movieId === pendingBooking.movieId)
  const showtime = movie
    ? findShowtime(movie, pendingBooking.date, pendingBooking.time)
    : null

  if (!movie || !showtime) {
    pendingBooking.status = 'expired'

    return {
      success: false,
      reason: 'showtime_not_found',
      message: 'This pending showtime is no longer available.'
    }
  }

  if (showtime.availableSeats < pendingBooking.seats) {
    pendingBooking.status = 'expired'

    return {
      success: false,
      reason: 'not_enough_seats',
      message: `Only ${showtime.availableSeats} seats are available now.`,
      availableSeats: showtime.availableSeats
    }
  }

  showtime.availableSeats -= pendingBooking.seats
  pendingBooking.status = 'confirmed'

  const ticketData = {
    bookingId: createBookingId(),
    movieId: movie.movieId,
    title: movie.title,
    theater: movie.theater,
    location: movie.location,
    language: movie.language,
    genre: movie.genre,
    reviewNote: movie.reviewNote,
    date: pendingBooking.date,
    time: pendingBooking.time,
    screen: showtime.screen,
    seats: pendingBooking.seats,
    status: 'confirmed'
  }

  userBookingsCache.push(ticketData)

  return {
    success: true,
    action: 'show_ticket',
    ticketData,
    message:
      'Booking confirmed. Include the movie review or mood note in the final reply.'
  }
}

export function cancelPendingBooking({ pendingBookingId } = {}) {
  const normalizedPendingId = normalize(pendingBookingId)
  const pendingBooking = normalizedPendingId
    ? pendingBookingsCache.find(
        (item) =>
          normalize(item.pendingBookingId) === normalizedPendingId &&
          item.status === 'pending'
      )
    : [...pendingBookingsCache].reverse().find((item) => item.status === 'pending')

  if (!pendingBooking) {
    return {
      success: false,
      reason: 'pending_booking_not_found',
      message: 'No pending booking was found to cancel.'
    }
  }

  pendingBooking.status = 'cancelled'

  return {
    success: true,
    action: 'none',
    cancelledPendingBooking: pendingBooking,
    message:
      'Pending booking cancelled. Suggest thinking one more time because this is a good film, but respect the customer choice.'
  }
}

function findConfirmedBooking(bookingId) {
  const normalizedBookingId = normalize(bookingId)

  return userBookingsCache.find(
    (item) =>
      normalize(item.bookingId) === normalizedBookingId && item.status === 'confirmed'
  )
}

export function prepareCancellation({ bookingId }) {
  const booking = findConfirmedBooking(bookingId)

  if (!booking) {
    return {
      success: false,
      reason: 'booking_not_found',
      message: `Booking ${bookingId} was not found or is not active.`
    }
  }

  const existingPending = pendingCancellationsCache.find(
    (item) => item.bookingId === booking.bookingId && item.status === 'pending'
  )

  if (existingPending) {
    return {
      success: true,
      action: 'ask_cancellation_confirmation',
      pendingCancellation: existingPending,
      message:
        'Cancellation is already pending. Ask the customer to confirm yes or no.'
    }
  }

  const pendingCancellation = {
    pendingCancellationId: createPendingCancellationId(),
    bookingId: booking.bookingId,
    movieId: booking.movieId,
    title: booking.title,
    theater: booking.theater,
    location: booking.location,
    language: booking.language,
    genre: booking.genre,
    reviewNote: booking.reviewNote,
    date: booking.date,
    time: booking.time,
    screen: booking.screen,
    seats: booking.seats,
    status: 'pending'
  }

  pendingCancellationsCache.push(pendingCancellation)

  return {
    success: true,
    action: 'ask_cancellation_confirmation',
    pendingCancellation,
    message:
      'Do not cancel yet. Say the movie is good, ask the customer to think one more time, and ask for confirmation.'
  }
}

export function confirmCancellation({ pendingCancellationId } = {}) {
  const normalizedPendingId = normalize(pendingCancellationId)
  const pendingCancellation = normalizedPendingId
    ? pendingCancellationsCache.find(
        (item) =>
          normalize(item.pendingCancellationId) === normalizedPendingId &&
          item.status === 'pending'
      )
    : [...pendingCancellationsCache]
        .reverse()
        .find((item) => item.status === 'pending')

  if (!pendingCancellation) {
    return {
      success: false,
      reason: 'pending_cancellation_not_found',
      message:
        'No pending cancellation was found. Ask the customer for the booking ID again.'
    }
  }

  const booking = findConfirmedBooking(pendingCancellation.bookingId)

  if (!booking) {
    pendingCancellation.status = 'expired'

    return {
      success: false,
      reason: 'booking_not_found',
      message: `Booking ${pendingCancellation.bookingId} was not found or is already cancelled.`
    }
  }

  const movie = moviesData.find((item) => item.movieId === booking.movieId)
  const showtime = movie ? findShowtime(movie, booking.date, booking.time) : null

  if (showtime) {
    showtime.availableSeats += booking.seats
  }

  booking.status = 'cancelled'
  pendingCancellation.status = 'confirmed'

  return {
    success: true,
    action: 'show_refund',
    refundData: {
      bookingId: booking.bookingId,
      title: booking.title,
      theater: booking.theater,
      date: booking.date,
      time: booking.time,
      screen: booking.screen,
      seats: booking.seats,
      status: booking.status
    }
  }
}

export function declineCancellation({ pendingCancellationId } = {}) {
  const normalizedPendingId = normalize(pendingCancellationId)
  const pendingCancellation = normalizedPendingId
    ? pendingCancellationsCache.find(
        (item) =>
          normalize(item.pendingCancellationId) === normalizedPendingId &&
          item.status === 'pending'
      )
    : [...pendingCancellationsCache]
        .reverse()
        .find((item) => item.status === 'pending')

  if (!pendingCancellation) {
    return {
      success: false,
      reason: 'pending_cancellation_not_found',
      message: 'No pending cancellation was found.'
    }
  }

  pendingCancellation.status = 'declined'

  return {
    success: true,
    action: 'none',
    keptBooking: {
      bookingId: pendingCancellation.bookingId,
      title: pendingCancellation.title,
      theater: pendingCancellation.theater,
      date: pendingCancellation.date,
      time: pendingCancellation.time,
      seats: pendingCancellation.seats,
      status: 'confirmed'
    },
    message:
      'Cancellation declined. Tell the customer the ticket is still active and send a cheerful enjoy message.'
  }
}

export function runTicketTool(name, args) {
  if (name === 'get_movies_info') {
    return getMoviesInfo()
  }

  if (name === 'get_movie_suggestions') {
    return getMovieSuggestions(args)
  }

  if (name === 'prepare_booking') {
    return prepareBooking(args)
  }

  if (name === 'confirm_booking') {
    return confirmBooking(args)
  }

  if (name === 'cancel_pending_booking') {
    return cancelPendingBooking(args)
  }

  if (name === 'prepare_cancellation') {
    return prepareCancellation(args)
  }

  if (name === 'confirm_cancellation') {
    return confirmCancellation(args)
  }

  if (name === 'decline_cancellation') {
    return declineCancellation(args)
  }

  return {
    success: false,
    reason: 'unknown_tool',
    message: `Unknown tool: ${name}`
  }
}
