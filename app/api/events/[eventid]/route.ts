import { NextResponse } from "next/server";

// Dummy guest lists for different events
const guestData: Record<string, any[]> = {
  wedding123: [
    {
      id: "1",
      name: "Jane Doe",
      phone: "+254712345678",
      email: "jane@example.com",
      attending: "yes",
      dietary: "Vegetarian",
      invitee: "Bride's Friends",
      needs: "Wheelchair access",
    },
    {
      id: "2",
      name: "John Smith",
      phone: "+254798765432",
      email: "john@example.com",
      attending: "no",
      dietary: "None",
      invitee: "Groom's Family",
      needs: "",
    },
  ],
  birthday789: [
    {
      id: "3",
      name: "Alice Johnson",
      phone: "+254701234567",
      email: "alice@example.com",
      attending: "yes",
      dietary: "Gluten-Free",
      invitee: "Work Colleagues",
      needs: "Interpreter",
    },
    {
      id: "4",
      name: "Mark Lee",
      phone: "+254703212345",
      email: "mark@example.com",
      attending: "yes",
      dietary: "Vegan",
      invitee: "Family",
      needs: "",
    },
  ],
  conference2025: [
    {
      id: "5",
      name: "Linda Okello",
      phone: "+254799001122",
      email: "linda@example.com",
      attending: "yes",
      dietary: "None",
      invitee: "Panelists",
      needs: "Projector",
    },
  ],
};

export async function GET(req: Request, { params }: { params: { eventid: string } }) {
  const { eventid } = params;
  const allGuests = guestData[eventid] || [];
  const attendingGuests = allGuests.filter(guest => guest.attending === "yes");
  return NextResponse.json(attendingGuests);
}
