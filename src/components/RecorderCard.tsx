"use client";
import DashboardCard from "@/src/components/DashboardCard"
import { useRef, useState } from "react";

export default function RecorderCard({ setTranscript }: { setTranscript: (transcript: string) => void }) {
    const [isRecording, setIsRecording] = useState(false);
    const [permessionErr, setPermessionErr] = useState("");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<BlobPart[]>([]);
    const recordingTimer = useRef<NodeJS.Timeout | null>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const startRecording = async () => {
        try {
            setPermessionErr("");
            audioChunks.current = [];
            setRecordingTime(0);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            // 1. Collect data chunks as they become available
            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            // 2. When recording stops, create the replayable URL
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                if (recordingTimer.current) {
                    clearInterval(recordingTimer.current);
                }
            }

            mediaRecorder.current.start();
            setIsRecording(true);

            // Start recording timer
            recordingTimer.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);
        } catch (err) {
            if ((err as Error).name === "NotAllowedError")
                setPermessionErr("Microphone access was denied. Please enable it in site settings.");
            else
                setPermessionErr("Microphone not available, please check your device settings.");
        }
    }

    const stopRecording = () => {
        if (mediaRecorder.current == null) return;

        mediaRecorder.current.stop();
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (recordingTimer.current) {
            clearInterval(recordingTimer.current);
        }
    }

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }

    const processAudioFile = (file: File) => {
        if (!file.type.startsWith('audio/')) {
            setPermessionErr("Please drop an audio file.");
            return;
        }
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        audioChunks.current = [];
        // Read the file into chunks
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                audioChunks.current = [new Blob([reader.result], { type: file.type })];
            }
        };
        reader.readAsArrayBuffer(file);
        setPermessionErr("");
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            processAudioFile(files[0]);
        }
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files && files.length > 0) {
            processAudioFile(files[0]);
        }
    }

    const onExtractTranscript = async () => {
        try {
            if (audioChunks.current.length === 0) {
                setPermessionErr("No audio to transcribe. Please record or upload an audio file.");
                return;
            }

            const blob = new Blob(audioChunks.current, { type: 'audio/webm' });

            const formData = new FormData();
            formData.append("file", blob, "recording.webm");

            const res = await fetch("/api/transcribe", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            setTranscript(data.text || `Error transcribing ${data.error.message}`);
        } catch (err) {
            if (err instanceof Error) {
                console.error("Error during transcription:", err);
                setTranscript(`Failed... check console for more info ${err.message}`);
            }
        }
    }

    return (
        <DashboardCard title="Audio Recorder">
            <div className="space-y-6">
                {/* Recording Instructions */}
                <p className="text-gray-600 text-sm">Record a conversation with your patient or drag & drop an audio file</p>

                {/* Recording Box - Fixed Area */}
                <div
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 min-h-64 flex flex-col items-center justify-center
                        ${isDragOver 
                            ? 'border-violet-500 bg-violet-50' 
                            : isRecording
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                        }
                    `}
                >
                    {!isRecording && !audioUrl ? (
                        <div className="space-y-4 w-full">
                            <div className="text-4xl">🎙️</div>
                            
                            {/* Recording Button */}
                            <button
                                onClick={() => startRecording()}
                                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-3 cursor-pointer font-semibold transition-colors duration-200"
                            >
                                Start Recording
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-gray-500 text-sm">or</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {/* File Upload */}
                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-violet-600 hover:text-violet-700 font-semibold transition-colors duration-200"
                                >
                                    Choose Audio File
                                </button>
                                <p className="text-gray-500 text-xs mt-2">or drag & drop an audio file here</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                            </div>
                        </div>
                    ) : isRecording ? (
                        <div className="space-y-4 w-full">
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                                <span className="text-red-600 font-semibold">Recording...</span>
                            </div>
                            
                            {/* Recording Time */}
                            <div className="text-3xl font-mono text-red-600">
                                {formatTime(recordingTime)}
                            </div>

                            {/* Stop Button */}
                            <button
                                onClick={() => stopRecording()}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-3 cursor-pointer font-semibold transition-colors duration-200"
                            >
                                Stop Recording ⏹️
                            </button>
                        </div>
                    ) : audioUrl ? (
                        <div className="space-y-4 w-full">
                            <div className="text-green-600 text-sm font-semibold">✓ Audio Ready</div>
                            
                            {/* Audio Player */}
                            <audio 
                                controls 
                                src={audioUrl} 
                                className="w-full rounded-lg"
                            />

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-center flex-wrap">
                                <button
                                    onClick={() => {
                                        setAudioUrl(null);
                                        audioChunks.current = [];
                                        setRecordingTime(0);
                                        setPermessionErr("");
                                    }}
                                    className="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-6 py-2 cursor-pointer font-semibold transition-colors duration-200"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => startRecording()}
                                    className="border border-violet-600 text-violet-600 hover:bg-violet-50 rounded-full px-6 py-2 cursor-pointer font-semibold transition-colors duration-200"
                                >
                                    Record Again
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Error Messages */}
                {permessionErr && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                        {permessionErr}
                    </div>
                )}

                {/* Extract Transcript Button */}
                {audioUrl && (
                    <button
                        onClick={onExtractTranscript}
                        className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-full px-6 py-3 cursor-pointer font-semibold transition-colors duration-200"
                    >
                        Extract Transcript 📝
                    </button>
                )}
            </div>
        </DashboardCard>
    )
}