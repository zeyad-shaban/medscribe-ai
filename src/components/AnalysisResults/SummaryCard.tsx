import DashboardCard from "@/src/components/DashboardCard";

interface SummaryCardProps {
    data: {
        patient_reported_symptoms: string;
        doctor_findings_and_diagnosis: string;
        prescribed_medicines: string;
        next_actions_doctor_said: string;
    };
}

export default function SummaryCard({ data }: SummaryCardProps) {
    return (
        <DashboardCard title="📋 Clinical Summary">
            <div className="space-y-3 text-sm">
                <div>
                    <h3 className="font-semibold text-indigo-300">Patient reported symptoms</h3>
                    <div className="mt-1 text-white/80 whitespace-pre-wrap">{data.patient_reported_symptoms}</div>
                </div>
                <div>
                    <h3 className="font-semibold text-indigo-300">Doctor’s findings / diagnosis</h3>
                    <div className="mt-1 text-white/80">{data.doctor_findings_and_diagnosis}</div>
                </div>
                <div>
                    <h3 className="font-semibold text-indigo-300">Prescribed medicines</h3>
                    <div className="mt-1 text-white/80">{data.prescribed_medicines}</div>
                </div>
                <div>
                    <h3 className="font-semibold text-indigo-300">Next actions (doctor’s orders)</h3>
                    <div className="mt-1 text-white/80">{data.next_actions_doctor_said}</div>
                </div>
            </div>
        </DashboardCard>
    );
}
