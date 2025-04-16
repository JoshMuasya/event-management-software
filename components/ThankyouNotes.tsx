"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Send } from 'lucide-react';

// Define interfaces for data types
interface Guest {
  id: string;
  name: string;
  email: string;
  checkedIn: boolean;
}

interface ThankYouMessage {
  subject: string;
  body: string;
}

// Mock data for guests who attended
const mockGuests: Guest[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', checkedIn: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', checkedIn: true },
  { id: '3', name: 'Alex Brown', email: 'alex@example.com', checkedIn: false },
];

const ThankYouNotes: React.FC = () => {
  const [message, setMessage] = useState<ThankYouMessage>({
    subject: 'Thank You for Attending Our Event!',
    body: 'Dear [Guest Name],\n\nThank you for joining us at [Event Name]! Your presence made the event truly special. We hope you had a wonderful time and look forward to seeing you at future events.\n\nBest regards,\n[Your Name]',
  });
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendStatus, setSendStatus] = useState<string | null>(null);

  // Filter guests who attended (checked in)
  const attendees: Guest[] = mockGuests.filter((guest) => guest.checkedIn);

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  // Preview message for a specific guest
  const getPreviewMessage = (guestName: string): string => {
    return message.body
      .replace('[Guest Name]', guestName)
      .replace('[Event Name]', 'Our Special Event')
      .replace('[Your Name]', 'Event Organizer');
  };

  // Simulate sending thank-you notes
  const handleSend = async () => {
    setIsSending(true);
    setSendStatus(null);
    try {
      // Simulate API call to send emails
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSendStatus('Thank-you notes sent successfully!');
    } catch (error) {
      setSendStatus('Failed to send thank-you notes. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          Send Thank-You Notes
        </h1>

        {/* Message Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={message.subject}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <label
                htmlFor="body"
                className="block text-sm font-medium text-gray-700"
              >
                Message Body
              </label>
              <Textarea
                id="body"
                name="body"
                value={message.body}
                onChange={handleInputChange}
                className="mt-1 h-40"
                placeholder="Write your thank-you message..."
              />
              <p className="mt-2 text-sm text-gray-500">
                Use [Guest Name], [Event Name], or [Your Name] to personalize the
                message.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {attendees.length > 0 ? (
              <div className="space-y-4">
                <p className="text-gray-700">
                  <strong>Subject:</strong> {message.subject}
                </p>
                <p className="text-gray-700 whitespace-pre-line">
                  <strong>Body (Sample for {attendees[0].name}):</strong>
                  <br />
                  {getPreviewMessage(attendees[0].name)}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No attendees to preview.</p>
            )}
          </CardContent>
        </Card>

        {/* Attendees List */}
        <Card>
          <CardHeader>
            <CardTitle>Attendees ({attendees.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {attendees.length > 0 ? (
              <ul className="space-y-2">
                {attendees.map((guest) => (
                  <li
                    key={guest.id}
                    className="flex items-center space-x-2 text-gray-700"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>
                      {guest.name} ({guest.email})
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No guests have checked in yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Send Button and Status */}
        <div className="flex justify-end">
          <Button
            onClick={handleSend}
            disabled={isSending || attendees.length === 0}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
            <span>{isSending ? 'Sending...' : 'Send Thank-You Notes'}</span>
          </Button>
        </div>

        {sendStatus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              variant={sendStatus.includes('successfully') ? 'default' : 'destructive'}
            >
              <AlertTitle>
                {sendStatus.includes('successfully') ? 'Success' : 'Error'}
              </AlertTitle>
              <AlertDescription>{sendStatus}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ThankYouNotes;