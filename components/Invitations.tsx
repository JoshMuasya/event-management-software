'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type Guest = {
    name: string;
    email: string;
    phone: string;
};

export default function Invitations() {
    const [guestList, setGuestList] = useState<Guest[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '' });
    const RSVP_LINK = "https://your-rsvp-form-link.com";

    // Handle CSV file upload and parsing
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const text = e.target?.result as string;
                const rows = text.split('\n').map(row => row.split(','));
                const guests: Guest[] = rows
                    .slice(1) // Skip header
                    .filter(row => row[0] && row[1])
                    .map(row => ({
                        name: row[0].trim(),
                        email: row[1].trim(),
                        phone: row[2].trim(),
                    }));
                setGuestList(guests);
            };
            reader.readAsText(file);
        }
    };

    // Handle sending invitations (placeholder)
    const handleSendInvitations = () => {
        if (guestList.length === 0) {
            alert('Please upload a guest list first.');
            return;
        }

        const invitations = guestList.map(guest => ({
            to: guest.email,
            subject: "You're Invited!",
            body: `Dear ${guest.name},\n\nYou are cordially invited to our event. Please RSVP by clicking the link below:\n\n${RSVP_LINK}\n\nBest regards,\nEvent Team`,
        }));
        
        console.log('Sending invitations to:', guestList);
        // Backend call goes here
        alert('Invitations sent successfully!');
        setGuestList([]);
        setFileName('');
    };

    const handleAddGuest = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newGuest.name || !newGuest.email) {
            alert('Please fill in both name and email.');
            return;
        }
        setGuestList((prev) => [...prev, { name: newGuest.name, email: newGuest.email, phone: newGuest.phone }]);
        setNewGuest({ name: '', email: '', phone: '' });
        setIsOpen(false);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5E1FF] via-[#D8B6FF] to-[#FFF3D4] backdrop-blur-xl"></div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-2xl bg-white/50 backdrop-blur-lg p-6 rounded-xl border border-[#6A0DAD]/40 shadow-lg"
                style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 215, 0, 0.2))',
                }}
            >
                <h2 className="text-2xl font-playfair text-[#6A0DAD] mb-4">Send Invitations</h2>

                {/* Add Guest Section */}
                <div>
                    {/* File Upload Section */}
                    <div className="mb-6">
                        <Label htmlFor="guestList" className="text-[#6A0DAD]">
                            Upload Guest List (CSV)
                        </Label>
                        <Input
                            id="guestList"
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="mt-1"
                        />
                        {fileName && (
                            <p className="text-sm text-gray-700 mt-2">Uploaded: {fileName}</p>
                        )}
                        <p className="text-xs text-gray-600 mt-1">
                            CSV format: name,email (e.g., "John Doe,john@example.com")
                        </p>
                    </div>
                </div>

                {/* Add Guest Manually */}
                <div className="mb-6">
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-[#6A0DAD] text-white hover:bg-[#6A0DAD]/80">
                                Add a Guest
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white/50 backdrop-blur-lg border border-[#6A0DAD]/40">
                            <DialogHeader>
                                <DialogTitle className="text-[#6A0DAD] font-playfair">
                                    Add New Guest
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddGuest} className="space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-[#6A0DAD]">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={newGuest.name}
                                        onChange={(e) =>
                                            setNewGuest({ ...newGuest, name: e.target.value })
                                        }
                                        placeholder="Enter guest name"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-[#6A0DAD]">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={newGuest.email}
                                        onChange={(e) =>
                                            setNewGuest({ ...newGuest, email: e.target.value })
                                        }
                                        placeholder="Enter guest email"
                                        className="mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone" className="text-[#6A0DAD]">
                                        Phone
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="phone"
                                        value={newGuest.phone}
                                        onChange={(e) =>
                                            setNewGuest({ ...newGuest, phone: e.target.value })
                                        }
                                        placeholder="Enter guest phone"
                                        className="mt-1"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-[#6A0DAD] text-white hover:bg-[#6A0DAD]/80"
                                >
                                    Add Guest
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Guest List Preview */}
                {guestList.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-lg font-playfair text-[#6A0DAD] mb-2">Preview</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[#6A0DAD]">Name</TableHead>
                                    <TableHead className="text-[#6A0DAD]">Email</TableHead>
                                    <TableHead className="text-[#6A0DAD]">Phone</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guestList.map((guest, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-gray-700">{guest.name}</TableCell>
                                        <TableCell className="text-gray-700">{guest.email}</TableCell>
                                        <TableCell className="text-gray-700">{guest.phone}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Send Button */}
                <Button
                    onClick={handleSendInvitations}
                    className="w-full bg-[#6A0DAD] text-white hover:bg-[#6A0DAD]/80"
                >
                    Send Invitations ({guestList.length})
                </Button>
            </motion.div>
        </div>
    );
}
