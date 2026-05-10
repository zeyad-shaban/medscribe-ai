import AiAnalysisCard from "@/src/components/AiAnalysisCard";
import DashboardCard from "@/src/components/DashboardCard"
import RecorderCard from "@/src/components/RecorderCard";
import TranscriptCard from "@/src/components/TranscriptCard";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <div className="mx-auto max-w-xl">
                <RecorderCard />
                <TranscriptCard />
                <AiAnalysisCard />
            </div>
        </main >
    )
}