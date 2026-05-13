import DashboardCard from "@/src/components/DashboardCard";

interface FeedbackCardProps {
    communicationQuality: string;
    suggestions: string;
}

export default function FeedbackCard({ communicationQuality, suggestions }: FeedbackCardProps) {
    return (
        <DashboardCard title="📢 Private feedback for doctor">
            <div className="space-y-3">
                <div>
                    <h3 className="font-semibold text-indigo-300">Communication quality</h3>
                    <p className="text-white/80 text-sm mt-1">{communicationQuality}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-indigo-300">Suggestions for improvement</h3>
                    <p className="text-white/80 text-sm mt-1">{suggestions}</p>
                </div>
            </div>
        </DashboardCard>
    );
}