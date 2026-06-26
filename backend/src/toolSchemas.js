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
      name: 'get_movie_suggestions',
      description:
        'Suggest movies based on a user preference such as love, action, comedy, thriller, family, peaceful, or feel-good.',
      parameters: {
        type: 'object',
        properties: {
          genreOrMood: {
            type: 'string',
            description: 'User movie preference, for example love, action, peaceful, comedy.'
          }
        },
        required: ['genreOrMood'],
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'prepare_booking',
      description:
        'Booking Agent step 1. Check availability and create a pending booking. This must not reduce seats or create a final ticket.',
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
      name: 'confirm_booking',
      description:
        'Booking Agent step 2. Confirm the latest pending booking only after the user clearly says yes, confirm, okay, or book it.',
      parameters: {
        type: 'object',
        properties: {
          pendingBookingId: {
            type: 'string',
            description:
              'Optional pending booking ID. If omitted, the latest pending booking is confirmed.'
          }
        },
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'cancel_pending_booking',
      description:
        'Booking Agent cancellation step. Cancel the latest pending booking when the user says no, cancel, or venam before final confirmation.',
      parameters: {
        type: 'object',
        properties: {
          pendingBookingId: {
            type: 'string',
            description:
              'Optional pending booking ID. If omitted, the latest pending booking is cancelled.'
          }
        },
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'prepare_cancellation',
      description:
        'Support Agent step 1. Check an active confirmed ticket and create a pending cancellation. This must not cancel the ticket or return seats yet.',
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
  },
  {
    type: 'function',
    function: {
      name: 'confirm_cancellation',
      description:
        'Support Agent step 2. Cancel the latest pending cancellation only after the user clearly confirms yes or says to cancel it.',
      parameters: {
        type: 'object',
        properties: {
          pendingCancellationId: {
            type: 'string',
            description:
              'Optional pending cancellation ID. If omitted, the latest pending cancellation is confirmed.'
          }
        },
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'decline_cancellation',
      description:
        'Support Agent decline step. Keep the ticket active when the user says no, venam, keep it, or decides not to cancel.',
      parameters: {
        type: 'object',
        properties: {
          pendingCancellationId: {
            type: 'string',
            description:
              'Optional pending cancellation ID. If omitted, the latest pending cancellation is declined.'
          }
        },
        additionalProperties: false
      }
    }
  }
]
