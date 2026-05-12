export default function Card({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white px-6 py-3 bg-white/5 my-4 space-y-5">
            <h1 className="text-4xl mb-4 font-bold">{title}</h1>
            {children}
        </div>
    )
}