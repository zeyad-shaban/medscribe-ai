import { useState } from "react";
import DashboardCard from "@/src/components/DashboardCard";

interface FollowUpEmailCardProps {
  emailBody: string;
}

export default function FollowUpEmailCard({ emailBody }: FollowUpEmailCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardCard title="📧 Follow-up email (patient)">
      <div className="bg-white/5 p-4 rounded-md text-white/80 text-sm whitespace-pre-wrap font-mono">
        {emailBody}
      </div>
      <button
        onClick={copyToClipboard}
        className="mt-3 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded cursor-pointer"
      >
        {copied ? "Copied!" : "Copy email"}
      </button>
    </DashboardCard>
  );
}