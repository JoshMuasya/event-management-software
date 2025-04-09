// CheckInComponent.tsx
"use client";

import { useState } from 'react';
import QrReader from 'react-qr-reader';
import { dummyGuests } from './dummyGuests';

const CheckInComponent = () => {
  // State for guests, scanning status, error, and confirmation messages
  const [guests, setGuests] = useState(dummyGuests);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Handle QR code scan
  const handleScan = (data: string | null) => {
    if (data) {
      const guestId = data;
      const guest = guests.find(g => g.id === guestId && g.attending === 'yes');
      if (guest) {
        if (!guest.checkedIn) {
          // Update check-in status locally (to be replaced with Firebase update later)
          const updatedGuests = guests.map(g =>
            g.id === guestId ? { ...g, checkedIn: true } : g
          );
          setGuests(updatedGuests);
          setMessage(`Checked in: ${guest.name}`);
          setError('');
        } else {
          setError('Guest already checked in');
        }
      } else {
        setError('Guest not found or not attending');
      }
      setScanning(false); // Stop scanning after a successful scan
    }
  };

  // Handle QR scanner errors
  const handleError = (err: any) => {
    console.error(err);
    setError('Error scanning QR code');
    setScanning(false);
  };

  // Toggle scanning on/off
  const toggleScanning = () => {
    setScanning(!scanning);
    setError('');
    setMessage('');
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Guest Check-In</h1>
      <p style={{ textAlign: 'center' }}>
        Scan the guest&apos;s QR code to check them in.
      </p>

      {/* Button to start/stop scanning */}
      <button
        onClick={toggleScanning}
        style={{
          width: '100%',
          padding: '0.5rem',
          marginBottom: '1rem',
          fontSize: '1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {scanning ? 'Stop Scanning' : 'Start Scanning'}
      </button>

      {/* QR Code Scanner */}
      {scanning && (
        <div style={{ marginBottom: '1rem' }}>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* Display confirmation or error messages */}
      {message && (
        <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>
      )}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {/* Guest List */}
      <h2>Attending Guests</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {guests
          .filter(guest => guest.attending === 'yes')
          .map(guest => (
            <li
              key={guest.id}
              style={{
                marginBottom: '0.5rem',
                color: guest.checkedIn ? 'green' : 'black',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {guest.name} {guest.checkedIn && <span style={{ marginLeft: '0.5rem' }}>✓</span>}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CheckInComponent;