export const ticketToolSchemas = [
  {
    type: 'function',
    function: {
      name: 'get_movies_info',
      description:
        'Get the available movies, theaters, show dates, showtimes, and current seat availability.',
      parameters: {
        type: 'object',
        properties: {},
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'book_ticket',
      description:
        'Book movie tickets after movie name, date, time, and seat count are known.',
      parameters: {
        type: 'object',
        properties: {
          movieName: {
            type: 'string',
            description: 'Movie title, for example Leo.'
          },
          date: {
            type: 'string',
            description: 'Show date in YYYY-MM-DD format.'
          },
          time: {
            type: 'string',
            description: 'Show time exactly as available, for example 10:00 AM.'
          },
          seatCount: {
            type: 'integer',
            minimum: 1,
            description: 'Number of seats requested.'
          }
        },
        required: ['movieName', 'date', 'time', 'seatCount'],
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'process_refund',
      description:
        'Cancel an existing booking and return the booked seats to availability.',
      parameters: {
        type: 'object',
        properties: {
          bookingId: {
            type: 'string',
            description: 'Booking ID, for example TXN98765.'
          }
        },
        required: ['bookingId'],
        additionalProperties: false
      }
    }
  }
]
