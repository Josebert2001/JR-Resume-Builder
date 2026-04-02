import type { IncomingMessage, ServerResponse } from "node:http";

type Req = IncomingMessage & { body?: Record<string, unknown> };
type Res = ServerResponse;

function send(res: Res, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(body);
}

function buildPrompt(
  action: string,
  payload: Record<string, unknown>
): { prompt: string; responseFormat: "text" | "json" } {
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

function normalizeResult(
  action: string,
  raw: Record<string, unknown>
): Record<string, unknown> {
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
      educationEntries: Array.isArray(raw?.educationEntries)
        ? raw.educationEntries
        : [],
      skills: {
        technical: Array.isArray(s?.technical) ? s!.technical : [],
        soft: Array.isArray(s?.soft) ? s!.soft : [],
      },
    };
  }
  if (action === "ats_optimize") {
    return {
      missingKeywords: Array.isArray(raw?.missingKeywords)
        ? raw.missingKeywords
        : [],
      suggestedImprovements: Array.isArray(raw?.suggestedImprovements)
        ? raw.suggestedImprovements
        : [],
      quantifiableSuggestions: Array.isArray(raw?.quantifiableSuggestions)
        ? raw.quantifiableSuggestions
        : [],
    };
  }
  if (action === "analyze") {
    return {
      score: Number(raw?.score) || 0,
      matchedKeywords: Array.isArray(raw?.matchedKeywords)
        ? raw.matchedKeywords
        : [],
      missedKeywords: Array.isArray(raw?.missedKeywords)
        ? raw.missedKeywords
        : [],
      suggestions: Array.isArray(raw?.suggestions) ? raw.suggestions : [],
    };
  }
  return raw;
}

function emptyFallback(action: string): Record<string, unknown> {
  switch (action) {
    case "skills":
      return { skills: [] };
    case "skills_grouped":
      return { skills: { technical: [], soft: [] } };
    case "orchestrate":
      return {
        summary: "",
        workBullets: [],
        educationEntries: [],
        skills: { technical: [], soft: [] },
      };
    case "ats_optimize":
      return {
        missingKeywords: [],
        suggestedImprovements: [],
        quantifiableSuggestions: [],
      };
    case "analyze":
      return {
        score: 0,
        matchedKeywords: [],
        missedKeywords: [],
        suggestions: ["Failed to analyze resume. Please try again."],
      };
    default:
      return { text: "" };
  }
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-user-id");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    return send(res, 405, { error: "Method not allowed" });
  }

  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    return send(res, 500, { error: "GROQ_API_KEY not configured on server" });
  }

  const body = req.body ?? {};
  const { action, ...payload } = body as {
    action: string;
    [key: string]: unknown;
  };

  const VALID_ACTIONS = [
    "education",
    "work",
    "skills",
    "skills_grouped",
    "summary",
    "ats_optimize",
    "career_qa",
    "orchestrate",
    "analyze",
  ];
  if (!action || !VALID_ACTIONS.includes(action)) {
    return send(res, 400, { error: "Invalid action" });
  }

  const { prompt, responseFormat } = buildPrompt(action, payload);

  try {
    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a professional resume and career expert. Provide helpful, accurate, and ATS-friendly content.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      }
    );

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return send(res, 502, { error: `Groq API error: ${groqRes.status}` });
    }

    const data = (await groqRes.json()) as {
      choices: { message: { content: string } }[];
    };
    const content = data.choices[0].message.content;
    const cleaned = content
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    if (responseFormat === "json") {
      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(cleaned || content) as Record<string, unknown>;
      } catch {
        const start = content.indexOf("{");
        const end = content.lastIndexOf("}");
        if (start !== -1 && end > start) {
          try {
            parsed = JSON.parse(content.slice(start, end + 1)) as Record<
              string,
              unknown
            >;
          } catch {
            return send(res, 200, emptyFallback(action));
          }
        } else {
          return send(res, 200, emptyFallback(action));
        }
      }
      return send(res, 200, normalizeResult(action, parsed));
    }

    return send(res, 200, { text: content });
  } catch (err) {
    console.error("Error in groq-generate:", err);
    return send(res, 500, {
      error: "Failed to generate content",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
