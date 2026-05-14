import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server";
import { medicalModelName } from "@/src/lib/constants";
import { medicalPrompt } from "@/src/lib/prompts";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey)
            throw "GEMINI_API_KEY is undefined";

        const { transcript } = await (req.json())
        if (!transcript || typeof transcript !== "string")
            return NextResponse.json({ message: "must provide 'transcript' as a string" }, { status: 400 })

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: medicalModelName,
        });


        const prompt = `
            ${medicalPrompt.replace("{{TRANSCRIPT}}", `{{${transcript}}}`)}
            ${transcript}
        `
        // get result
        const result = await model.generateContent(prompt);
        const res = await result.response;

        const txt = res.text().replace("```json", "").replace("```", "");

        return NextResponse.json(JSON.parse(txt), { status: 200 });

    } catch (err) {
        console.log("Error in /api/ai_analysis: ", err)
        if (err instanceof Error)
            return NextResponse.json({ message: `Gemini API call failed: ${err.message}` }, { status: 500 })
    }
}