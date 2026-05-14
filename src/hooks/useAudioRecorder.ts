import { useState, useRef } from "react";

export function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // for transcription

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<BlobPart[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            audioChunks.current = [];
            setRecordingTime(0);
            setAudioUrl(null);
            setAudioBlob(null);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setAudioBlob(blob);
                if (timerRef.current) clearInterval(timerRef.current);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            throw err; // let parent handle error
        }
    };

    const stopRecording = () => {
        if (!mediaRecorder.current) return;
        mediaRecorder.current.stop();
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const clearAudio = () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setAudioBlob(null);
        audioChunks.current = [];
        setRecordingTime(0);
    };

    const setExternalAudio = (file: File) => {
        clearAudio();
        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        // Convert file to blob for upload
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                const blob = new Blob([reader.result], { type: file.type });
                setAudioBlob(blob);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return {
        isRecording,
        recordingTime,
        audioUrl,
        audioBlob,
        startRecording,
        stopRecording,
        clearAudio,
        setExternalAudio,
    };
}