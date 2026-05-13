"use client";
import { useState } from "react";
import DashboardCard from "@/src/components/DashboardCard";
import { useAudioRecorder } from "@/src/hooks/useAudioRecorder";
import { RecordingButton } from "@/src/components/AudioRecorder/RecordingButton";
import { AudioPreview } from "@/src/components/AudioRecorder/AudioPreview";
import { AudioUploader } from "@/src/components/AudioRecorder/AudioUploader";
import { TranscriptionButton } from "@/src/components/AudioRecorder/TranscribeButton";

export default function RecorderCard({ setTranscript }: { setTranscript: (text: string) => void }) {
    const { isRecording, recordingTime, audioUrl, audioBlob, startRecording, stopRecording, clearAudio, setExternalAudio } = useAudioRecorder();
    const [permessionErr, setPermessionErr] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);

    const handleStartRecording = async () => {
        try {
            await startRecording();
            setPermessionErr("");
        } catch (err) {
            if ((err as Error).name === "NotAllowedError")
                setPermessionErr("Microphone access was denied. Please enable it in site settings.");
            else
                setPermessionErr("Microphone not available, please check your device settings.");
        }
    };

    const handleFileSelected = (file: File) => {
        if (!file.type.startsWith('audio/')) {
            setPermessionErr("Please select an audio file.");
            return;
        }
        setExternalAudio(file);
        setPermessionErr("");
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = () => setIsDragOver(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelected(file);
    };

    const handleTranscriptionSuccess = (text: string) => {
        setTranscript(text);
    };

    const handleTranscriptionError = (msg: string) => {
        setPermessionErr(msg);
    };

    return (
        <DashboardCard title="Audio Recorder">
            <div className="space-y-6">
                <p className="text-gray-600 text-sm">Record a conversation with your patient or drag & drop an audio file</p>

                {/* Drag & drop area */}
                <div
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
                            <RecordingButton
                                isRecording={false}
                                recordingTime={0}
                                onStart={handleStartRecording}
                                onStop={() => { }}
                            />
                            <div className="flex items-center gap-3 my-4">
                                <div className="flex-1 h-px bg-gray-300" />
                                <span className="text-gray-500 text-sm">or</span>
                                <div className="flex-1 h-px bg-gray-300" />
                            </div>
                            <AudioUploader
                                onFileSelected={handleFileSelected}
                                isDragOver={isDragOver}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            />
                        </div>
                    ) : isRecording ? (
                        <RecordingButton
                            isRecording={true}
                            recordingTime={recordingTime}
                            onStart={() => { }}
                            onStop={stopRecording}
                        />
                    ) : audioUrl ? (
                        <AudioPreview
                            audioUrl={audioUrl}
                            onClear={clearAudio}
                            onRecordAgain={handleStartRecording}
                        />
                    ) : null}
                </div>

                {permessionErr && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                        {permessionErr}
                    </div>
                )}

                {audioUrl && (
                    <TranscriptionButton
                        audioBlob={audioBlob}
                        onTranscribe={handleTranscriptionSuccess}
                        onError={handleTranscriptionError}
                    />
                )}
            </div>
        </DashboardCard>
    );
}