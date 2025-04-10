"use client";

import { motion } from "framer-motion";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { useParams } from "next/navigation";
import { eventConfigs } from "@/data/Event";
import { QRCodeSVG } from "qrcode.react"; // Use QRCodeSVG instead of QRCode

interface RSVPFormData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  attending: "yes" | "no" | "";
  dietary: string;
  invitee: string;
  needs: string;
  qrCode?: string;
}

const rsvpStore: RSVPFormData[] = [];

const RsvpForm = () => {
  const params = useParams();
  const eventId = params?.eventid as string;
  const event = eventConfigs[eventId];

  const [formData, setFormData] = useState<RSVPFormData>({
    name: "",
    phone: "",
    email: "",
    attending: "",
    dietary: "",
    invitee: "",
    needs: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof RSVPFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newGuestId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const qrCodeValue = newGuestId;

    const rsvpData = {
      ...formData,
      id: newGuestId,
      qrCode: qrCodeValue,
    };

    rsvpStore.push(rsvpData);
    console.log("RSVP Submitted:", rsvpData);

    setGuestId(newGuestId);
    setSubmitted(true);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-green-600">Thank You!</h2>
          <p className="mt-2 text-gray-600">
            Your RSVP has been successfully submitted.
          </p>
          {formData.attending === "yes" && guestId && (
            <div className="mt-4">
              <p className="text-gray-700">
                Here’s your QR code for check-in at the event:
              </p>
              <div className="flex justify-center mt-2">
                <QRCodeSVG value={guestId} size={150} /> {/* Updated to QRCodeSVG */}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Please save this QR code or take a screenshot. Show it at the event for check-in.
              </p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            RSVP to the {event?.name || "Event"}
          </h2>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter your Phone Number"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter your Email Address"
            />
          </div>

          <div>
            <label htmlFor="invitee" className="block text-sm font-medium text-gray-700">
              Main Invitee
            </label>
            <Input
              id="invitee"
              name="invitee"
              value={formData.invitee}
              onChange={handleChange}
              className="mt-1"
              placeholder="Enter the name of your Invitee"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Will you be attending?
            </label>
            <Select onValueChange={handleSelectChange("attending")} value={formData.attending}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.attending === "yes" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Dietary Restrictions
              </label>
              <Textarea
                id="dietary"
                name="dietary"
                value={formData.dietary}
                onChange={handleChange}
                className="mt-1"
                placeholder="Have any dietary restrictions?"
              />
            </motion.div>
          )}

          {formData.attending === "yes" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="needs" className="block text-sm font-medium text-gray-700">
                Special Requirements
              </label>
              <Textarea
                id="needs"
                name="needs"
                value={formData.needs}
                onChange={handleChange}
                className="mt-1"
                placeholder="E.g. accessibility needs"
              />
            </motion.div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!formData.attending}
          >
            Submit RSVP
          </Button>
        </motion.form>
      )}
    </div>
  );
};

export default RsvpForm;