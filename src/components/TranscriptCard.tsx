import DashboardCard from "@/src/components/DashboardCard"
import { useEffect } from "react";

export default function TranscriptCard({ transcript, setTranscript, setAiAnalysis }: { transcript: string, setTranscript: (transcript: string) => void, setAiAnalysis: (analysis: string) => void }) {
    const initial_transcript = " Hi doctor, thanks for seeing me today. Of course, tell me what has been going on. For the last two weeks I have been feeling really tired all the time, and I have had these dull headaches that come and go, especially in the morning. Do the headaches stay in one place or move around? Mostly around my forehead and sometimes behind my eyes. I also feel a bit dizzy when I stand up too fast. Have you noticed any fever, chest pain, shortness of breath, nausea, or vomiting? No, none of that. My sleep has been bad though, I have been staying up late and usually sleep less than six hours. Are you eating regularly and drinking enough water? Not really, I often skip breakfast and I probably do not drink enough water during the day. Are you taking any medication or supplements? Just an occasional painkiller when the headache is bad, nothing else. Have you had any recent stress at work or at home? Yes, work has been pretty stressful lately and I have been spending a lot of time on the computer. That can definitely contribute to headaches and fatigue. I want to examine you and check your blood pressure, and based on what you are describing, the first steps are improving sleep, drinking more water, eating regular meals, and taking breaks from screens. Should I be worried that it is something serious? Right now it does not sound alarming, but if the headaches get worse, if you start fainting, if the dizziness becomes frequent, or if you develop new symptoms like fever, chest pain, or vision changes, you should come back right away. Okay, that makes sense. Try those changes for the next few days and keep track of how you feel, and we will follow up if the symptoms continue. ";

    useEffect(() => {
        setTranscript(initial_transcript)
    }, [])

    const startAnalysis = async () => {
        const res = await fetch("/api/ai_analysis",
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transcript }),
            })

        const data = await res.json();
        console.log(data);
        setAiAnalysis(data.message);
    }

    return (
        <DashboardCard title="Transcript">
            <textarea
                className="block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-3"
                placeholder="The conversation transcript will appear here once done with the recording session"
                rows={10}
                value={transcript}
                onChange={e => { setTranscript(e.target.value) }}
            />

            <button
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                onClick={startAnalysis}
            >
                Start Analysis
            </button>
        </DashboardCard>
    )
}