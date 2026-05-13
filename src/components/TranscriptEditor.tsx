"use client";
import { useState, useEffect } from "react";
import DashboardCard from "@/src/components/DashboardCard";

interface TranscriptEditorProps {
    transcript: string;
    setTranscript: (text: string) => void;
    setAnalysis: (data: string) => void;
}

export default function TranscriptEditor({
    transcript,
    setTranscript,
    setAnalysis,
}: TranscriptEditorProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const runAnalysis = async () => {
        if (!transcript.trim()) return;
        setIsAnalyzing(true);
        try {
            const res = await fetch("/api/ai_analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript }),
            });
            const data = await res.json();
            setAnalysis(data);
        } catch (error) {
            console.error(error);
            alert("Analysis failed");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <DashboardCard title="📝 Transcript">
            <textarea
                className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-3 bg-black/30"
                placeholder="Conversation transcript will appear here after recording or manual paste"
                rows={12}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
            />
            <button
                onClick={runAnalysis}
                disabled={isAnalyzing || !transcript.trim()}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
            >
                {isAnalyzing ? "Analyzing..." : "Start AI Analysis"}
            </button>
        </DashboardCard>
    );
}