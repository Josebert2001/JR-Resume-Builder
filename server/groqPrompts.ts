export type ResponseFormat = "text" | "json";

export function buildPrompt(
  action: string,
  payload: Record<string, unknown>
): { prompt: string; responseFormat: ResponseFormat; maxTokens?: number } {
  switch (action) {

    // ─── Education (legacy) ────────────────────────────────────────────────
    case "education":
      return {
        prompt: `You are an expert in professional resume writing.
Given:
- Degree: ${payload.degree}
- Field of Study: ${payload.fieldOfStudy ?? ""}
- Institution: ${payload.school ?? ""}
- Graduation Year: ${payload.graduationYear ?? ""}
- Relevant Coursework/Achievements: ${payload.coursework ?? ""}
Write a concise education entry in 1–2 lines that:
- Highlights honors, awards, or specializations if any.
- Includes relevant keywords for the target role.
Output only the final formatted line(s).`,
        responseFormat: "text",
      };

    // ─── Education V2 (rich enhancement) ──────────────────────────────────
    case "education_v2":
      return {
        prompt: `You are a professional resume coach helping a college student write their education section. For students with limited work experience, education is one of the most powerful sections on their resume — most students write it too plainly and waste the opportunity.

STUDENT INPUT
Institution name: ${payload.institution ?? ""}
Degree type: ${payload.degreeType ?? ""}
Field of study: ${payload.fieldOfStudy ?? ""}
Major: ${payload.major ?? ""}
Minor (if any): ${payload.minor ?? ""}
Start year: ${payload.startYear ?? ""}
End year / Expected: ${payload.endYear ?? ""}
GPA: ${payload.gpa ?? ""}
GPA scale: ${payload.gpaScale ?? ""}
Honors/Awards: ${payload.honors ?? ""}
Relevant courses: ${payload.relevantCourses ?? ""}
Academic achievements: ${payload.achievements ?? ""}
Extracurricular roles: ${payload.extracurriculars ?? ""}
Career goal: ${payload.careerGoal ?? ""}

RULES
1. FORMAT the degree line as: [Degree Type] in [Field of Study] — [Institution Name] | [Duration]
2. GPA RULES: Only include GPA if strong (3.5+/5.0 or 4.0+/5.0). If weak or not provided, set "gpa" to null.
3. RELEVANT COURSES: Pick the top 4–6 courses most relevant to the career goal. Rename them to sound more professional if needed.
4. ACHIEVEMENTS: Rewrite academic achievements as punchy one-liners using action language.
5. EXTRACURRICULARS: Only include ones that reinforce the career goal or show leadership.
6. If the student has strong academic achievements, elevate the education section to compensate for thin work experience.
7. Never make up courses, honors, or achievements not mentioned by the student. If the student provides no coursework, return an empty array for relevant_courses.

Return ONLY valid JSON with this exact shape:
{
  "education_entry": {
    "degree_line": "Full formatted degree line",
    "institution": "Institution name",
    "duration": "Start – End/Expected",
    "gpa": "X.X/X.X or null if omitted",
    "honors": ["Honor 1", "Honor 2"],
    "relevant_courses": ["Course 1", "Course 2", "Course 3", "Course 4", "Course 5", "Course 6"],
    "achievements": ["Achievement bullet 1", "Achievement bullet 2"],
    "extracurriculars": ["Extracurricular bullet 1"]
  },
  "tip": "One coaching note about the education entry."
}`,
        responseFormat: "json",
        maxTokens: 1200,
      };

    // ─── Work (legacy) ─────────────────────────────────────────────────────
    case "work":
      return {
        prompt: `You are an ATS optimization specialist.
Given:
- Job Title: ${payload.position}
- Company: ${payload.company}
- Employment Dates: ${payload.dates ?? ""}
- Responsibilities/Notes: ${payload.responsibilities ?? ""}
Rewrite into 3–5 concise, achievement-based bullet points that:
- Start with strong action verbs.
- Include measurable results or impacts where possible.
- Naturally include relevant industry keywords.
- Avoid personal pronouns.
Output only the bullet points.`,
        responseFormat: "text",
      };

    // ─── Work Bullets V2 (coached) ─────────────────────────────────────────
    case "work_bullets":
      return {
        prompt: `You are a professional resume coach helping a college student or fresh graduate write their work experience section. Transform the student's raw description into powerful, ATS-optimized bullet points.

STUDENT INPUT
Job title: ${payload.position ?? ""}
Company/Organization: ${payload.company ?? ""}
Duration: ${payload.duration ?? ""}
What they did (in their own words): ${payload.rawDescription ?? ""}
Field of study: ${payload.fieldOfStudy ?? ""}
Career goal: ${payload.careerGoal ?? ""}

TASK: Transform their raw description into 3–4 professional resume bullet points.

RULES:
1. Every bullet must follow: [Strong Action Verb] + [What you did] + [Result or Impact]
2. Use a DIFFERENT action verb for every bullet. Never repeat.
   Strong verbs: Engineered, Diagnosed, Coordinated, Streamlined, Implemented, Developed, Reduced, Increased, Managed, Automated, Designed, Trained, Deployed, Monitored, Led, Built, Optimized.
3. Add realistic, specific metrics where the student did not provide them — only if credible for the role.
4. If the student had little responsibility, elevate what they DID do. Never fabricate roles they did not mention.
5. Tone: confident, professional, past tense for completed roles.
6. Each bullet must be 1 sentence, max 20 words.
7. Tailor language to their career goal and field of study.

Return ONLY valid JSON with this exact shape:
{
  "bullets": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
  "action_verbs_used": ["verb1", "verb2", "verb3", "verb4"],
  "tip": "One sentence coaching note about this experience entry."
}`,
        responseFormat: "json",
      };

    // ─── Project Bullets V2 (coached) ──────────────────────────────────────
    case "project_bullets":
      return {
        prompt: `You are a professional resume coach helping a college student write their projects section. Most students undersell their projects — your job is to make every project sound impressive and relevant.

STUDENT INPUT
Project name: ${payload.projectName ?? ""}
Technologies used: ${payload.techStack ?? ""}
What it does (in their own words): ${payload.rawDescription ?? ""}
Why they built it / motivation: ${payload.motivation ?? ""}
Field of study: ${payload.fieldOfStudy ?? ""}
Career goal: ${payload.careerGoal ?? ""}

TASK: Rewrite this project entry into a professional resume-ready format.

RULES:
1. The one-line description must answer: what is it, what does it do, and why does it matter — in under 15 words.
2. Bullet points must highlight: the technical challenge solved, the impact or user benefit, any scale or metric.
3. Lead every bullet with a strong action verb in past tense (Built, Designed, Integrated, Deployed, Implemented, Trained, Automated, Reduced, Optimized, Engineered, Developed).
4. If built for a class, reframe as a personal initiative.
5. Make the tech stack visible naturally inside the bullets — do not list it separately.
6. If the project is basic, frame it around the SKILLS demonstrated (state management, architecture, CRUD, etc.).
7. Never fabricate features the student did not mention.

Return ONLY valid JSON with this exact shape:
{
  "project_name": "cleaned up project name",
  "one_liner": "One powerful sentence describing the project (under 15 words)",
  "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "tech_keywords": ["keyword1", "keyword2", "keyword3"],
  "tip": "One coaching note — praising what is strong or asking what extra detail would improve this."
}`,
        responseFormat: "json",
      };

    // ─── Skills V2 (with reasons + tools) ─────────────────────────────────
    case "skills_v2":
      return {
        prompt: `You are a professional resume coach helping a college student or fresh graduate build their first resume. Based on the student's profile, suggest the most relevant and impactful skills for their resume.

STUDENT PROFILE
Field of study: ${payload.fieldOfStudy ?? ""}
Course/Major: ${payload.degree ?? ""}
Career goal: ${payload.careerGoal ?? ""}
Work experience: ${payload.workExperience ?? ""}
Projects: ${payload.projects ?? ""}
Certifications: ${payload.certifications ?? ""}

TASK: Suggest exactly 12 skills organized into 3 categories: Technical (4), Soft Skills (4), and Tools (4).

RULES:
1. Only suggest skills DIRECTLY relevant to their field, career goal, and experience.
2. Prioritize skills that appear frequently in job descriptions for their target role and are ATS-friendly.
3. For students with little work experience, pull from academic projects, coursework, and field requirements.
4. Soft skills must be specific — not vague. "Deadline management" not "hardworking". "Cross-functional collaboration" not "team player".
5. NEVER invent skills the student has not demonstrated through their profile.
6. The "reason" for each skill must be one short sentence explaining why it matters for their specific goal.

Return ONLY valid JSON with this exact shape:
{
  "suggested_skills": {
    "technical": [
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" }
    ],
    "soft": [
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" }
    ],
    "tools": [
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" },
      { "name": "skill name", "reason": "one short sentence why" }
    ]
  },
  "tip": "One encouraging sentence telling the student what makes their skill set strong for their target role."
}`,
        responseFormat: "json",
      };

    // ─── Summary (legacy) ──────────────────────────────────────────────────
    case "summary":
      return {
        prompt: `You are a professional career consultant and resume expert.
Given:
- Target Role: ${payload.role ?? ""}
- Industry: ${payload.industry ?? ""}
- Experience Summary: ${payload.experience ?? ""}
- Key Skills: ${JSON.stringify(payload.skills ?? [])}
Write a professional summary in 3–4 sentences that:
- Uses an active, confident tone.
- Includes relevant keywords for the target role.
- Highlights unique strengths and achievements.
- Avoids clichés like "hardworking" or "team player".
Output only the summary, no explanations.`,
        responseFormat: "text",
      };

    // ─── Summary V2 (3 coached versions) ──────────────────────────────────
    case "summary_v2":
      return {
        prompt: `You are a professional resume coach specializing in helping college students and fresh graduates write compelling professional summaries. The summary is the FIRST thing a recruiter reads — it must hook them in 2–3 sentences and make them want to read the rest of the resume.

STUDENT PROFILE
Full name: ${payload.fullName ?? ""}
Field of study: ${payload.fieldOfStudy ?? ""}
Major: ${payload.degree ?? ""}
Year/Level: ${payload.academicLevel ?? ""}
Career goal: ${payload.careerGoal ?? ""}
Top skills: ${payload.topSkills ?? ""}
Best experience: ${payload.bestExperience ?? ""}
Best project: ${payload.bestProject ?? ""}
Certifications: ${payload.certifications ?? ""}
Personality keywords (optional): ${payload.personalityKeywords ?? ""}

YOUR TASK: Write 3 versions of a professional summary — each taking a different strategic angle.

THE 3 ANGLES
Version 1 — SKILLS-LED: Lead with their strongest technical skill or certification. Best for students with strong technical background but little work experience.
Version 2 — GOAL-LED: Lead with their career ambition and what value they bring. Best for students who know exactly what role they want.
Version 3 — STORY-LED: Lead with a brief narrative of their journey. Best for students with an interesting background or non-traditional path.

RULES
1. Every summary must be exactly 2–3 sentences. Never more.
2. Never start with "I" — use openers like "A driven...", "Final-year...", "Passionate...", "Results-oriented...", "Aspiring...", "Certified..."
3. Include at least one specific keyword from their career goal or target industry — helps pass ATS filters.
4. End every summary with what the student is SEEKING or what value they will BRING — not just who they are.
5. Tone must be confident but not arrogant. Never say "I am a fast learner" or "I work well in teams" — most overused phrases.
6. Do NOT mention GPA unless it is above 4.0 on a 5.0 scale or equivalent.
7. Tailor every word to the career goal.

Return ONLY valid JSON with this exact shape:
{
  "summaries": {
    "skills_led": {
      "text": "Full 2-3 sentence summary",
      "best_for": "One sentence on when to use this version"
    },
    "goal_led": {
      "text": "Full 2-3 sentence summary",
      "best_for": "One sentence on when to use this version"
    },
    "story_led": {
      "text": "Full 2-3 sentence summary",
      "best_for": "One sentence on when to use this version"
    }
  },
  "recommended": "skills_led",
  "reason": "One sentence explaining why this version suits this student best.",
  "tip": "One actionable suggestion to make the summary even stronger."
}`,
        responseFormat: "json",
        maxTokens: 1500,
      };

    // ─── Certifications V2 (coached with hidden skills) ────────────────────
    case "certifications_v2":
      return {
        prompt: `You are a professional resume coach helping a college student present their certifications powerfully on their resume. Most students just list certification names — you will help them frame each one in a way that signals real competence to recruiters and ATS systems.

STUDENT INPUT
Certifications list: ${payload.certificationsList ?? ""}
Field of study: ${payload.fieldOfStudy ?? ""}
Career goal: ${payload.careerGoal ?? ""}
Skills already on resume: ${payload.existingSkills ?? ""}

YOUR TASK: For each certification provided, produce a polished resume-ready entry AND extract the hidden skills and keywords it unlocks.

RULES
1. FORMAT each certification as: [Certification Name] — [Issuing Body] | [Year]
   Example: "Google IT Support Professional Certificate — Google via Coursera | 2024"
2. For each certification write ONE value statement — a single sentence explaining what competency this cert proves, framed for the career goal.
3. Extract HIDDEN SKILLS from each certification — keywords and competencies the cert covers which the student may not have listed as skills.
4. Flag any MISSING certifications that would strongly boost this student's profile for their career goal. Suggest max 3 and explain why.
5. Rank the certifications by relevance to the career goal — most relevant first.
6. If a certification is irrelevant to the career goal, flag it as include_on_resume: false.
7. Never invent certifications. Only work with what the student provides.

Return ONLY valid JSON with this exact shape:
{
  "certifications": [
    {
      "rank": 1,
      "formatted_name": "Certification Name — Issuer | Year",
      "value_statement": "One sentence on what this cert proves",
      "hidden_skills": ["skill1", "skill2", "skill3", "skill4"],
      "relevance": "high",
      "include_on_resume": true
    }
  ],
  "missing_certifications": [
    {
      "name": "Certification name",
      "issuer": "Issuing body",
      "why": "One sentence on why this would strengthen the resume",
      "priority": "high"
    }
  ],
  "tip": "One overall coaching note about the student's certification profile."
}`,
        responseFormat: "json",
        maxTokens: 2000,
      };

    // ─── Skills (legacy) ───────────────────────────────────────────────────
    case "skills":
      return {
        prompt: `You are an ATS and career consultant.
Given:
- Target Role: ${payload.position ?? payload.role ?? ""}
- Experience: ${JSON.stringify(payload.experience ?? [])}
- Current Skills: ${JSON.stringify(payload.currentSkills ?? [])}
Suggest 8–12 skills as a flat list. Return JSON with this exact shape:
{ "skills": ["Skill 1", "Skill 2", "..."] }
Only return valid JSON.`,
        responseFormat: "json",
      };

    case "skills_grouped":
      return {
        prompt: `You are an ATS and career consultant.
Given:
- Target Role: ${payload.role ?? payload.position ?? ""}
- Experience: ${JSON.stringify(payload.experience ?? [])}
- Current Skills: ${JSON.stringify(payload.currentSkills ?? [])}
Suggest 8–12 skills grouped into:
- Technical Skills
- Soft Skills
Return JSON with this exact shape:
{ "skills": { "technical": ["..."], "soft": ["..."] } }
Only return valid JSON.`,
        responseFormat: "json",
      };

    case "ats_optimize":
      return {
        prompt: `You are an ATS scanning system.
Compare the resume to the job description and return JSON only with this exact shape:
{
  "missingKeywords": ["..."],
  "suggestedImprovements": ["..."],
  "quantifiableSuggestions": ["..."]
}
RESUME:
${payload.resumeText}

JOB DESCRIPTION:
${payload.jobDescription}`,
        responseFormat: "json",
      };

    case "career_qa":
      return {
        prompt: `You are a friendly, knowledgeable career coach.
User Question: ${payload.question}
Industry: ${payload.industry ?? ""}
Experience Level: ${payload.experienceLevel ?? ""}
Provide a clear, actionable answer with 2–4 practical tips, adapted to the user's industry and experience level.
Keep it concise and professional. Output only the answer.`,
        responseFormat: "text",
      };

    case "orchestrate":
      return {
        prompt: `You are an expert resume writer. Create coherent outputs for a resume based on the provided user data.
Return JSON only with this exact shape:
{
  "summary": "string",
  "workBullets": ["..."],
  "educationEntries": ["..."],
  "skills": { "technical": ["..."], "soft": ["..."] }
}
User Data: ${JSON.stringify(payload)}
Guidelines:
- Summary: 3–4 sentences, active voice, keyword-rich.
- WorkBullets: 3–5 impact bullets using action verbs and metrics.
- EducationEntries: 1–2 lines per entry highlighting honors or relevant items.
- Skills: balance role-relevant and industry keywords.`,
        responseFormat: "json",
      };

    case "analyze":
      return {
        prompt: `Analyze this resume against the job description and provide feedback:

RESUME:
${payload.resumeText}

JOB DESCRIPTION:
${payload.jobDescription}

Provide analysis in this JSON format:
{
  "score": number (0-100),
  "matchedKeywords": ["keyword1", "keyword2"],
  "missedKeywords": ["missing1", "missing2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Score the resume compatibility, identify matched and missed keywords, and provide actionable improvement suggestions.`,
        responseFormat: "json",
      };

    // ─── Resume Score — section-by-section with grade A–F ─────────────────
    case "resume_score":
      return {
        prompt: `You are a professional resume evaluator helping a college student or fresh graduate in Nigeria understand how strong their resume is. Score each section individually, then provide an overall grade.

RESUME DATA
Name: ${payload.fullName ?? ""}
Summary: ${payload.summary ?? ""}
Education: ${payload.education ?? ""}
Work experience: ${payload.workExperience ?? ""}
Skills: ${payload.skills ?? ""}
Projects: ${payload.projects ?? ""}
Certifications: ${payload.certifications ?? ""}

TASK: Score this resume section-by-section with specific, actionable feedback. Be honest but encouraging.

SECTION SCORING RANGES
- Summary (0–20): Is it compelling, specific, keyword-rich? Does it open with a hook?
- Experience (0–25): Achievement-based bullets? Action verbs? Quantified impact? Relevant to career goal?
- Projects (0–20): Are projects framed professionally? Tech stack visible? Impact shown?
- Skills (0–15): Are skills specific and ATS-friendly? Right mix of technical, tools, and soft?
- Education (0–10): Well-formatted? GPA included if strong? Relevant coursework or honors shown?
- Certifications (0–5): Listed with issuer? Relevant to goal?
- ATS (0–5): No tables, columns, or graphics? Standard section headings? Clean format?

GRADE SCALE (based on total out of 100)
A: 90–100, B: 75–89, C: 60–74, D: 45–59, F: below 45

For each section return:
- score (the number)
- fix: one specific sentence on the most impactful improvement
- status: "strong" | "good" | "fair" | "weak"

Return ONLY valid JSON with this exact shape:
{
  "total_score": number (0–100),
  "grade": "A | B | C | D | F",
  "grade_message": "One sentence explaining what the grade means for job applications",
  "sections": {
    "summary": { "score": number, "max": 20, "status": "strong|good|fair|weak", "fix": "specific fix sentence" },
    "experience": { "score": number, "max": 25, "status": "strong|good|fair|weak", "fix": "specific fix sentence" },
    "projects": { "score": number, "max": 20, "status": "strong|good|fair|weak", "fix": "specific fix sentence" },
    "skills": { "score": number, "max": 15, "status": "strong|good|fair|weak", "fix": "specific fix sentence" },
    "education": { "score": number, "max": 10, "status": "strong|good|fair|weak", "fix": "specific fix sentence" },
    "certifications": { "score": number, "max": 5, "status": "strong|good|fair|weak", "fix": "specific fix sentence" },
    "ats": { "score": number, "max": 5, "status": "strong|good|fair|weak", "fix": "specific fix sentence" }
  },
  "top_wins": ["What is already strong about this resume (1–3 items)"],
  "top_fixes": [
    { "priority": "high|medium|low", "section": "section name", "fix": "fix text", "score_impact": "+X pts" }
  ],
  "ats_risks": ["Any ATS red flags detected"]
}`,
        responseFormat: "json",
        maxTokens: 2000,
      };

    // ─── Job Match — JD match with section-level breakdown ──────────────────
    case "job_match":
      return {
        prompt: `You are a senior recruiter and ATS expert helping a Nigerian college student understand exactly how well their resume matches a specific job. Be specific, honest, and constructive.

STUDENT RESUME
${payload.resumeText ?? ""}

JOB DETAILS
Title: ${payload.jobTitle ?? ""}
Company: ${payload.company ?? ""}
Description: ${payload.jobDescription ?? ""}

TASK: Analyse the match between the resume and the job. Return a detailed breakdown.

Return ONLY valid JSON with this exact shape:
{
  "match_score": number (0–100),
  "match_label": "Strong Match | Good Match | Partial Match | Weak Match",
  "realistic_match": true,
  "verdict": "2–3 sentence overall assessment of fit and what to do next.",
  "matched_keywords": ["kw1", "kw2"],
  "missing_keywords": [{ "keyword": "kw", "importance": "critical|important|nice-to-have", "where_to_add": "section name" }],
  "section_fixes": [
    { "section": "section name", "issue": "what's wrong", "fix": "how to fix it" }
  ],
  "top_3_fixes": [
    { "rank": 1, "fix": "Most impactful fix to increase match score", "score_gain": "+X pts" },
    { "rank": 2, "fix": "Second most impactful fix", "score_gain": "+X pts" },
    { "rank": 3, "fix": "Third most impactful fix", "score_gain": "+X pts" }
  ]
}`,
        responseFormat: "json",
        maxTokens: 2500,
      };

    // ─── No Experience Mode — reframe profile for zero-experience students ──
    case "no_experience":
      return {
        prompt: `You are a career coach helping a Nigerian college student who has NO formal work experience build a competitive resume. Your job is to help them reframe what they already have.

STUDENT PROFILE
Name: ${payload.fullName ?? ""}
Field of study: ${payload.fieldOfStudy ?? ""}
Career goal: ${payload.careerGoal ?? ""}
Education: ${payload.education ?? ""}
Projects: ${payload.projects ?? ""}
Skills: ${payload.skills ?? ""}
Certifications: ${payload.certifications ?? ""}
Has volunteer/club experience: ${payload.hasVolunteer ?? "no"}

TASK: Analyse their profile and help them present a competitive resume without formal work experience.

RULES
1. Rewrite their professional summary to sound confident, not apologetic.
2. Reformat each project as if it were a professional experience entry (role title + bullets).
3. Suggest a recommended section order that buries the empty experience section.
4. Suggest a tiered skills structure: Primary (their strongest), Supporting, Learning.
5. If profile is very thin (no projects, no certs, no clubs), set has_nothing_flag to true and provide a 30-day action plan.
6. Never tell the student to lie — only reframe what is true.

Return ONLY valid JSON with this exact shape:
{
  "has_nothing_flag": false,
  "recommended_section_order": ["Summary", "Skills", "Projects", "Education", "Certifications"],
  "rewritten_summary": "Rewritten 2–3 sentence professional summary with no mention of inexperience",
  "projects_as_experience": [
    {
      "project_name": "original project name",
      "role_title": "Suggested professional role title (e.g. 'Full-Stack Developer — Personal Project')",
      "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"]
    }
  ],
  "tiered_skills": {
    "primary": ["top 4–5 skills they already have"],
    "supporting": ["3–4 adjacent skills they can claim"],
    "learning": ["2–3 skills to add in 30 days"]
  },
  "thirty_day_plan": ["Action 1", "Action 2", "Action 3", "Action 4", "Action 5"],
  "tip": "One coaching note."
}`,
        responseFormat: "json",
        maxTokens: 2000,
      };

    // ─── Nigerian NYSC — dual format for local and international employers ──
    case "nigeria_nysc":
      return {
        prompt: `You are a professional resume coach helping a Nigerian student format their NYSC (National Youth Service Corps) year for their resume. You will produce TWO versions — one for Nigerian employers and one for international employers.

STUDENT INPUT
Institution: ${payload.institution ?? ""}
Degree: ${payload.degree ?? ""}
Field of study: ${payload.fieldOfStudy ?? ""}
Graduation year: ${payload.graduationYear ?? ""}
CGPA: ${payload.cgpa ?? ""} out of ${payload.cgpaScale ?? "5.0"}
Degree class: ${payload.degreeClass ?? ""}
Honors/Awards: ${payload.honors ?? ""}
NYSC status: ${payload.nyscStatus ?? ""}
State of posting: ${payload.nyscState ?? ""}
PPA (Place of Primary Assignment): ${payload.ppa ?? ""}
Role at PPA: ${payload.ppaRole ?? ""}
CDS group: ${payload.cdsGroup ?? ""}
Career goal: ${payload.careerGoal ?? ""}

RULES
LOCAL VERSION (Nigerian employers):
- Use CGPA on a 5.0 scale
- Use Nigerian degree class (First Class, Second Class Upper, etc.)
- List NYSC as: "National Youth Service Corps | State | PPA | Role | Year"
- Show CDS group if relevant

INTERNATIONAL VERSION (global employers):
- Convert CGPA to 4.0 scale (divide by 5, multiply by 4)
- Use international honors equivalent (Summa Cum Laude, Magna Cum Laude, etc.)
- Translate NYSC as: "Mandatory National Service — Nigeria | Year" and explain PPA role as a professional title
- Do not use Nigerian-specific acronyms without explanation

Return ONLY valid JSON with this exact shape:
{
  "local_version": {
    "degree_line": "Full formatted degree line for Nigerian employers",
    "cgpa_line": "CGPA X.XX / 5.0 — Degree Class",
    "nysc_line": "NYSC formatted entry for local resume",
    "bullets": ["NYSC bullet 1", "NYSC bullet 2"]
  },
  "international_version": {
    "degree_line": "Full formatted degree line for international employers",
    "gpa_line": "GPA X.XX / 4.0 (equivalent) — International honors equivalent",
    "service_line": "Translated NYSC entry for international resume",
    "bullets": ["Service bullet 1 with context", "Service bullet 2"]
  },
  "tip": "One coaching note on when to use which version."
}`,
        responseFormat: "json",
        maxTokens: 1500,
      };

    // ─── Shareable Link Copy — AI-generated social share text ──────────────
    case "shareable_link":
      return {
        prompt: `You are a personal branding expert helping a Nigerian college student share their resume effectively on WhatsApp, LinkedIn, and email. Write compelling, authentic copy for each platform.

STUDENT PROFILE
Name: ${payload.fullName ?? ""}
Career goal / target role: ${payload.careerGoal ?? ""}
Top skills: ${payload.topSkills ?? ""}
Field of study: ${payload.fieldOfStudy ?? ""}
Availability status: ${payload.availabilityStatus ?? "open to work"}
Best achievement: ${payload.bestAchievement ?? ""}

RULES
1. Page headline: 6–8 words, punchy, includes their name and role. No buzzwords.
2. WhatsApp message: Casual, warm, direct. 2–3 sentences. Ends with call to action. Sounds like a real person, not a press release.
3. LinkedIn caption: Professional but personable. 3–5 sentences. Includes 2–3 relevant hashtags at the end.
4. Email signature: One clean line. Format: "[Name] | [Role] | [Field] | [Email if provided]". No emojis.
5. Availability badge: "Actively looking" | "Open to opportunities" | "Available from [Month]"
6. OG description: 1 sentence summarising the resume for link preview. Max 160 characters.

Return ONLY valid JSON with this exact shape:
{
  "page_headline": "6–8 word punchy headline",
  "whatsapp_message": "2–3 sentence WhatsApp share message",
  "linkedin_caption": "3–5 sentence LinkedIn post caption with hashtags",
  "email_signature": "One-line email signature",
  "availability_badge": "Actively looking | Open to opportunities | Available from Month",
  "og_description": "One sentence for link preview (max 160 chars)"
}`,
        responseFormat: "json",
        maxTokens: 1200,
      };

    case "master_assembler":
      return {
        prompt: `You are a senior resume editor and career strategist. You have received AI-processed outputs from multiple resume sections. Your job is to synthesize them into a single, coherent, and consistent final resume package.

SECTION OUTPUTS PROVIDED:
Summary options: ${JSON.stringify(payload.summaryOutput ?? {})}
Education entries: ${JSON.stringify(payload.educationOutput ?? [])}
Work experience bullets: ${JSON.stringify(payload.workOutput ?? [])}
Project bullets: ${JSON.stringify(payload.projectsOutput ?? [])}
Skills: ${JSON.stringify(payload.skillsOutput ?? {})}
Certifications: ${JSON.stringify(payload.certsOutput ?? {})}

CANDIDATE CONTEXT:
Career goal: ${payload.careerGoal ?? ""}
Has work experience: ${payload.hasExperience ?? false}
Target market: ${payload.targetMarket ?? "Nigeria"}

INSTRUCTIONS:
1. Choose the single best summary from the options provided (prefer the recommended one). Write it clean — no headers, no labels.
2. For work experience: ensure all bullets use strong action verbs and are consistent in tense and tone. Return bullets by entry ID.
3. For projects: ensure all bullets highlight technical impact and are consistent in style. Return bullets by entry ID.
4. For skills: merge and deduplicate technical, soft, and tools lists. Remove generic/weak skills. Prioritise role-relevant skills.
5. Identify any tone/terminology inconsistencies across sections and note the biggest one as consistency_tip.
6. Rate the overall ATS-friendliness of the assembled resume.

Return ONLY valid JSON with this exact shape:
{
  "recommended_summary": "The single best summary paragraph",
  "work_bullets": [{ "id": "work-entry-id", "bullets": ["• Action verb + result..."] }],
  "project_bullets": [{ "id": "project-entry-id", "bullets": ["• Action verb + impact..."] }],
  "skills": { "technical": ["skill1", "skill2"], "soft": ["skill1"], "tools": ["tool1"] },
  "consistency_tip": "One specific tip to unify tone, or null if everything is consistent",
  "ats_rating": "Excellent | Good | Fair | Poor"
}`,
        responseFormat: "json",
        maxTokens: 2000,
      };

    default:
      return { prompt: "", responseFormat: "text" };
  }
}

export function normalizeResult(
  action: string,
  raw: Record<string, unknown>
): Record<string, unknown> {
  if (action === "summary_v2") {
    const ss = raw?.summaries as Record<string, unknown> | undefined;
    const normalizeVersion = (v: unknown) => {
      if (typeof v === "object" && v !== null) {
        const obj = v as Record<string, unknown>;
        return { text: String(obj.text ?? ""), best_for: String(obj.best_for ?? "") };
      }
      return { text: "", best_for: "" };
    };
    return {
      summaries: {
        skills_led: normalizeVersion(ss?.skills_led),
        goal_led: normalizeVersion(ss?.goal_led),
        story_led: normalizeVersion(ss?.story_led),
      },
      recommended: typeof raw?.recommended === "string" ? raw.recommended : "skills_led",
      reason: typeof raw?.reason === "string" ? raw.reason : "",
      tip: typeof raw?.tip === "string" ? raw.tip : "",
    };
  }
  if (action === "education_v2") {
    const e = raw?.education_entry as Record<string, unknown> | undefined;
    return {
      education_entry: {
        degree_line: typeof e?.degree_line === "string" ? e.degree_line : "",
        institution: typeof e?.institution === "string" ? e.institution : "",
        duration: typeof e?.duration === "string" ? e.duration : "",
        gpa: e?.gpa !== undefined && e?.gpa !== null && e?.gpa !== "null" ? String(e.gpa) : null,
        honors: Array.isArray(e?.honors) ? (e.honors as unknown[]).map(String) : [],
        relevant_courses: Array.isArray(e?.relevant_courses) ? (e.relevant_courses as unknown[]).map(String) : [],
        achievements: Array.isArray(e?.achievements) ? (e.achievements as unknown[]).map(String) : [],
        extracurriculars: Array.isArray(e?.extracurriculars) ? (e.extracurriculars as unknown[]).map(String) : [],
      },
      tip: typeof raw?.tip === "string" ? raw.tip : "",
    };
  }
  if (action === "certifications_v2") {
    const normalizeCert = (c: unknown) => {
      if (typeof c !== "object" || c === null) return null;
      const obj = c as Record<string, unknown>;
      return {
        rank: Number(obj.rank) || 0,
        formatted_name: String(obj.formatted_name ?? ""),
        value_statement: String(obj.value_statement ?? ""),
        hidden_skills: Array.isArray(obj.hidden_skills) ? (obj.hidden_skills as unknown[]).map(String) : [],
        relevance: ["high", "medium", "low"].includes(String(obj.relevance)) ? String(obj.relevance) : "medium",
        include_on_resume: obj.include_on_resume !== false,
      };
    };
    const normalizeMissing = (c: unknown) => {
      if (typeof c !== "object" || c === null) return null;
      const obj = c as Record<string, unknown>;
      return {
        name: String(obj.name ?? ""),
        issuer: String(obj.issuer ?? ""),
        why: String(obj.why ?? ""),
        priority: ["high", "medium"].includes(String(obj.priority)) ? String(obj.priority) : "medium",
      };
    };
    return {
      certifications: (Array.isArray(raw?.certifications) ? raw.certifications : [])
        .map(normalizeCert)
        .filter(Boolean),
      missing_certifications: (Array.isArray(raw?.missing_certifications) ? raw.missing_certifications : [])
        .map(normalizeMissing)
        .filter(Boolean),
      tip: typeof raw?.tip === "string" ? raw.tip : "",
    };
  }
  if (action === "work_bullets") {
    return {
      bullets: Array.isArray(raw?.bullets) ? raw.bullets : [],
      action_verbs_used: Array.isArray(raw?.action_verbs_used) ? raw.action_verbs_used : [],
      tip: typeof raw?.tip === "string" ? raw.tip : "",
    };
  }
  if (action === "project_bullets") {
    return {
      project_name: typeof raw?.project_name === "string" ? raw.project_name : "",
      one_liner: typeof raw?.one_liner === "string" ? raw.one_liner : "",
      bullets: Array.isArray(raw?.bullets) ? raw.bullets : [],
      tech_keywords: Array.isArray(raw?.tech_keywords) ? raw.tech_keywords : [],
      tip: typeof raw?.tip === "string" ? raw.tip : "",
    };
  }
  if (action === "skills_v2") {
    const ss = raw?.suggested_skills as Record<string, unknown> | undefined;
    const normalizeSkillArr = (arr: unknown) =>
      Array.isArray(arr)
        ? arr.map((s: unknown) =>
            typeof s === "object" && s !== null && "name" in s
              ? { name: String((s as Record<string, unknown>).name), reason: String((s as Record<string, unknown>).reason ?? "") }
              : { name: String(s), reason: "" }
          )
        : [];
    return {
      suggested_skills: {
        technical: normalizeSkillArr(ss?.technical),
        soft: normalizeSkillArr(ss?.soft),
        tools: normalizeSkillArr(ss?.tools),
      },
      tip: typeof raw?.tip === "string" ? raw.tip : "",
    };
  }
  if (action === "skills") {
    if (Array.isArray(raw)) return { skills: raw };
    if (!("skills" in raw)) return { skills: [] };
    return raw;
  }
  if (action === "skills_grouped") {
    const s = raw?.skills as Record<string, unknown> | undefined;
    if (!s || (!Array.isArray(s.technical) && !Array.isArray(s.soft))) {
      return {
        skills: {
          technical: Array.isArray(raw?.technical) ? raw.technical : [],
          soft: Array.isArray(raw?.soft) ? raw.soft : [],
        },
      };
    }
    return raw;
  }
  if (action === "orchestrate") {
    const s = raw?.skills as Record<string, unknown> | undefined;
    return {
      summary: typeof raw?.summary === "string" ? raw.summary : "",
      workBullets: Array.isArray(raw?.workBullets) ? raw.workBullets : [],
      educationEntries: Array.isArray(raw?.educationEntries) ? raw.educationEntries : [],
      skills: {
        technical: Array.isArray(s?.technical) ? s!.technical : [],
        soft: Array.isArray(s?.soft) ? s!.soft : [],
      },
    };
  }
  if (action === "ats_optimize") {
    return {
      missingKeywords: Array.isArray(raw?.missingKeywords) ? raw.missingKeywords : [],
      suggestedImprovements: Array.isArray(raw?.suggestedImprovements) ? raw.suggestedImprovements : [],
      quantifiableSuggestions: Array.isArray(raw?.quantifiableSuggestions) ? raw.quantifiableSuggestions : [],
    };
  }
  if (action === "analyze") {
    return {
      score: Number(raw?.score) || 0,
      matchedKeywords: Array.isArray(raw?.matchedKeywords) ? raw.matchedKeywords : [],
      missedKeywords: Array.isArray(raw?.missedKeywords) ? raw.missedKeywords : [],
      suggestions: Array.isArray(raw?.suggestions) ? raw.suggestions : [],
    };
  }
  if (action === "resume_score") {
    const sects = raw?.sections as Record<string, unknown> | undefined;
    const normSect = (s: unknown) => {
      if (typeof s !== "object" || s === null) return { score: 0, max: 0, status: "weak", fix: "" };
      const o = s as Record<string, unknown>;
      return {
        score: Number(o.score) || 0,
        max: Number(o.max) || 0,
        status: String(o.status ?? "weak"),
        fix: String(o.fix ?? ""),
      };
    };
    const normFix = (f: unknown) => {
      if (typeof f !== "object" || f === null) return null;
      const o = f as Record<string, unknown>;
      return { priority: String(o.priority ?? "low"), section: String(o.section ?? ""), fix: String(o.fix ?? ""), score_impact: String(o.score_impact ?? "") };
    };
    return {
      total_score: Number(raw?.total_score) || 0,
      grade: String(raw?.grade ?? "F"),
      grade_message: String(raw?.grade_message ?? ""),
      sections: {
        summary: normSect(sects?.summary),
        experience: normSect(sects?.experience),
        projects: normSect(sects?.projects),
        skills: normSect(sects?.skills),
        education: normSect(sects?.education),
        certifications: normSect(sects?.certifications),
        ats: normSect(sects?.ats),
      },
      top_wins: Array.isArray(raw?.top_wins) ? (raw.top_wins as unknown[]).map(String) : [],
      top_fixes: Array.isArray(raw?.top_fixes) ? (raw.top_fixes as unknown[]).map(normFix).filter(Boolean) : [],
      ats_risks: Array.isArray(raw?.ats_risks) ? (raw.ats_risks as unknown[]).map(String) : [],
    };
  }
  if (action === "job_match") {
    const normMissing = (m: unknown) => {
      if (typeof m !== "object" || m === null) return null;
      const o = m as Record<string, unknown>;
      return { keyword: String(o.keyword ?? ""), importance: String(o.importance ?? "nice-to-have"), where_to_add: String(o.where_to_add ?? "") };
    };
    const normSectionFix = (f: unknown) => {
      if (typeof f !== "object" || f === null) return null;
      const o = f as Record<string, unknown>;
      return { section: String(o.section ?? ""), issue: String(o.issue ?? ""), fix: String(o.fix ?? "") };
    };
    const normTop3 = (f: unknown) => {
      if (typeof f !== "object" || f === null) return null;
      const o = f as Record<string, unknown>;
      return { rank: Number(o.rank) || 0, fix: String(o.fix ?? ""), score_gain: String(o.score_gain ?? "") };
    };
    return {
      match_score: Number(raw?.match_score) || 0,
      match_label: String(raw?.match_label ?? "Partial Match"),
      realistic_match: raw?.realistic_match !== false,
      verdict: String(raw?.verdict ?? ""),
      matched_keywords: Array.isArray(raw?.matched_keywords) ? (raw.matched_keywords as unknown[]).map(String) : [],
      missing_keywords: Array.isArray(raw?.missing_keywords) ? (raw.missing_keywords as unknown[]).map(normMissing).filter(Boolean) : [],
      section_fixes: Array.isArray(raw?.section_fixes) ? (raw.section_fixes as unknown[]).map(normSectionFix).filter(Boolean) : [],
      top_3_fixes: Array.isArray(raw?.top_3_fixes) ? (raw.top_3_fixes as unknown[]).map(normTop3).filter(Boolean) : [],
    };
  }
  if (action === "no_experience") {
    const normProject = (p: unknown) => {
      if (typeof p !== "object" || p === null) return null;
      const o = p as Record<string, unknown>;
      return {
        project_name: String(o.project_name ?? ""),
        role_title: String(o.role_title ?? ""),
        bullets: Array.isArray(o.bullets) ? (o.bullets as unknown[]).map(String) : [],
      };
    };
    const ts = raw?.tiered_skills as Record<string, unknown> | undefined;
    return {
      has_nothing_flag: raw?.has_nothing_flag === true,
      recommended_section_order: Array.isArray(raw?.recommended_section_order) ? (raw.recommended_section_order as unknown[]).map(String) : [],
      rewritten_summary: String(raw?.rewritten_summary ?? ""),
      projects_as_experience: Array.isArray(raw?.projects_as_experience) ? (raw.projects_as_experience as unknown[]).map(normProject).filter(Boolean) : [],
      tiered_skills: {
        primary: Array.isArray(ts?.primary) ? (ts.primary as unknown[]).map(String) : [],
        supporting: Array.isArray(ts?.supporting) ? (ts.supporting as unknown[]).map(String) : [],
        learning: Array.isArray(ts?.learning) ? (ts.learning as unknown[]).map(String) : [],
      },
      thirty_day_plan: Array.isArray(raw?.thirty_day_plan) ? (raw.thirty_day_plan as unknown[]).map(String) : [],
      tip: String(raw?.tip ?? ""),
    };
  }
  if (action === "nigeria_nysc") {
    const normVer = (v: unknown) => {
      if (typeof v !== "object" || v === null) return { degree_line: "", gpa_line: "", nysc_line: "", service_line: "", cgpa_line: "", bullets: [] };
      const o = v as Record<string, unknown>;
      return {
        degree_line: String(o.degree_line ?? ""),
        cgpa_line: String(o.cgpa_line ?? ""),
        gpa_line: String(o.gpa_line ?? ""),
        nysc_line: String(o.nysc_line ?? ""),
        service_line: String(o.service_line ?? ""),
        bullets: Array.isArray(o.bullets) ? (o.bullets as unknown[]).map(String) : [],
      };
    };
    return {
      local_version: normVer(raw?.local_version),
      international_version: normVer(raw?.international_version),
      tip: String(raw?.tip ?? ""),
    };
  }
  if (action === "shareable_link") {
    return {
      page_headline: String(raw?.page_headline ?? ""),
      whatsapp_message: String(raw?.whatsapp_message ?? ""),
      linkedin_caption: String(raw?.linkedin_caption ?? ""),
      email_signature: String(raw?.email_signature ?? ""),
      availability_badge: String(raw?.availability_badge ?? "Open to opportunities"),
      og_description: String(raw?.og_description ?? ""),
    };
  }
  if (action === "master_assembler") {
    const normBulletEntry = (e: unknown) => {
      if (typeof e !== "object" || e === null) return null;
      const o = e as Record<string, unknown>;
      return {
        id: String(o.id ?? ""),
        bullets: Array.isArray(o.bullets) ? (o.bullets as unknown[]).map(String) : [],
      };
    };
    const sk = raw?.skills as Record<string, unknown> | undefined;
    return {
      recommended_summary: String(raw?.recommended_summary ?? ""),
      work_bullets: Array.isArray(raw?.work_bullets) ? (raw.work_bullets as unknown[]).map(normBulletEntry).filter(Boolean) : [],
      project_bullets: Array.isArray(raw?.project_bullets) ? (raw.project_bullets as unknown[]).map(normBulletEntry).filter(Boolean) : [],
      skills: {
        technical: Array.isArray(sk?.technical) ? (sk!.technical as unknown[]).map(String) : [],
        soft: Array.isArray(sk?.soft) ? (sk!.soft as unknown[]).map(String) : [],
        tools: Array.isArray(sk?.tools) ? (sk!.tools as unknown[]).map(String) : [],
      },
      consistency_tip: raw?.consistency_tip ? String(raw.consistency_tip) : null,
      ats_rating: (["Excellent", "Good", "Fair", "Poor"].includes(String(raw?.ats_rating))
        ? String(raw.ats_rating)
        : "Fair") as "Excellent" | "Good" | "Fair" | "Poor",
    };
  }
  return raw;
}

export function emptyFallback(action: string): Record<string, unknown> {
  switch (action) {
    case "summary_v2":
      return {
        summaries: {
          skills_led: { text: "", best_for: "" },
          goal_led: { text: "", best_for: "" },
          story_led: { text: "", best_for: "" },
        },
        recommended: "skills_led",
        reason: "",
        tip: "",
      };
    case "education_v2":
      return {
        education_entry: {
          degree_line: "", institution: "", duration: "", gpa: null,
          honors: [], relevant_courses: [], achievements: [], extracurriculars: [],
        },
        tip: "",
      };
    case "certifications_v2":
      return { certifications: [], missing_certifications: [], tip: "" };
    case "work_bullets":
      return { bullets: [], action_verbs_used: [], tip: "" };
    case "project_bullets":
      return { project_name: "", one_liner: "", bullets: [], tech_keywords: [], tip: "" };
    case "skills_v2":
      return { suggested_skills: { technical: [], soft: [], tools: [] }, tip: "" };
    case "skills":
      return { skills: [] };
    case "skills_grouped":
      return { skills: { technical: [], soft: [] } };
    case "orchestrate":
      return { summary: "", workBullets: [], educationEntries: [], skills: { technical: [], soft: [] } };
    case "ats_optimize":
      return { missingKeywords: [], suggestedImprovements: [], quantifiableSuggestions: [] };
    case "analyze":
      return { score: 0, matchedKeywords: [], missedKeywords: [], suggestions: ["Failed to analyze resume. Please try again."] };
    case "resume_score":
      return {
        total_score: 0, grade: "F", grade_message: "",
        sections: {
          summary: { score: 0, max: 20, status: "weak", fix: "" },
          experience: { score: 0, max: 25, status: "weak", fix: "" },
          projects: { score: 0, max: 20, status: "weak", fix: "" },
          skills: { score: 0, max: 15, status: "weak", fix: "" },
          education: { score: 0, max: 10, status: "weak", fix: "" },
          certifications: { score: 0, max: 5, status: "weak", fix: "" },
          ats: { score: 0, max: 5, status: "weak", fix: "" },
        },
        top_wins: [], top_fixes: [], ats_risks: [],
      };
    case "job_match":
      return { match_score: 0, match_label: "Partial Match", realistic_match: true, verdict: "", matched_keywords: [], missing_keywords: [], section_fixes: [], top_3_fixes: [] };
    case "no_experience":
      return { has_nothing_flag: false, recommended_section_order: [], rewritten_summary: "", projects_as_experience: [], tiered_skills: { primary: [], supporting: [], learning: [] }, thirty_day_plan: [], tip: "" };
    case "nigeria_nysc":
      return {
        local_version: { degree_line: "", cgpa_line: "", nysc_line: "", bullets: [] },
        international_version: { degree_line: "", gpa_line: "", service_line: "", bullets: [] },
        tip: "",
      };
    case "shareable_link":
      return { page_headline: "", whatsapp_message: "", linkedin_caption: "", email_signature: "", availability_badge: "Open to opportunities", og_description: "" };
    case "master_assembler":
      return { recommended_summary: "", work_bullets: [], project_bullets: [], skills: { technical: [], soft: [], tools: [] }, consistency_tip: null, ats_rating: "Fair" };
    default:
      return { text: "" };
  }
}

export const VALID_ACTIONS = [
  "education",
  "education_v2",
  "work",
  "work_bullets",
  "project_bullets",
  "summary_v2",
  "certifications_v2",
  "skills_v2",
  "skills",
  "skills_grouped",
  "summary",
  "ats_optimize",
  "career_qa",
  "orchestrate",
  "analyze",
  "resume_score",
  "job_match",
  "no_experience",
  "nigeria_nysc",
  "shareable_link",
  "master_assembler",
] as const;
