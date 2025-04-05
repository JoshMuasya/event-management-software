'use client';

import { eventConfigs } from '@/data/Event';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
    const events = Object.values(eventConfigs);

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
            {/* Light Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#F5E1FF] via-[#D8B6FF] to-[#FFF3D4] backdrop-blur-xl"></div>

            <h2
                className="relative text-3xl font-playfair text-[#6A0DAD] text-center mb-12"
                style={{ textShadow: '2px 2px 6px #FFD700, 0 0 15px #FFD700' }}
            >
                Welcome to the Rsvp Management Dashboard
            </h2>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10 w-full max-w-5xl">
                {events.map((event, index) => (
                    <Link href={`/rsvp-management/events/${event.id}/`}>
                        <motion.div
                            key={event.id}
                            className="bg-white/50 backdrop-blur-lg p-6 rounded-xl border border-[#6A0DAD]/40 text-center cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 hover:border-[#FFD700] hover:shadow-[0px_0px_20px_#FFD700]"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.15 }}
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(255, 215, 0, 0.2))',
                            }}
                        >
                            <h3 className="text-xl font-playfair text-[#6A0DAD] mb-2">{event.name}</h3>
                            <p className="text-gray-700 font-lora mb-4">
                                {event.date} | {event.location}
                            </p>
                            <div className="flex flex-col gap-2">
                                <Link href={`/rsvp-management/events/${event.id}/invitations`}>
                                    <span className="text-[#6A0DAD] hover:underline">Invitations</span>
                                </Link>
                                <Link href={`/rsvp-management/events/${event.id}/guest-list`}>
                                    <span className="text-[#6A0DAD] hover:underline">Guest List</span>
                                </Link>
                                {/* RSVP link omitted for organizer; guests use token-based link */}
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    );
}