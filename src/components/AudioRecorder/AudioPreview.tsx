interface AudioPreviewProps {
    audioUrl: string;
    onClear: () => void;
    onRecordAgain: () => void;
}

export function AudioPreview({ audioUrl, onClear, onRecordAgain }: AudioPreviewProps) {
    return (
        <div className="space-y-4 w-full">
            <div className="text-green-600 text-sm font-semibold">✓ Audio Ready</div>
            <audio controls src={audioUrl} className="w-full rounded-lg" />
            <div className="flex gap-3 justify-center flex-wrap">
                <button
                    onClick={onClear}
                    className="border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-6 py-2 cursor-pointer font-semibold"
                >
                    Clear
                </button>
                <button
                    onClick={onRecordAgain}
                    className="border border-violet-600 text-violet-600 hover:bg-violet-50 rounded-full px-6 py-2 cursor-pointer font-semibold"
                >
                    Record Again
                </button>
            </div>
        </div>
    );
}