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
] as const;
