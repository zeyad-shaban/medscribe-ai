import { useState } from "react";

interface TranscriptionButtonProps {
    audioBlob: Blob | null;
    onTranscribe: (text: string) => void;
    onError: (errorMsg: string) => void;
}

export function TranscriptionButton({ audioBlob, onTranscribe, onError }: TranscriptionButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleTranscribe = async () => {
        if (!audioBlob) {
            onError("No audio to transcribe. Please record or upload an audio file.");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "recording.webm");

            const res = await fetch("/api/transcribe", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || "Transcription failed");
            onTranscribe(data.text);
        } catch (err) {
            onError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleTranscribe}
            disabled={isLoading || !audioBlob}
            className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-full px-6 py-3 cursor-pointer font-semibold transition-colors"
        >
            {isLoading ? "Transcribing... 🎙️" : "Extract Transcript 📝"}
        </button>
    );
}