import DashboardCard from "@/src/components/DashboardCard"

export default function TranscriptCard() {
    return (
        <DashboardCard title="Transcript">
            <textarea
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-3"
                placeholder="The conversation transcript will appear here once done with the recording session"></textarea>
        </DashboardCard>
    )
}