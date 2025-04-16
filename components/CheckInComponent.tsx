"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { dummyGuests } from "@/data/dummyGuests";

// Define the type for a guest
interface Guest {
  id: string;
  name: string;
  attending: "yes" | "no";
  checkedIn: boolean;
}

// Type for the scan result from @yudiel/react-qr-scanner
interface ScanResult {
  rawValue: string;
  [key: string]: any; // Allow additional properties if present
}

const CheckInComponent = () => {
  const [guests, setGuests] = useState<Guest[]>(dummyGuests);
  const [scanning, setScanning] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Handle QR code scan with typed result
  const handleScan = (result: ScanResult[]) => {
    if (result && result.length > 0) {
      const guestId = result[0].rawValue; // Assuming QR code contains the guest ID
      const guest = guests.find((g) => g.id === guestId && g.attending === "yes");
      if (guest) {
        if (!guest.checkedIn) {
          const updatedGuests = guests.map((g) =>
            g.id === guestId ? { ...g, checkedIn: true } : g
          );
          setGuests(updatedGuests);
          setMessage(`Checked in: ${guest.name}`);
          setError("");
        } else {
          setError("Guest already checked in");
        }
      } else {
        setError("Guest not found or not attending");
      }
      setScanning(false); // Stop scanning after a successful scan
    }
  };

  // Handle scan error with unknown type
  const handleError = (error: unknown) => {
    let errorMessage = "Error scanning QR code";
    if (error instanceof Error) {
      errorMessage += ": " + error.message;
    } else if (typeof error === "string") {
      errorMessage += ": " + error;
    } else {
      errorMessage += ": Unknown error occurred";
    }
    setError(errorMessage);
    setScanning(false);
  };

  // Toggle scanning
  const toggleScanning = () => {
    setScanning(!scanning);
    setError("");
    setMessage("");
    setSearchQuery(""); // Clear search when toggling scanning
  };

  // Handle manual check-in by guest name
  const handleManualCheckIn = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId && g.attending === "yes");
    if (guest) {
      if (!guest.checkedIn) {
        const updatedGuests = guests.map((g) =>
          g.id === guestId ? { ...g, checkedIn: true } : g
        );
        setGuests(updatedGuests);
        setMessage(`Checked in: ${guest.name}`);
        setError("");
        setSearchQuery(""); // Clear search after check-in
      } else {
        setError("Guest already checked in");
      }
    } else {
      setError("Guest not found or not attending");
    }
  };

  // Filter guests based on search query
  const filteredGuests = guests
    .filter((guest) => guest.attending === "yes")
    .filter((guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Guest Check-In</h1>
      <p style={{ textAlign: "center" }}>
        Scan the guest's QR code or search by name to check them in.
      </p>

      <button
        onClick={toggleScanning}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          fontSize: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {scanning ? "Stop Scanning" : "Start Scanning"}
      </button>

      {scanning && (
        <div style={{ marginBottom: "1rem" }}>
          <Scanner
            onScan={handleScan}
            onError={handleError}
            formats={["qr_code"]} // Restrict to QR codes only
            styles={{ container: { width: "100%", maxWidth: "400px" } }} // Adjust size
            constraints={{ facingMode: "environment" }} // Prefer rear camera
          />
        </div>
      )}

      {!scanning && (
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search guest by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              fontSize: "1rem",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {searchQuery && (
            <ul style={{ listStyle: "none", padding: 0, marginTop: "0.5rem" }}>
              {filteredGuests.length > 0 ? (
                filteredGuests.map((guest) => (
                  <li
                    key={guest.id}
                    style={{
                      padding: "0.5rem",
                      borderBottom: "1px solid #eee",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {guest.name}
                    <button
                      onClick={() => handleManualCheckIn(guest.id)}
                      style={{
                        padding: "0.3rem 0.6rem",
                        fontSize: "0.9rem",
                        backgroundColor: guest.checkedIn ? "#6c757d" : "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: guest.checkedIn ? "not-allowed" : "pointer",
                      }}
                      disabled={guest.checkedIn}
                    >
                      {guest.checkedIn ? "Checked In" : "Check In"}
                    </button>
                  </li>
                ))
              ) : (
                <li style={{ padding: "0.5rem", color: "#666" }}>
                  No guests found
                </li>
              )}
            </ul>
          )}
        </div>
      )}

      {message && (
        <p style={{ color: "green", textAlign: "center" }}>{message}</p>
      )}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <h2>Attending Guests</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {guests
          .filter((guest) => guest.attending === "yes")
          .map((guest) => (
            <li
              key={guest.id}
              style={{
                marginBottom: "0.5rem",
                color: guest.checkedIn ? "green" : "black",
                display: "flex",
                alignItems: "center",
              }}
            >
              {guest.name}{" "}
              {guest.checkedIn && <span style={{ marginLeft: "0.5rem" }}>✓</span>}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CheckInComponent;