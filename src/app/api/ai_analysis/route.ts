import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server";
import { medicalModelName } from "@/src/lib/constants";
import { medicalPrompt } from "@/src/lib/prompts";

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey)
            throw "GEMINI_API_KEY is undefined";

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: medicalModelName,
        });

        const { transcript } = await (req.json())

        const prompt = `
            ${medicalPrompt.replace("{{TRANSCRIPT}}", `{{${transcript}}}`)}
            ${transcript}
        `
        // get result
        const result = await model.generateContent(prompt);
        console.log("done getting result through generateContent, result: ", result)
        const res = await result.response;
        
        const txt = res.text().replace("```json", "").replace("```", "");

        return NextResponse.json(JSON.parse(txt), { status: 200 });

    } catch (err) {
        console.log("Error in /api/ai_analysis: ", err)
        if (err instanceof Error)
            return NextResponse.json({ message: `Gemini API call failed: ${err.message}` }, { status: 500 })
    }
}