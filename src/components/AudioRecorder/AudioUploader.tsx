import { useRef } from "react";

interface AudioUploaderProps {
    onFileSelected: (file: File) => void;
    isDragOver: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
}

export function AudioUploader({ onFileSelected, isDragOver, onDragOver, onDragLeave, onDrop }: AudioUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (files && files.length > 0) onFileSelected(files[0]);
    };

    return (
        <div className="space-y-4 w-full">
            <div>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-violet-600 hover:text-violet-700 font-semibold"
                >
                    Choose Audio File
                </button>
                <p className="text-gray-500 text-xs mt-2">or drag & drop an audio file here</p>
                <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileInput} className="hidden" />
            </div>
        </div>
    );
}