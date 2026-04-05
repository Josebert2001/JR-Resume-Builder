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
3. Education — AI Enhance with AI (education_v2) + **Nigerian NYSC Panel** per education card
4. Work — AI bullets (work_bullets) + **No Experience Banner** (shown when 0 entries)
5. Skills — AI suggest with reasons per skill (skills_v2)
6. Projects — AI project bullets (project_bullets)
7. Certifications — AI cert analysis (certifications_v2)
8. Preview — 6 tabs with Back button to step 7

## Step 8 Preview Tabs
| Tab | Component | Description |
|-----|-----------|-------------|
| Auto-Build | `GenerateResumePanel` | One-click 4-wave AI pipeline: enhances all sections simultaneously |
| Preview | `ResumePreview` | Final resume + PDF/Word download + share copy toggle |
| Score | `ResumeScorePanel` | AI 7-section score with grade (A–F), progress bars, top fixes |
| Job Match | `JobMatchPanel` | Paste JD + jobTitle + company → match %, gap analysis, section fixes, top 3 fixes |
| Share | `ShareableResumePanel` | AI-generated WhatsApp/LinkedIn/email/OG copy fields |
| Template | `ResumeTemplates` | Change template |
| Analyze | `ResumeUpload` | Upload & improve an existing resume |

## Auto-Build Pipeline (resumeOrchestrator.ts)
4-wave parallel AI orchestration (~15s):
- **Wave 1**: `education_v2` + `work_bullets` + `project_bullets` + `certifications_v2` + `skills_v2` (all parallel)
- **Wave 2**: `summary_v2` + `resume_score` + `no_experience` (if 0 work) + `nigeria_nysc` (if toggled)
- **Wave 3**: `master_assembler` — synthesises all wave 1+2 outputs into coherent final resume
- **Wave 4**: `shareable_link` — generates WhatsApp/LinkedIn/email copy
- Options: NYSC toggle, optional JD paste for role targeting

## Backend AI Actions (VALID_ACTIONS)
`education`, `education_v2`, `work`, `work_bullets`, `project_bullets`, `summary_v2`, `certifications_v2`, `skills_v2`, `skills`, `skills_grouped`, `summary`, `ats_optimize`, `career_qa`, `orchestrate`, `analyze`, `resume_score`, `job_match`, `no_experience`, `nigeria_nysc`, `shareable_link`, `master_assembler`

## Key Files
- `server/groqPrompts.ts` — all AI prompts, normalizeResult, emptyFallback, VALID_ACTIONS
- `server/index.ts` — Express server with rate limiting
- `src/services/resumeAI.ts` — frontend service functions for all AI actions
- `src/context/ResumeContext.tsx` — global resume state + localStorage; exports Education, Project, Skill, WorkExperience, Certification, ResumeData types
- `src/pages/ResumeBuilder.tsx` — step routing + Preview tabs + Back button
- `src/components/PersonalInfoForm.tsx` — step 2 + Summary V2
- `src/components/EducationForm.tsx` — step 3 + Education V2 + NigerianNyscPanel per card
- `src/components/WorkExperienceForm.tsx` — step 4 + Work Bullets + NoExperienceBanner (0 entries)
- `src/components/SkillsForm.tsx` — step 5 + Skills V2 with per-chip reasoning
- `src/components/ProjectsForm.tsx` — step 6 + Project Bullets
- `src/components/CertificationsForm.tsx` — step 7 + Certifications V2
- `src/components/NyscHelper.tsx` — NYSC collapsible panel with CGPA/status/PPA inputs, dual local/international result, onApply callback
- `src/components/ResumeScorePanel.tsx` — 7-section score UI (grade ring + progress bars + fixes)
- `src/components/JobMatchPanel.tsx` — JD match UI (jobTitle + company + JD form, match score, section fixes accordion)
- `src/components/NoExperiencePanel.tsx` — no-exp banner UI (summary rewrite, projects-as-experience, tiered skills, 30-day plan)
- `src/components/ShareableLink.tsx` — AI-generated share copy (WhatsApp, LinkedIn, email signature, OG description)
- `src/components/GenerateResumePanel.tsx` — Auto-Build UI: 6-step animated progress tracker, NYSC toggle, optional JD input, result card with grade/ATS/applied sections
- `src/services/resumeOrchestrator.ts` — 4-wave parallel orchestration pipeline (buildFullResume); Wave1=sections, Wave2=enhancements, Wave3=master_assembler, Wave4=share copy

## Export
- **PDF**: `src/services/pdfService.ts` (html2canvas + jsPDF)
- **Word (.docx)**: `src/services/docxService.ts` (docx library)

## Important Notes
- Date inputs always use `type="text"` (iOS compatibility)
- Resume template components must NOT be modified
- `buildPrompt` returns `{ prompt, responseFormat, maxTokens? }` — server uses `maxTokens ?? 1000`
- NYSC Helper is embedded per education card; `onApply` callback writes description + gpa to the entry
- No Experience Banner is shown inline in WorkExperienceForm when workExperience array is empty
- Skill.level is a number (1–5); No Experience Mode assigns 4 for primary skills, 3 for supporting
- All new components use proper types imported from ResumeContext (no `any`)
