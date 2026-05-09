<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# MedScribe AI — Project Purpose

## Overview

MedScribe AI is a **Next.js SaaS-style web app** for healthcare conversations.  
Its purpose is to help a doctor capture a conversation with a patient, turn the speech into a structured transcript, and then use an AI model to generate a clear medical summary and next steps.

This project is primarily a **learning project**, but it should still follow good engineering practices as if it were a real product.

## Core Goal

The app should let a user:

1. Record a conversation in the browser.
2. Split the transcript into two speakers:
   - **Person A**
   - **Person B**
3. Send the transcript to **Google Gemini** using an API key.
4. Receive an AI-generated response that summarizes the medical discussion.
5. Display that summary clearly in the app.
6. Eventually allow the summary to be emailed to the patient.

## Current MVP Scope

The first version should be intentionally simple:

- **Frontend only**
- **No database**
- **No permanent storage**
- **In-browser audio recording only**
- **Clerk authentication**
- **Single workspace per user**
- **Paid feature gate** for AI summarization
- **Gemini API** for summary generation

## What the AI Output Should Contain

The AI response should be formatted in a useful medical style, such as:

- short conversation summary
- symptoms mentioned
- possible concerns or key medical notes
- suggested next steps
- patient-friendly follow-up message

The output should be easy to read inside the dashboard and later easy to send by email.

## What This App Is Not

This app is **not** intended to be a full medical record system.

It does **not** need to handle:

- full patient databases
- clinic management
- prescription workflows
- insurance workflows
- long-term storage of medical records
- advanced diarization or enterprise transcription in v1

## Tech Stack

- **Next.js**
- **Tailwind CSS**
- **Clerk** for authentication and subscription gating
- **Google Gemini API** for summarization
- **Vercel** for deployment

## Product Philosophy

The app should be built with a production mindset:

- clean folder structure
- environment variables kept secret
- reusable components
- clear API route boundaries
- readable code
- maintainable patterns
- simple but polished UI

## Development Approach

Start with the smallest useful version:

1. landing page
2. auth flow
3. dashboard
4. recorder UI
5. transcript display
6. summarize button
7. Gemini API route
8. result display
9. later: email sending

## Important Design Note

For the first version, transcript speaker separation can stay simple.

It is acceptable to label the speakers as:

- Person A
- Person B

The app does not need perfect medical diarization at the beginning.

## Expected Outcome

At the end of the MVP, the user should be able to:

- sign in
- record a conversation
- view the transcript
- send it to Gemini
- get a medical summary instantly
- see a polished result in the dashboard

## Long-Term Direction

If the MVP works well, the app can later grow into a more complete healthcare SaaS product with:

- email exports
- better speaker detection
- saved history
- team workspaces
- clinic accounts
- better subscription billing
- exportable reports


<!-- END:nextjs-agent-rules -->