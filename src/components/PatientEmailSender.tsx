import { useState } from "react";
import DashboardCard from "@/src/components/DashboardCard";

interface PatientEmailSenderProps {
    defaultEmailBody: string;
}

export default function PatientEmailSender({ defaultEmailBody }: PatientEmailSenderProps) {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);

    const sendEmail = async () => {
        if (!email) return;
        setSending(true);
        // call your /api/send-email endpoint with { to: email, body: defaultEmailBody }
        await new Promise((r) => setTimeout(r, 1000)); // mock
        alert("Email sent (demo)");
        setSending(false);
    };

    return (
        <DashboardCard title="✉️ Send email to patient">
            <input
                type="email"
                placeholder="patient@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-zinc-900 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            <button
                onClick={sendEmail}
                disabled={sending || !email}
                className="mt-3 bg-green-700 hover:bg-green-600 px-4 py-2 rounded text-white disabled:bg-gray-500 cursor-pointer"
            >
                {sending ? "Sending..." : "Send email"}
            </button>
        </DashboardCard>
    );
}