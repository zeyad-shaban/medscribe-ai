import DashboardCard from "@/src/components/DashboardCard";

interface InsightsCardProps {
  disclaimer: string;
  clinicalConsiderations: string;  // might be empty
  redFlags: string;
}

export default function InsightsCard({ disclaimer, clinicalConsiderations, redFlags }: InsightsCardProps) {
  return (
    <DashboardCard title="🧠 AI Clinical Insights">
      <div className="text-xs text-yellow-300 mb-3 italic">{disclaimer}</div>
      {clinicalConsiderations && (
        <div className="mb-3 p-3 bg-yellow-900/30 rounded border-l-4 border-yellow-500">
          <h3 className="font-semibold text-yellow-200">Consideration</h3>
          <p className="text-white/90 text-sm">{clinicalConsiderations}</p>
        </div>
      )}
      {redFlags && (
        <div className="p-3 bg-red-900/30 rounded border-l-4 border-red-500">
          <h3 className="font-semibold text-red-200">⚠️ Red flags / escalation</h3>
          <p className="text-white/90 text-sm">{redFlags}</p>
        </div>
      )}
      {!clinicalConsiderations && !redFlags && (
        <p className="text-white/50 text-sm">No additional AI insights triggered.</p>
      )}
    </DashboardCard>
  );
}