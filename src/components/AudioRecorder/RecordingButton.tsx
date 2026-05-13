import { formatTime } from "@/src/lib/utils"

interface RecordingButtonProps {
    isRecording: boolean;
    recordingTime: number;
    onStart: () => void;
    onStop: () => void;
}

export function RecordingButton({ isRecording, recordingTime, onStart, onStop }: RecordingButtonProps) {
    if (!isRecording) {
        return (
            <button
                onClick={onStart}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-3 cursor-pointer font-semibold"
            >
                Start Recording
            </button>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="text-red-600 font-semibold">Recording...</span>
            </div>
            <div className="text-3xl font-mono text-red-600">{formatTime(recordingTime)}</div>
            <button
                onClick={onStop}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-3 cursor-pointer font-semibold"
            >
                Stop Recording ⏹️
            </button>
        </div>
    );
}