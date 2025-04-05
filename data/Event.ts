interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    rsvpForm: string;
  }

export const eventConfigs: Record<string, Event> = {
  wedding123: {
    id: 'wedding123',
    name: 'Wedding',
    date: '2025-06-01',
    location: 'Venue A',
    rsvpForm: 'weddingrsvp',
  },
  birthday456: {
    id: 'birthday456',
    name: 'Birthday',
    date: '2025-07-15',
    location: 'Venue B',
    rsvpForm: 'birthdayrsvp',
  },
};