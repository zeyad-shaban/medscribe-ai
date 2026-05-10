import DashboardCard from "@/src/components/DashboardCard"

export default function AiAnalysisCard() {
    return (
        <DashboardCard title="AI Analysis">
            {/* summarize teh conversation */}
            {/* Tell what the doctor described to the patient */}
            {/* Help the doctor see stuff he missed */}

            <label>AI Summary</label>
            <textarea
                className="block w-full rounded-md border-0 py-1.5 text-white/80 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-3"
                placeholder="AI Generated Summary and tips will appear here."
                readOnly={true}
            />

            {/* todo turn this to a proper markdown rendering and toggelable */}
            <label>Follow Up Mail</label>
            <textarea
                className="block w-full rounded-md border-0 py-1.5 text-white/80 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-3"
                placeholder="AI Generated follow up mail message will appear here."
            />

            <label className="block text-sm font-medium text-white">Patient{"'"}s Email Address</label>
            <input
                type="email"
                placeholder="patientName@example.com"
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-zinc-950 rounded-md text-sm shadow-sm placeholder-gray-400
           focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />

            <button className="bg-blue-600 rounded-full px-6 py-4 cursor-pointer">Send Mail</button>
        </DashboardCard>
    )
}