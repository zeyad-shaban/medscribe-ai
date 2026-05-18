import Link from "next/link";
import { PricingTable, Show, SignUpButton } from "@clerk/nextjs";

const features = [
  {
    title: "Browser recording",
    description:
      "Capture the conversation directly in the browser without extra tools.",
  },
  {
    title: "Speaker separation",
    description:
      "Keep the transcript structured as Person A and Person B for clarity.",
  },
  {
    title: "AI medical summary",
    description:
      "Send the transcript to Gemini and generate next steps and patient notes.",
  },
];

const steps = [
  "Record the conversation inside the browser.",
  "Turn speech into a structured transcript.",
  "Generate a medical summary and follow-up plan.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-300">
            AI-assisted medical conversation summaries
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Turn doctor conversations into structured medical summaries
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Record in the browser, separate speakers, and generate AI follow-up
            notes with next steps for the patient.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="rounded-full bg-violet-600 px-6 py-3 font-medium hover:bg-violet-500">
                  Get started
                </button>
              </SignUpButton>
            </Show>

            <Link
              href="/dashboard"
              className="rounded-full border border-white/15 px-6 py-3 font-medium hover:bg-white/10"
            >
              View dashboard
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-semibold">How it works</h2>

            <div className="mt-6 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-7 text-zinc-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <div className="mb-6">
              <p className="text-sm font-medium text-violet-300">Pricing</p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Choose your plan
              </h2>

              <p className="mt-3 text-zinc-300">
                Unlock AI-generated medical summaries and premium features.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4">
              <PricingTable />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}