"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    Legend as RechartsLegend,
} from 'recharts';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CSVLink } from 'react-csv';

// Define interfaces for data types
interface RSVPData {
    name: string;
    value: number;
}

interface CheckInData {
    checkedIn: number;
    totalExpected: number;
}

interface GuestDetail {
    name: string;
    request: string;
}

interface ResponseRateData {
    date: string;
    responses: number;
}

interface ThankYouData {
    messagesSent: number;
    feedback: string[];
}

// Mock data with types
const rsvpData: RSVPData[] = [
    { name: 'Yes', value: 120 },
    { name: 'No', value: 40 },
    { name: 'Maybe', value: 40 },
];

const checkInData: CheckInData = { checkedIn: 150, totalExpected: 200 };

const guestDetails: GuestDetail[] = [
    { name: 'John Doe', request: 'Gluten-free' },
    { name: 'Jane Smith', request: 'Vegan' },
];

const responseRateData: ResponseRateData[] = [
    { date: '2023-10-01', responses: 10 },
    { date: '2023-10-02', responses: 15 },
];

const thankYouData: ThankYouData = {
    messagesSent: 200,
    feedback: ['Great event!', 'Loved it!'],
};

const Reports: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('rsvp');

    // Basic analytics calculations
    const totalResponses: number = responseRateData.reduce(
        (sum, day) => sum + day.responses,
        0
    );
    const numDays: number = responseRateData.length;
    const averageDailyResponses: string = numDays > 0 ? (totalResponses / numDays).toFixed(2) : '0';
    const maxResponsesDay: ResponseRateData = responseRateData.reduce(
        (max, day) => (day.responses > max.responses ? day : max),
        responseRateData[0]
    );
    const numSpecialRequests: number = guestDetails.filter(
        (guest) => guest.request
    ).length;

    // CSV data for export
    const rsvpCSVData = rsvpData.map((item) => ({
        Response: item.name,
        Count: item.value,
    }));
    const checkInCSVData = [
        {
            CheckedIn: checkInData.checkedIn,
            TotalExpected: checkInData.totalExpected,
        },
    ];
    const guestCSVData = guestDetails.map((guest) => ({
        Name: guest.name,
        Request: guest.request,
    }));
    const responseRateCSVData = responseRateData.map((day) => ({
        Date: day.date,
        Responses: day.responses,
    }));
    const thankYouCSVData = [
        { MessagesSent: thankYouData.messagesSent },
        ...thankYouData.feedback.map((fb, index) => ({ Feedback: fb })),
    ];

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Event Reports</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex justify-start mb-4">
                    <TabsTrigger value="rsvp" className="px-4 py-2">
                        RSVP Status
                    </TabsTrigger>
                    <TabsTrigger value="checkin" className="px-4 py-2">
                        Check-In Status
                    </TabsTrigger>
                    <TabsTrigger value="guests" className="px-4 py-2">
                        Guest Details
                    </TabsTrigger>
                    <TabsTrigger value="responseRate" className="px-4 py-2">
                        Response Rate
                    </TabsTrigger>
                    <TabsTrigger value="thankYou" className="px-4 py-2">
                        Thank-You Messages
                    </TabsTrigger>
                </TabsList>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow p-6"
                >
                    <TabsContent value="rsvp">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            RSVP Status Breakdown
                        </h2>
                        <div className="flex justify-center">
                            <PieChart width={400} height={300}>
                                <Pie
                                    data={rsvpData}
                                    cx={200}
                                    cy={150}
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {rsvpData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={['#0088FE', '#FF8042', '#FFBB28'][index % 3]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                        <CSVLink
                            data={rsvpCSVData}
                            filename="rsvp_status.csv"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Export as CSV
                        </CSVLink>
                    </TabsContent>

                    <TabsContent value="checkin">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            Check-In Status
                        </h2>
                        <p className="text-gray-600">
                            {checkInData.checkedIn} of {checkInData.totalExpected} guests have
                            checked in (
                            {(
                                (checkInData.checkedIn / checkInData.totalExpected) *
                                100
                            ).toFixed(2)}
                            %)
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{
                                    width: `${(checkInData.checkedIn / checkInData.totalExpected) * 100
                                        }%`,
                                }}
                            ></div>
                        </div>
                        <CSVLink
                            data={checkInCSVData}
                            filename="checkin_status.csv"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Export as CSV
                        </CSVLink>
                    </TabsContent>

                    <TabsContent value="guests">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            Guest Details and Special Requests
                        </h2>
                        <p className="text-gray-600 mb-2">
                            {numSpecialRequests} guests have special requests.
                        </p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Special Request</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guestDetails.map((guest, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{guest.name}</TableCell>
                                        <TableCell>{guest.request}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <CSVLink
                            data={guestCSVData}
                            filename="guest_details.csv"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Export as CSV
                        </CSVLink>
                    </TabsContent>

                    <TabsContent value="responseRate">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            Response Rate Over Time
                        </h2>
                        <div className="flex justify-center">
                            <LineChart width={600} height={300} data={responseRateData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <RechartsTooltip />
                                <RechartsLegend />
                                <Line
                                    type="monotone"
                                    dataKey="responses"
                                    stroke="#8884d8"
                                />
                            </LineChart>
                        </div>
                        <div className="mt-4 text-gray-600">
                            <p>Total responses: {totalResponses}</p>
                            <p>Average daily responses: {averageDailyResponses}</p>
                            <p>
                                Most responses on: {maxResponsesDay.date} with{' '}
                                {maxResponsesDay.responses} responses
                            </p>
                        </div>
                        <CSVLink
                            data={responseRateCSVData}
                            filename="response_rate.csv"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Export as CSV
                        </CSVLink>
                    </TabsContent>

                    <TabsContent value="thankYou">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            Thank-You Message Delivery and Feedback
                        </h2>
                        <p className="text-gray-600">
                            {thankYouData.messagesSent} thank-you messages sent.
                        </p>
                        <h3 className="mt-4 text-gray-700">Guest Feedback:</h3>
                        <ul className="list-disc pl-5 text-gray-600">
                            {thankYouData.feedback.map((fb, index) => (
                                <li key={index}>{fb}</li>
                            ))}
                        </ul>
                        <CSVLink
                            data={thankYouCSVData}
                            filename="thank_you_feedback.csv"
                            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Export as CSV
                        </CSVLink>
                    </TabsContent>
                </motion.div>
            </Tabs>
        </div>
    );
};

export default Reports;