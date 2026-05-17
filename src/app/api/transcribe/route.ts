import { TranscriptionResponseSchema } from "@/src/schemas/transcription"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0)
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    return NextResponse.json({
        "transcript": "This is a dummy transcript. Replace this with actual transcription logic using your preferred speech-to-text API.",
    })

    try {
        const response = await fetch("https://zeyadcode-medscribe-backend.hf.space/transcribe", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        const validationResult = TranscriptionResponseSchema.safeParse(data);

        if (!validationResult.success) {
            console.error("Invalid transcription response format:", validationResult.error);
            console.error("Received transcription response:", data);
            return NextResponse.json({ error: "Invalid transcription response" }, { status: 500 });
        }

        return NextResponse.json(validationResult.data);
    } catch (err) {
        console.log("Error calling Groq API in /api/transcribe: ", err)
        return NextResponse.json({ error: "Failed to transcript audio" }, { status: 500 })
    }
}