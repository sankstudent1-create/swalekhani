# Swalekhani Architecture & File Structure

## Overview
Swalekhani is a dedicated, AI-powered official letterpad and document generator platform built with Next.js, React, Tailwind CSS, Groq LLM integration, and client-side PDF rendering.

## File Structure

```
src/
├── app/
│   ├── layout.tsx                # Global layout, fonts (Outfit, Poppins, JetBrains Mono, Yatra One), Swalekhani SEO & AdSense
│   ├── page.tsx                  # Root redirect to Swalekhani Letterpad Studio (/tools/letterpad-generator)
│   ├── about/                    # About Swalekhani & SW InfoSystems
│   ├── contact/                  # Contact & support channels
│   ├── privacy/                  # Privacy policy
│   ├── terms/                    # Terms of service
│   ├── disclaimer/               # Legal & AI generation disclaimer
│   ├── offline/                  # PWA offline fallback
│   ├── sitemap.ts                # Dynamic sitemap for Swalekhani routes
│   ├── manifest.ts               # PWA web manifest
│   ├── api/
│   │   ├── generate-letter/      # Groq AI letter generation endpoint
│   │   └── edit-letter/          # AI letter modification endpoint
│   └── tools/
│       ├── page.tsx              # Swalekhani Templates & Presets Catalog
│       └── letterpad-generator/  # Swalekhani Letterpad Studio
│           └── page.tsx
├── components/
│   ├── Navigation.tsx            # Global top navigation bar
│   ├── Footer.tsx                # Global footer
│   ├── AdSlot.tsx                # Google AdSense ad component
│   ├── PwaRegister.tsx           # PWA service worker registration
│   └── letterpad/
│       ├── AIChatAssistant.tsx   # Floating AI co-pilot modal with quick prompts & model selector
│       ├── Appbar.tsx            # Studio top action bar (Print, Export PDF, Endorsement toggles)
│       ├── EditToolbar.tsx       # Canvas contextual editing toolbar
│       ├── LetterPaper.tsx       # Live interactive A4 canvas (WYSIWYG, bilingual headers, emblems)
│       ├── Sidebar.tsx           # Sidebar control panel (Presets, Logos, Typography, Signature)
│       └── SignaturePad.tsx      # Integrated canvas signature pad
├── hooks/
│   └── useLetterState.ts         # Central state management for letters, presets, signatures, and AI fill
├── lib/
│   ├── canvasHelper.ts           # Cross-browser canvas & WebP utilities
│   └── letterpad/
│       ├── aiService.ts          # Groq AI client, prompt engineering, and response parsers
│       └── constants.ts          # Official GoI / State / Institutional SVG emblems & office presets
└── types/
    └── letterpad.ts              # TypeScript interfaces for letter forms, presets, and AI payloads
```

## Key Capabilities
- **Official Layouts**: India Post (DoP), Prime Minister / Ministries, MPs (Lok Sabha / Rajya Sabha), MLAs, District Administration, RMS, POSB, and Custom / Personal formats.
- **AI Co-Pilot**: Powered by Groq LLMs (Llama 3.3 70B, etc.) for sub-second generation of official Hindi, English, and bilingual letters.
- **Client-Side Privacy**: All document rendering and signature baking occurs directly in the browser; exports to vector A4 PDF via html2canvas & jsPDF.

