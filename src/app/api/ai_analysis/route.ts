import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server";
import { freeTierLimiter } from "@/src/lib/ratelimit";
import { medicalModelName } from "@/src/lib/constants";
import { medicalPrompt } from "@/src/lib/prompts";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        // 1. Authenticate the active user session with Clerk
        const { userId, has } = await auth();
        if (!userId)
            return NextResponse.json({ message: "Unauthorized access" }, { status: 401 });

        // 2. Fetch User metadata to check subscription level
        const isPremium = has({ permission: "unlimited_ai_analysis" });

        if (!isPremium) {
            const identifier = `ratelimit_${userId}`;
            const { success, limit, reset, remaining } = await freeTierLimiter.limit(identifier);

            // Create tracking headers to tell the UI how many tokens remain
            const headers = {
                "X-RateLimit-Limit": limit.toString(),
                "X-RateLimit-Remaining": remaining.toString(),
                "X-RateLimit-Reset": reset.toString(),
            };

            if (!success) {
                return NextResponse.json(
                    { message: "Free tier limit exceeded. You can only run 3 analyses per hour. (upgrading to paid tier is currently free and doesn't require credit card)" },
                    {
                        status: 429,
                        headers: headers
                    }
                );
            }
        }

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