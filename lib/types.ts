export interface Guest {
    id: string;
    name: string;
    email: string;
    events: { [eventId: string]: { rsvpStatus: 'pending' | 'accepted' | 'declined'; token: string } };
    qrCode: string;
    attending: "yes" | "no";
    checkedIn: boolean;
}

export interface Event {
    id: string;
    name: string;
    date: string;
    location: string;
    rsvpForm: string;
}