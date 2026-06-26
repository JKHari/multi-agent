export const moviesData = [
  {
    movieId: 'M001',
    title: 'Leo',
    theater: 'Vetri Cinemas',
    location: 'Chennai',
    language: 'Tamil',
    genre: 'Action Thriller',
    moodTags: ['action', 'mass', 'thriller'],
    reviewNote:
      'Leo is an intense action thriller with strong theater moments and emotional beats.',
    showtimes: [
      { time: '10:00 AM', date: '2026-06-27', screen: 'Audi 1', availableSeats: 50 },
      { time: '06:00 PM', date: '2026-06-27', screen: 'Audi 2', availableSeats: 5 }
    ]
  },
  {
    movieId: 'M002',
    title: 'Jailer',
    theater: 'Inox',
    location: 'Chennai',
    language: 'Tamil',
    genre: 'Action Comedy',
    moodTags: ['action', 'comedy', 'family'],
    reviewNote:
      'Jailer is a crowd-pleasing action comedy with strong star moments and fun family energy.',
    showtimes: [
      { time: '02:00 PM', date: '2026-06-27', screen: 'Audi 3', availableSeats: 20 },
      { time: '09:30 PM', date: '2026-06-27', screen: 'Audi 4', availableSeats: 12 }
    ]
  },
  {
    movieId: 'M003',
    title: 'Vikram',
    theater: 'PVR Escape',
    location: 'Chennai',
    language: 'Tamil',
    genre: 'Action Thriller',
    moodTags: ['action', 'thriller', 'mass'],
    reviewNote:
      'Vikram is a stylish action thriller with sharp pacing and a strong big-screen feel.',
    showtimes: [
      { time: '11:30 AM', date: '2026-06-28', screen: 'Audi 2', availableSeats: 34 },
      { time: '07:15 PM', date: '2026-06-28', screen: 'Audi 5', availableSeats: 18 }
    ]
  },
  {
    movieId: 'M004',
    title: '96',
    theater: 'Sathyam Cinemas',
    location: 'Chennai',
    language: 'Tamil',
    genre: 'Love Drama',
    moodTags: ['love', 'romance', 'peaceful', 'feel-good'],
    reviewNote:
      '96 is a gentle love film. Once you watch it, your mind feels calm and peaceful.',
    showtimes: [
      { time: '01:00 PM', date: '2026-06-27', screen: 'Audi 6', availableSeats: 28 },
      { time: '08:00 PM', date: '2026-06-27', screen: 'Audi 6', availableSeats: 16 }
    ]
  }
]

export const userBookingsCache = []
export const pendingBookingsCache = []
export const pendingCancellationsCache = []
