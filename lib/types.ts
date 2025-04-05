export interface Guest {
    id: string;
    name: string;
    email: string;
    events: { [eventId: string]: { rsvpStatus: 'pending' | 'accepted' | 'declined'; token: string } };
}

export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    rsvpForm: string;
}