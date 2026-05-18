"use client";
import { useState, useEffect } from "react";
import DashboardCard from "@/src/components/DashboardCard";
import AnalysisErrorAlert, { AnalysisError } from "@/src/components/AnalysisErrorAlert";

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
    const [error, setError] = useState<AnalysisError | null>(null);

    const parseErrorResponse = async (res: Response): Promise<AnalysisError> => {
        let message = "An unexpected error occurred";
        
        try {
            const data = await res.json();
            message = data.message || message;
        } catch {
            // Response wasn't JSON, use default message
        }

        const rateLimitInfo = {
            limit: res.headers.get("X-RateLimit-Limit"),
            remaining: res.headers.get("X-RateLimit-Remaining"),
            reset: res.headers.get("X-RateLimit-Reset"),
        };

        return {
            status: res.status,
            message,
            rateLimitInfo:
                rateLimitInfo.limit && rateLimitInfo.remaining && rateLimitInfo.reset
                    ? {
                          limit: parseInt(rateLimitInfo.limit),
                          remaining: parseInt(rateLimitInfo.remaining),
                          reset: parseInt(rateLimitInfo.reset),
                      }
                    : undefined,
        };
    };
    
    const runAnalysis = async () => {
        if (!transcript.trim()) return;
        setIsAnalyzing(true);
        setError(null);

        try {
            const res = await fetch("/api/ai_analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript }),
            });

            if (!res.ok) {
                const errorData = await parseErrorResponse(res);
                setError(errorData);
                console.error(`API Error (${res.status}):`, errorData.message);
                return;
            }

            const data = await res.json();
            setAnalysis(data);
            setError(null);
        } catch (error) {
            console.error("Network or parsing error:", error);
            const errorMsg = error instanceof Error ? error.message : "Network error occurred";
            setError({
                status: 0,
                message: `Failed to connect: ${errorMsg}`,
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <DashboardCard title="📝 Transcript">
            {error && (
                <AnalysisErrorAlert
                    error={error}
                    onDismiss={() => setError(null)}
                    onRetry={error.status === 429 ? undefined : runAnalysis}
                    isRetrying={isAnalyzing}
                />
            )}
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