"use client";
import DashboardCard from "@/src/components/DashboardCard"
import RecorderCard from "@/src/components/RecorderCard";
import { useState } from "react"

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <div className="mx-auto max-w-xl">
                {/* Recorder */}

                <RecorderCard />
                <DashboardCard title="Transcript">
                    <textarea
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-3"
                        placeholder="The conversation transcript will appear here once done with the recording session"></textarea>
                </DashboardCard>

                <DashboardCard title="AI Analysis">
                    {/* summarize teh conversation */}
                    {/* Tell what the doctor described to the patient */}
                    {/* Help the doctor see stuff he missed */}

                    <textarea
                        className="block w-full rounded-md border-0 py-1.5 text-white/80 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-3"
                        placeholder="AI Generated mail message will appear here"></textarea>

                    <label className="block text-sm font-medium text-white">Patient{"'"}s Email Address</label>
                    <input
                        type="email"
                        placeholder="patientName@example.com"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-zinc-950 rounded-md text-sm shadow-sm placeholder-gray-400
           focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />

                    <button className="bg-blue-600 rounded-full px-6 py-4 cursor-pointer">Send Mail</button>
                </DashboardCard>
            </div>
        </main >
    )
}