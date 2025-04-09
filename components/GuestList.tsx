"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { eventConfigs } from "@/data/Event";
import React from "react";

// Define the guest data type
interface Guest {
  id: string;
  name: string;
  phone: string;
  email: string;
  attending: "yes" | "no" | "";
  dietary: string;
  invitee: string;
  needs: string;
}

const GuestList = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams();
  const eventId = params?.eventid as string;
  const event = eventConfigs[eventId];

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };

  // Fetch guest list data
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch("/api/events/wedding123");
        console.log(response)
        const data: Guest[] = await response.json();
        setGuests(data.filter((guest) => guest.id));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching guest list:", error);
        setLoading(false);
      }
    };

    fetchGuests();
  }, [eventId]);

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Guest List
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center text-gray-600">Loading guests...</div>
        ) : guests.length === 0 ? (
          <div className="text-center text-gray-600">
            No guests have RSVP'd yet.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">Name</TableHead>
                  <TableHead className="w-1/3">Phone</TableHead>
                  <TableHead className="w-1/3">Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <React.Fragment key={guest.id}>
                    {/* Clickable Summary Row */}
                    <motion.tr
                      onClick={() => toggleRow(guest.id)}
                      className="cursor-pointer hover:bg-muted/40"
                      initial="hidden"
                      animate="visible"
                      transition={{ duration: 0.3 }}
                    >
                      <TableCell>{guest.name}</TableCell>
                      <TableCell>{guest.phone}</TableCell>
                      <TableCell>{guest.email}</TableCell>
                    </motion.tr>

                    {/* Expandable Detail Row */}
                    <AnimatePresence>
                      {expandedRow === guest.id && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell colSpan={3} className="bg-muted/20 text-sm p-4">
                            <p><strong>Attending:</strong> {guest.attending || "N/A"}</p>
                            <p><strong>Dietary:</strong> {guest.dietary || "None"}</p>
                            <p><strong>Invitee Group:</strong> {guest.invitee || "N/A"}</p>
                            <p><strong>Special Needs:</strong> {guest.needs || "None"}</p>
                          </TableCell>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default GuestList;