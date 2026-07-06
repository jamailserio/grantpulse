# CLAUDE.md - GrantPulse Development Architecture

## Core Directive
You are building GrantPulse—a secure, high-utility, zero-retention compliance tool for international NGO proposal writers. Adhere to Next.js 14 App Router paradigms and Tailwind CSS layout patterns. Ensure the AI engine stream uses server-to-client token parsing strictly through the Vercel AI SDK. Under no circumstances are you to implement file uploads, user login mechanisms, or data caching layers. Keep text data strictly ephemeral to enforce the zero-retention privacy protocol.

## Project Scope Constraints (MVP)
- **Single-Session Focus:** Do not implement user authentication tables, Supabase storage hooks, or database integrations[cite: 120, 131]. State is entirely ephemeral and client-managed[cite: 131].
- **Text-Only Processing:** Do not write file parsing libraries for raw PDFs or documents[cite: 122]. Inputs are limited strictly to direct text area entry[cite: 123].

## Coding Standards & Patterns
1. **Zero Retention Flow:** Ensure all endpoint handlers process payloads using memory buffers or standard event streams[cite: 128, 135]. No logging or caching of user narrative strings[cite: 129].
2. **Streaming Protocol:** Always utilize the Vercel AI SDK's `streamObject` mechanics to feed real-time JSON strings back to the frontend[cite: 135]. This prevents network timeouts on large text blocks[cite: 135, 165].
3. **UI Micro-Interactions:** - Dynamically colorize the score index indicator based on thresholds: Red (0–49%), Amber (50–79%), Green (80–100%)[cite: 161].
   - Block submission triggers entirely unless text length passes baseline requirements[cite: 153].

## Essential Build Commands
- Dev Server: `npm run dev`
- Local Production Build Check: `npm run build`
- Run Component Assertions: `npm run test`
