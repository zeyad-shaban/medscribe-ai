import { speechToTextModelName } from "@/src/lib/constants";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file || file.size === 0)
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    try {
        const response = await fetch("https://zeyadcode-medscribe-backend.hf.space/transcribe", {
            method: "POST",
            body: formData,
        });

        return NextResponse.json(await response.json());
    } catch (err) {
        console.log("Error calling Groq API in /api/transcribe: ", err)
        return NextResponse.json({ error: "Failed to transcript audio" }, { status: 500 })
    }
}