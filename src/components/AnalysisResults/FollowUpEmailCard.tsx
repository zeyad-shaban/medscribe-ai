import { useState } from "react";
import DashboardCard from "@/src/components/DashboardCard";

interface FollowUpEmailCardProps {
  emailBody: string; // This now contains HTML strings (e.g., "<p>Hello</p>")
  emailSubject: string;
}

export default function FollowUpEmailCard({ emailSubject, emailBody }: FollowUpEmailCardProps) {
  const [copied, setCopied] = useState(false);

  // Extracts plain text from HTML to ensure clipboard copy remains clean
  const copyToClipboard = () => {
    const doc = new DOMParser().parseFromString(emailBody, "text/html");
    const plainText = doc.body.textContent || "";
    
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardCard title="📧 Follow-up email to patient">
      <div className="bg-white/5 p-4 rounded-md text-white/80 text-sm font-mono">
        <h3 className="text-lg font-semibold mb-2">Subject: {emailSubject}</h3>
        
        {/* Renders HTML safely inside the component */}
        <div 
          dangerouslySetInnerHTML={{ __html: emailBody }} 
          className="email-html-content"
        />
      </div>
      <button
        onClick={copyToClipboard}
        className="mt-3 text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded cursor-pointer"
      >
        {copied ? "Copied plain text!" : "Copy email"}
      </button>
    </DashboardCard>
  );
}
