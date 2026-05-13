"use client";
import { useState } from "react";
import TranscriptEditor from "@/src/components/TranscriptEditor";
import SummaryCard from "@/src/components/AnalysisResults/SummaryCard";
import InsightsCard from "@/src/components/AnalysisResults/InsightsCard";
import FeedbackCard from "@/src/components/AnalysisResults/FeedbackCard";
import FollowUpEmailCard from "@/src/components/AnalysisResults/FollowUpEmailCard";
import PatientEmailSender from "@/src/components/PatientEmailSender";

// Placeholder for RecorderCard – you already have one
import RecorderCard from "@/src/components/RecorderCard";

export default function Dashboard() {
    const [transcript, setTranscript] = useState<string>("");
    const [analysis, setAnalysis] = useState<any>(null);

    return (
        <main className="min-h-screen bg-zinc-950 text-white p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                <h1 className="text-4xl font-bold tracking-tight">MedScribe AI</h1>
                <p className="text-gray-400">Clinical conversation assistant</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-6">
                        <RecorderCard setTranscript={setTranscript} />
                        <TranscriptEditor
                            transcript={transcript}
                            setTranscript={setTranscript}
                            setAnalysis={setAnalysis}
                        />
                    </div>

                    <div className="space-y-6">
                        {analysis ? (
                            <>
                                <SummaryCard data={analysis.summary} />
                                <InsightsCard
                                    disclaimer={analysis.ai_insights.disclaimer}
                                    clinicalConsiderations={analysis.ai_insights.clinical_considerations}
                                    redFlags={analysis.ai_insights.red_flags_or_escalation}
                                />
                                <FeedbackCard
                                    communicationQuality={analysis.feedback_for_doctor.communication_quality}
                                    suggestions={analysis.feedback_for_doctor.suggestions_for_improvement}
                                />
                                <FollowUpEmailCard emailSubject={analysis.follow_up_email_to_patient.subject} emailBody={analysis.follow_up_email_to_patient.body} />

                                <PatientEmailSender emailSubject={analysis.follow_up_email_to_patient.subject} emailBody={analysis.follow_up_email_to_patient.body} />
                            </>
                        ) : (
                            <div className="rounded-2xl border border-white/20 bg-white/5 p-8 text-center text-gray-400">
                                After recording a conversation, click “Start AI Analysis” to see results.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}