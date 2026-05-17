import { useState, useRef } from "react";

// WAV encoder utility
function encodeWAV(samples: Float32Array, sampleRate: number): ArrayBuffer {
    const frameLength = samples.length;
    const channelCount = 1;
    const bytesPerSample = 2;
    const blockAlign = channelCount * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataLength = frameLength * blockAlign;
    const bufferLength = 44 + dataLength;

    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(0, "RIFF");
    view.setUint32(4, bufferLength - 8, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true); // subchunk1 size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, channelCount, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // bits per sample
    writeString(36, "data");
    view.setUint32(40, dataLength, true);

    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < frameLength; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        offset += 2;
    }

    return arrayBuffer;
}

export function useAudioRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // for transcription

    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const processor = useRef<ScriptProcessorNode | null>(null);
    const samples = useRef<Float32Array[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            samples.current = [];
            setRecordingTime(0);
            setAudioUrl(null);
            setAudioBlob(null);

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Initialize AudioContext for raw audio capture
            audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioContext.current.createMediaStreamSource(stream);
            
            // Use ScriptProcessorNode to capture raw audio data
            const bufferSize = 4096;
            processor.current = audioContext.current.createScriptProcessor(bufferSize, 1, 1);
            
            processor.current.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                samples.current.push(new Float32Array(inputData));
            };
            
            source.connect(processor.current);
            processor.current.connect(audioContext.current.destination);

            setIsRecording(true);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            throw err; // let parent handle error
        }
    };

    const stopRecording = () => {
        if (!audioContext.current || !processor.current) return;
        
        processor.current.disconnect();
        audioContext.current.close();
        
        // Combine all samples
        const totalSamples = samples.current.reduce((sum, arr) => sum + arr.length, 0);
        const combinedSamples = new Float32Array(totalSamples);
        let offset = 0;
        
        for (const sample of samples.current) {
            combinedSamples.set(sample, offset);
            offset += sample.length;
        }
        
        // Encode to WAV
        const sampleRate = audioContext.current.sampleRate;
        const wavBuffer = encodeWAV(combinedSamples, sampleRate);
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        setAudioUrl(url);
        setAudioBlob(blob);
        setIsRecording(false);
        
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const clearAudio = () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setAudioBlob(null);
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