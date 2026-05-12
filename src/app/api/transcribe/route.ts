import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file)
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const groqFormData = new FormData();
    groqFormData.append('file', file);
    groqFormData.append('model', 'whisper-large-v3-turbo');
    groqFormData.append('response_format', 'json');
    groqFormData.append('language', 'en');

    try {
        const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_SECRET_KEY}`,
            },
            body: groqFormData,
        });
        return NextResponse.json(await response.json());
    } catch (err) {
        console.log("Error calling Groq API in /api/transcribe: ", err)
        return NextResponse.json({ error: "Failed to transcript audio" }, { status: 500 })
    }
}