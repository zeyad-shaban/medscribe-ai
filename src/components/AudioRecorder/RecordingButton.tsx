"use client";

import { useEffect, useRef } from "react";
import { formatTime } from "@/src/lib/utils";

interface RecordingButtonProps {
    isRecording: boolean;
    recordingTime: number;
    onStart: () => void;
    onStop: () => void;
}

export function RecordingButton({ isRecording, recordingTime, onStart, onStop }: RecordingButtonProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    // Holds all captured volume peaks over the course of the recording
    const volumeHistoryRef = useRef<number[]>([]);

    async function initAudioVisualizer() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioCtx = new AudioContextClass();
            audioCtxRef.current = audioCtx;

            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            analyserRef.current = analyser;

            const source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const canvas = canvasRef.current;
            if (!canvas) return;
            const canvasCtx = canvas.getContext("2d");
            if (!canvasCtx) return;

            // Throttle historical sampling rate to ~10 times per second
            let lastSampleTime = Date.now();
            const sampleInterval = 100;

            const draw = () => {
                if (!canvasRef.current || !canvasCtx) return;
                animationFrameRef.current = requestAnimationFrame(draw);

                analyser.getByteFrequencyData(dataArray);

                // Calculate root-mean-square (RMS) or average level for the current window
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const averageVolume = sum / bufferLength;

                // Push current level to history array at throttled interval points
                const now = Date.now();
                if (now - lastSampleTime >= sampleInterval) {
                    // Normalize volume to a 0.0 - 1.0 range
                    volumeHistoryRef.current.push(averageVolume / 255);
                    lastSampleTime = now;
                }

                // Clear canvas
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

                const history = volumeHistoryRef.current;
                const totalBars = history.length;
                if (totalBars === 0) return;

                const maxVisibleBars = 80; // Limit total drawn bars to maintain screen space
                const targetBarWidth = 3;
                const gap = 1;
                const step = totalBars > maxVisibleBars ? totalBars / maxVisibleBars : 1;

                // Draw volume bars centered vertically
                const centerY = canvas.height / 2;

                for (let i = 0; i < Math.min(totalBars, maxVisibleBars); i++) {
                    // If historical array overflows screen capacity, sample points skip proportionally
                    const historyIndex = Math.floor(i * step);
                    const volumeValue = history[historyIndex] || 0;

                    // Establish dynamic height scaling; apply a minor baseline minimum height for visibility
                    const minHeight = 4;
                    const calculatedHeight = volumeValue * (canvas.height - 10);
                    const barHeight = Math.max(minHeight, calculatedHeight);

                    const x = i * (targetBarWidth + gap);
                    const y = centerY - barHeight / 2;

                    // Colorize bars based on timeline progress (e.g., played vs recording indicator color)
                    canvasCtx.fillStyle = "#dc2626"; // red-600

                    // Render rounded rectangular bar points
                    canvasCtx.beginPath();
                    if (canvasCtx.roundRect) {
                        canvasCtx.roundRect(x, y, targetBarWidth, barHeight, 1.5);
                    } else {
                        canvasCtx.rect(x, y, targetBarWidth, barHeight);
                    }
                    canvasCtx.fill();
                }
            };

            draw();
        } catch (err) {
            console.error("Visualizer microphone access failed:", err);
        }
    }

    function cleanupAudio() {
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
            audioCtxRef.current.close();
            audioCtxRef.current = null;
        }
    }

    useEffect(() => {
        if (isRecording) {
            volumeHistoryRef.current = []; // Reset history for new recording
            initAudioVisualizer();
        } else {
            cleanupAudio();
        }

        return () => {
            cleanupAudio();
        };
    }, [isRecording]);

    if (!isRecording) {
        return (
            <button
                onClick={onStart}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-full px-8 py-3 cursor-pointer font-semibold transition-colors"
            >
                Start Recording
            </button>
        );
    }

    return (
        <div className="space-y-4 flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="text-red-600 font-semibold">Recording...</span>
            </div>

            {/* WhatsApp Style Responsive Stacking Waveform Window */}
            <div className="w-full max-w-xs bg-gray-100 p-3 rounded-xl border border-gray-200 h-20 flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    width={320}
                    height={60}
                    className="w-full h-full"
                />
            </div>

            <div className="text-3xl font-mono text-red-600">{formatTime(recordingTime)}</div>

            <button
                onClick={onStop}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-3 cursor-pointer font-semibold transition-colors"
            >
                Stop Recording ⏹️
            </button>
        </div>
    );
}
