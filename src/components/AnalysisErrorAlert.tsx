"use client";
import { useEffect, useState } from "react";
import { PricingTable } from "@clerk/nextjs";

export interface AnalysisError {
    status: number;
    message: string;
    rateLimitInfo?: {
        limit: number;
        remaining: number;
        reset: number;
    };
}

interface AnalysisErrorAlertProps {
    error: AnalysisError | null;
    onDismiss: () => void;
    onRetry?: () => void;
    isRetrying?: boolean;
}

export default function AnalysisErrorAlert({
    error,
    onDismiss,
    onRetry,
    isRetrying = false,
}: AnalysisErrorAlertProps) {
    const [timeUntilReset, setTimeUntilReset] = useState<string>("");
    const [showPricing, setShowPricing] = useState(false);

    useEffect(() => {
        if (!error?.rateLimitInfo) return;

        const calculateTimeUntilReset = () => {
            const now = Date.now();
            const resetTime = error.rateLimitInfo!.reset;
            const diff = Math.max(0, resetTime - now);

            if (diff === 0) {
                setTimeUntilReset("now");
                onDismiss();
                return;
            }

            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            if (minutes > 0) {
                setTimeUntilReset(`${minutes}m ${seconds}s`);
            } else {
                setTimeUntilReset(`${seconds}s`);
            }
        };

        calculateTimeUntilReset();
        const interval = setInterval(calculateTimeUntilReset, 1000);
        return () => clearInterval(interval);
    }, [error?.rateLimitInfo, onDismiss]);

    if (!error) return null;

    const isRateLimited = error.status === 429;
    const isUnauthorized = error.status === 401;
    const isBadRequest = error.status === 400;

    return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 mb-4 transition-all duration-300">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    {isRateLimited ? (
                        <div className="text-2xl">⏱️</div>
                    ) : isUnauthorized ? (
                        <div className="text-2xl">🔐</div>
                    ) : (
                        <div className="text-2xl">⚠️</div>
                    )}
                    <div className="flex-1">
                        <h3 className="font-semibold text-red-900">
                            {isRateLimited
                                ? "Free Tier Limit Reached"
                                : isUnauthorized
                                ? "Authentication Required"
                                : isBadRequest
                                ? "Invalid Input"
                                : "Analysis Failed"}
                        </h3>
                        <p className="mt-1 text-sm text-red-800">{error.message}</p>
                    </div>
                </div>
                <button
                    onClick={onDismiss}
                    className="text-red-400 hover:text-red-600 text-xl leading-none cursor-pointer"
                >
                    ✕
                </button>
            </div>

            {/* Rate Limit Details */}
            {isRateLimited && error.rateLimitInfo && !showPricing && (
                <div className="mt-4 rounded-md bg-red-100 p-3 border border-red-200">
                    <div className="text-sm text-red-900">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Usage this hour:</span>
                            <span className="font-semibold">
                                {error.rateLimitInfo.limit - error.rateLimitInfo.remaining} / {error.rateLimitInfo.limit}
                            </span>
                        </div>
                        <div className="w-full bg-red-300 rounded-full h-2 overflow-hidden mb-2">
                            <div
                                className="bg-red-600 h-full transition-all"
                                style={{
                                    width: `${
                                        ((error.rateLimitInfo.limit - error.rateLimitInfo.remaining) /
                                            error.rateLimitInfo.limit) *
                                        100
                                    }%`,
                                }}
                            />
                        </div>
                        {timeUntilReset && (
                            <div className="text-xs">
                                🕐 Resets in: <span className="font-semibold">{timeUntilReset}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Call to Action Buttons */}
            {!showPricing && (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    {onRetry && !isRateLimited && (
                        <button
                            onClick={onRetry}
                            disabled={isRetrying}
                            className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {isRetrying ? "Retrying..." : "Try Again"}
                        </button>
                    )}

                    <button
                        onClick={() => setShowPricing(true)}
                        className="flex-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors text-center cursor-pointer"
                    >
                        {isRateLimited ? "Upgrade to premium" : "View Plans"}
                    </button>

                    <button
                        onClick={onDismiss}
                        className="flex-1 rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Inline Pricing Table (Expanded View) */}
            {showPricing && (
                <div className="mt-6 border-t border-red-200 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-bold text-red-900">Premium Plans</h4>
                        <button 
                            onClick={() => setShowPricing(false)}
                            className="text-sm text-red-700 hover:underline cursor-pointer"
                        >
                            Go Back
                        </button>
                    </div>
                    <div className="bg-white rounded-xl shadow-inner p-2 overflow-hidden">
                        <PricingTable />
                    </div>
                </div>
            )}

            {/* Info Text */}
            {isRateLimited && !showPricing && (
                <p className="mt-3 text-xs text-red-700 italic">
                    💡 Tip: Upgrade to premium for unlimited analyses. Currently free and doesn't require a credit card!
                </p>
            )}
        </div>
    );
}