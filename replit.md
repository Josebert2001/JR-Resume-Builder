# Talory — AI Resume Builder

## Project Overview
**Talory** is an AI-powered resume builder targeting Nigerian college students and fresh graduates. Built with React/Vite frontend + Express backend proxying Groq AI (Llama 3.3 70B).

## Architecture
- **Frontend**: React + Vite (port 5000) — `src/`
- **Backend**: Express (port 3001) — `server/`
- **AI**: Groq API (Llama 3.3 70B) proxied via Express (`GROQ_API_KEY` env var)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: React Context + localStorage (`useLocalStorage` hook)
- **Run**: `npm run dev` via concurrently

## Colour Palette
- Green: `#2d6a4f`
- Orange: `#c05621`
- Warm stone background: `#f7f3ed`
- Near-black: `#0e0b08`
- NO gradients

## 8-Step Builder Flow
1. Template — choose from 4 templates (professional, modern, minimal, creative)
2. Info — personal info + AI Summary V2 (3 coached versions)
3. Education — AI Enhance with AI (education_v2)
4. Work — AI bullets (work_bullets) + **NYSC Helper** button
5. Skills — AI suggest with reasons per skill (skills_v2)
6. Projects — AI project bullets (project_bullets)
7. Certifications — AI cert analysis (certifications_v2)
8. Preview — 7 tabs: Preview, Template, Score, Job Match, No Exp?, Improve, Share

## Step 8 Preview Tabs
| Tab | Component | Description |
|-----|-----------|-------------|
| Preview | `ResumePreview` | Final resume + PDF/Word download |
| Template | `ResumeTemplates` | Change template |
| Score | `ResumeScorePanel` | AI 4-category score (Content, ATS, Impact, Completeness) |
| Job Match | `JobMatchPanel` | Paste JD → match %, gap analysis, quick wins |
| No Exp? | `NoExperiencePanel` | Action plan for students with no work experience |
| Improve | `ResumeImprover` | Legacy improvement suggestions |
| Share | `ShareableLink` | Base64 encode resume → shareable URL + import |

## Backend AI Actions (VALID_ACTIONS)
`education`, `education_v2`, `work`, `work_bullets`, `project_bullets`, `summary_v2`, `certifications_v2`, `skills_v2`, `skills`, `skills_grouped`, `summary`, `ats_optimize`, `career_qa`, `orchestrate`, `analyze`, `resume_score`, `job_match`, `no_experience`, `nysc_bullets`

## Key Files
- `server/groqPrompts.ts` — all AI prompts, normalizeResult, emptyFallback, VALID_ACTIONS
- `server/index.ts` — Express server with rate limiting
- `src/services/resumeAI.ts` — frontend service functions for all AI actions
- `src/context/ResumeContext.tsx` — global resume state + localStorage
- `src/pages/ResumeBuilder.tsx` — step routing + Preview tabs
- `src/components/PersonalInfoForm.tsx` — step 2 + Summary V2
- `src/components/EducationForm.tsx` — step 3 + Education V2
- `src/components/WorkExperienceForm.tsx` — step 4 + Work Bullets + NYSC Helper
- `src/components/SkillsForm.tsx` — step 5 + Skills V2 with per-chip reasoning
- `src/components/ProjectsForm.tsx` — step 6 + Project Bullets
- `src/components/CertificationsForm.tsx` — step 7 + Certifications V2
- `src/components/NyscHelper.tsx` — NYSC dialog with state/sector/PPA inputs
- `src/components/ResumeScorePanel.tsx` — 4-category score UI
- `src/components/JobMatchPanel.tsx` — JD match UI with keyword chips
- `src/components/NoExperiencePanel.tsx` — no-exp action plan UI
- `src/components/ShareableLink.tsx` — base64 encode/decode shareable link

## Export
- **PDF**: `src/services/pdfService.ts` (html2canvas + jsPDF)
- **Word (.docx)**: `src/services/docxService.ts` (docx library)

## Important Notes
- Date inputs always use `type="text"` (iOS compatibility)
- Resume template components must NOT be modified
- `buildPrompt` returns `{ prompt, responseFormat, maxTokens? }` — server uses `maxTokens ?? 1000`
- NYSC Helper populates work experience directly from the dialog
- Shareable link uses base64 encoding of JSON; fails gracefully if URL > 8KB
