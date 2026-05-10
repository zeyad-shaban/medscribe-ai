import type { Metadata } from "next";
import Link from "next/link";
import { ClerkProvider, SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MedScribeAI",
  description: "AI medical conversation summarizer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <div className="min-h-screen bg-zinc-950 text-white">
            <header className="border-b border-white/10 bg-zinc-950/90 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/" className="text-lg font-bold tracking-tight">
                  MedScribeAI
                </Link>

                <div className="flex items-center gap-3">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <button className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/10">
                        Sign in
                      </button>
                    </SignInButton>

                    <SignUpButton mode="modal">
                      <button className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500">
                        Sign up
                      </button>
                    </SignUpButton>
                  </Show>

                  <Show when="signed-in">
                    <Link
                      href="/dashboard"
                      className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium hover:bg-white/10"
                    >
                      Dashboard
                    </Link>
                    <UserButton />
                  </Show>
                </div>
              </div>
            </header>

            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}