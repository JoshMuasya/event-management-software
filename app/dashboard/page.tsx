'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaGift, FaEnvelope, FaClock, FaUsers } from 'react-icons/fa';

// Define the shape of the dashboard data
interface DashboardData {
  guestList: {
    total: number;
    confirmed: number;
    pending: number;
  };
  gifts: {
    totalReceived: number;
    thankYouSent: number;
  };
  rsvps: {
    total: number;
    responded: number;
    pending: number;
  };
  timeline: {
    tasks: number;
    completed: number;
  };
}

interface DashboardClientProps {
  dashboardData: DashboardData;
}

export default function DashboardClient({ dashboardData }: DashboardClientProps) {
  return (
    <motion.section
      id="main-dashboard"
      className="relative min-h-screen w-full flex flex-col items-center align-middle py-12 bg-gradient-to-b from-black to-gray-900 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="relative z-10 text-center text-white p-6 mb-12">
        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 font-playfair"
          style={{
            color: '#FFFFFF',
            textShadow: '2px 2px 4px #FAA722, 0 0 25px #FAA722, 0 0 5px #FAA722',
          }}
        >
          Twilight Luxe Events Dashboard
        </h1>
        <p
          className="text-md md:text-lg lg:text-xl italic max-w-2xl mx-auto font-lora"
          style={{ color: '#FAA722' }}
        >
          Your elegant command center for unforgettable moments.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="relative z-10 w-full max-w-6xl px-6 grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* RSVP Management */}
        <motion.div
          className="p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(250, 167, 34, 0.2), rgba(255, 215, 0, 0.2))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 4px 15px rgba(250, 167, 34, 0.2), inset 0 0 10px rgba(255, 215, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(250, 167, 34, 0.3)' }}
        >
          <FaEnvelope className="text-4xl md:text-5xl mb-4" style={{ color: '#FAA722' }} />
          <h2 className="text-xl md:text-2xl font-bold mb-2 font-playfair" style={{ color: '#FFFFFF' }}>
            RSVP Management
          </h2>
          <p className="text-sm md:text-md mb-4 font-lora" style={{ color: '#FFFFFF' }}>
            Responded: {dashboardData.rsvps.responded} | Pending: {dashboardData.rsvps.pending}
          </p>
          <Link href="/rsvp-management">
            <motion.button
              className="px-4 py-2 bg-[#FAA722] text-black rounded-md font-bold font-lora"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Manage RSVPs
            </motion.button>
          </Link>
        </motion.div>

        {/* Gift Tracking */}
        <motion.div
          className="p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(250, 167, 34, 0.2), rgba(255, 215, 0, 0.2))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 4px 15px rgba(250, 167, 34, 0.2), inset 0 0 10px rgba(255, 215, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(250, 167, 34, 0.3)' }}
        >
          <FaGift className="text-4xl md:text-5xl mb-4" style={{ color: '#FAA722' }} />
          <h2 className="text-xl md:text-2xl font-bold mb-2 font-playfair" style={{ color: '#FFFFFF' }}>
            Gift Tracking
          </h2>
          <p className="text-sm md:text-md mb-4 font-lora" style={{ color: '#FFFFFF' }}>
            Received: {dashboardData.gifts.totalReceived} | Thanked: {dashboardData.gifts.thankYouSent}
          </p>
          <Link href="/gift-tracking">
            <motion.button
              className="px-4 py-2 bg-[#FAA722] text-black rounded-md font-bold font-lora"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Track Gifts
            </motion.button>
          </Link>
        </motion.div>

        {/* Event Timeline */}
        <motion.div
          className="p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(250, 167, 34, 0.2), rgba(255, 215, 0, 0.2))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 4px 15px rgba(250, 167, 34, 0.2), inset 0 0 10px rgba(255, 215, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(250, 167, 34, 0.3)' }}
        >
          <FaClock className="text-4xl md:text-5xl mb-4" style={{ color: '#FAA722' }} />
          <h2 className="text-xl md:text-2xl font-bold mb-2 font-playfair" style={{ color: '#FFFFFF' }}>
            Event Timeline
          </h2>
          <p className="text-sm md:text-md mb-4 font-lora" style={{ color: '#FFFFFF' }}>
            Tasks: {dashboardData.timeline.tasks} | Done: {dashboardData.timeline.completed}
          </p>
          <Link href="/dashboard/event-timeline">
            <motion.button
              className="px-4 py-2 bg-[#FAA722] text-black rounded-md font-bold font-lora"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Timeline
            </motion.button>
          </Link>
        </motion.div>

        {/* Guest List */}
        <motion.div
          className="p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(250, 167, 34, 0.2), rgba(255, 215, 0, 0.2))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 4px 15px rgba(250, 167, 34, 0.2), inset 0 0 10px rgba(255, 215, 0, 0.1)',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(250, 167, 34, 0.3)' }}
        >
          <FaUsers className="text-4xl md:text-5xl mb-4" style={{ color: '#FAA722' }} />
          <h2 className="text-xl md:text-2xl font-bold mb-2 font-playfair" style={{ color: '#FFFFFF' }}>
            Guest List
          </h2>
          <p className="text-sm md:text-md mb-4 font-lora" style={{ color: '#FFFFFF' }}>
            Total: {dashboardData.guestList.total} | Confirmed: {dashboardData.guestList.confirmed} | Pending: {dashboardData.guestList.pending}
          </p>
          <Link href="/dashboard/guest-list">
            <motion.button
              className="px-4 py-2 bg-[#FAA722] text-black rounded-md font-bold font-lora"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Manage Guests
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 w-full max-w-4xl px-6 mt-12">
        <h3 className="text-2xl font-bold text-white mb-4 text-center font-playfair">Quick Actions</h3>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link href="/dashboard/guest-list">
            <motion.button
              className="px-6 py-3 bg-[#FFD700] text-black rounded-md font-bold font-lora"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Guest
            </motion.button>
          </Link>
          <Link href="/dashboard/gift-tracking">
            <motion.button
              className="px-6 py-3 bg-[#FFD700] text-black rounded-md font-bold font-lora"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log Gift
            </motion.button>
          </Link>
          <Link href="/dashboard/rsvp-management">
            <motion.button
              className="px-6 py-3 bg-[#FFD700] text-black rounded-md font-bold font-lora"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Reminder
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 z-10 text-center">
        <p className="text-sm italic font-lora" style={{ color: '#FAA722' }}>
          Crafted with Luxe Precision for Your Special Moments
        </p>
      </div>
    </motion.section>
  );
}