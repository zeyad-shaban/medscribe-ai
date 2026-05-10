import DashboardCard from "@/src/components/DashboardCard"
import { useState } from "react";

export default function RecorderCard() {
    const [isRecording, setIsRecording] = useState(false);

    const onRecorderClick = () => {
        setIsRecording(!isRecording);
    }

    return (
        <DashboardCard title="Recorder">
            <p>Start recording your conversation with patient</p>
            {!isRecording ?
                <button className="bg-violet-600 rounded-full px-6 py-4 cursor-pointer" onClick={onRecorderClick}>Start Recording 🎙️</button>
                :
                (
                    <div>
                        <button className="bg-red-600 rounded-full px-6 py-4 cursor-pointer" onClick={onRecorderClick}>Stop Recording ⏹️</button>
                        {/* todo display a little wave sound next to it, that changes its colors based on who was last talking */}
                    </div>
                )
            }
        </DashboardCard>
    )
}