export type ResponseFormat = "text" | "json";

export function buildPrompt(
  action: string,
  payload: Record<string, unknown>
): { prompt: string; responseFormat: ResponseFormat } {
  switch (action) {
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
  "work",
  "work_bullets",
  "project_bullets",
  "skills_v2",
  "skills",
  "skills_grouped",
  "summary",
  "ats_optimize",
  "career_qa",
  "orchestrate",
  "analyze",
] as const;
