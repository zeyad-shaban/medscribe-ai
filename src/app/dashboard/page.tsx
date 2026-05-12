"use client";
import AiAnalysisCard from "@/src/components/AiAnalysisCard";
import RecorderCard from "@/src/components/RecorderCard";
import TranscriptCard from "@/src/components/TranscriptCard";
import { useState } from "react";

export default function Dashboard() {
    const [transcript, setTranscript] = useState<string>("");
    const [aiAnalysis, setAiAnalysis] = useState<string>("");

    return (
        <main className="min-h-screen bg-zinc-950 text-white">
            <div className="mx-auto max-w-xl">
                <RecorderCard setTranscript={setTranscript} />
                <TranscriptCard transcript={transcript} setTranscript={setTranscript} setAiAnalysis={setAiAnalysis} />
                <AiAnalysisCard aiAnalysis={aiAnalysis} />
            </div>
        </main >
    )
}