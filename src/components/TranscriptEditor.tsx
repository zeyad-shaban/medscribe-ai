"use client";
import { useState, useEffect } from "react";
import DashboardCard from "@/src/components/DashboardCard";

interface TranscriptEditorProps {
    transcript: string;
    setTranscript: (text: string) => void;
    onAnalyse: () => void;
    isAnalyzing: boolean;
}

export default function TranscriptEditor({
    transcript,
    setTranscript,
    onAnalyse,
    isAnalyzing,
}: TranscriptEditorProps) {

    useEffect(() => setTranscript(" Hi doctor, thanks for seeing me today. Of course, tell me what has been going on. For the last two weeks I have been feeling really tired all the time, and I have had these dull headaches that come and go, especially in the morning. Do the headaches stay in one place or move around? Mostly around my forehead and sometimes behind my eyes. I also feel a bit dizzy when I stand up too fast. Have you noticed any fever, chest pain, shortness of breath, nausea, or vomiting? No, none of that. My sleep has been bad though, I have been staying up late and usually sleep less than six hours. Are you eating regularly and drinking enough water? Not really, I often skip breakfast and I probably do not drink enough water during the day. Are you taking any medication or supplements? Just an occasional painkiller when the headache is bad, nothing else. Have you had any recent stress at work or at home? Yes, work has been pretty stressful lately and I have been spending a lot of time on the computer. That can definitely contribute to headaches and fatigue. I want to examine you and check your blood pressure, and based on what you are describing, the first steps are improving sleep, drinking more water, eating regular meals, and taking breaks from screens. Should I be worried that it is something serious? Right now it does not sound alarming, but if the headaches get worse, if you start fainting, if the dizziness becomes frequent, or if you develop new symptoms like fever, chest pain, or vision changes, you should come back right away. Okay, that makes sense. Try those changes for the next few days and keep track of how you feel, and we will follow up if the symptoms continue. "), [])

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
                onClick={onAnalyse}
                disabled={isAnalyzing || !transcript.trim()}
                className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-gray-500 disabled:cursor-not-allowed cursor-pointer"
            >
                {isAnalyzing ? "Analyzing..." : "Start AI Analysis"}
            </button>
        </DashboardCard>
    );
}