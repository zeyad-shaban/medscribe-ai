"use client";
import DashboardCard from "@/src/components/DashboardCard"
import { useRef, useState } from "react";

export default function RecorderCard() {
    const [isRecording, setIsRecording] = useState(false);
    const [permessionErr, setPermessionErr] = useState("");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        try {

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            // 1. Collect data chunks as they become available
            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            // 2. When recording stops, create the replayable URL
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                audioChunks.current = []; // Reset for next time
            }

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (err) {
            if (err instanceof Error) {
                if (err.name === "NotAllowedError")
                    setPermessionErr("Microphone access was denied. Please enable it in site settings.");
                else
                    setPermessionErr("Microphone not available, please check your device settings.");
            }
        }
    }

    const stopRecording = () => {
        mediaRecorder.current.stop();
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());

        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        audioChunks.current = [];

        setIsRecording(false);
    }

    const onRecorderClick = () => {
        if (!isRecording)
            startRecording();
        else
            stopRecording();
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
            {permessionErr && <p className="text-red-500 mt-2">{permessionErr}</p>}
            {audioUrl && (
                <div className="mt-4">
                    <p className="mb-2">Recorded Audio:</p>
                    <audio controls src={audioUrl} className="w-full" />
                </div>
            )}
        </DashboardCard>
    )
}