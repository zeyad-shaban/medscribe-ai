import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs"

export async function POST(req: Request) {
    try {
        const { email, subject, body } = await req.json();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: subject,
            html: `<p>${body}</p>`,
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            console.error("Error in /api/send_email: ", err)
            return NextResponse.json({ message: `Failed to send email: ${err.message}` }, { status: 500 })
        }
    }
}

export async function GET() {
    return NextResponse.json({ message: "hello world!" })
} 