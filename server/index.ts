import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(
  userId: string,
  action: string
): { limited: boolean; resetTime?: number } {
  const key = `${userId}:${action}`;
  const now = Date.now();
  const rules: Record<string, { maxRequests: number; windowMs: number }> = {
    ai_generation: { maxRequests: 20, windowMs: 60000 },
    resume_analysis: { maxRequests: 10, windowMs: 60000 },
  };

  const rule = rules[action];
  if (!rule) return { limited: false };

  const entry = rateLimitStore.get(key);

  if (!entry || now >= entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + rule.windowMs });
    return { limited: false };
  }

  if (entry.count >= rule.maxRequests) {
    return { limited: true, resetTime: entry.resetTime };
  }

  entry.count++;
  return { limited: false };
}

app.post("/api/groq-generate", async (req, res) => {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res
      .status(500)
      .json({ error: "GROQ_API_KEY not configured on server" });
  }

  const { action, ...payload } = req.body;
  const userId = req.headers["x-user-id"] as string || "anonymous";

  const rateLimitAction = [
    "education",
    "work",
    "skills",
    "skills_grouped",
    "summary",
    "orchestrate",
  ].includes(action)
    ? "ai_generation"
    : "resume_analysis";

  const rateLimitCheck = isRateLimited(userId, rateLimitAction);
  if (rateLimitCheck.limited) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      resetTime: rateLimitCheck.resetTime,
    });
  }

  let prompt = "";
  let responseFormat = "text";

  switch (action) {
    case "education":
      prompt = `You are an expert in professional resume writing.
Given:
- Degree: ${payload.degree}
- Field of Study: ${payload.fieldOfStudy ?? ""}
- Institution: ${payload.school ?? ""}
- Graduation Year: ${payload.graduationYear ?? ""}
- Relevant Coursework/Achievements: ${payload.coursework ?? ""}
Write a concise education entry in 1–2 lines that:
- Highlights honors, awards, or specializations if any.
- Includes relevant keywords for the target role.
Output only the final formatted line(s).`;
      break;

    case "work":
      prompt = `You are an ATS optimization specialist.
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
Output only the bullet points.`;
      break;

    case "skills":
      prompt = `You are an ATS and career consultant.
Given:
- Target Role: ${payload.position ?? payload.role ?? ""}
- Experience: ${JSON.stringify(payload.experience ?? [])}
- Current Skills: ${JSON.stringify(payload.currentSkills ?? [])}
Suggest 8–12 skills as a flat list. Return JSON with this exact shape:
{ "skills": ["Skill 1", "Skill 2", "..."] }
Only return valid JSON.`;
      responseFormat = "json";
      break;

    case "skills_grouped":
      prompt = `You are an ATS and career consultant.
Given:
- Target Role: ${payload.role ?? payload.position ?? ""}
- Experience: ${JSON.stringify(payload.experience ?? [])}
- Current Skills: ${JSON.stringify(payload.currentSkills ?? [])}
Suggest 8–12 skills grouped into:
- Technical Skills
- Soft Skills
Return JSON with this exact shape:
{ "skills": { "technical": ["..."], "soft": ["..."] } }
Only return valid JSON.`;
      responseFormat = "json";
      break;

    case "summary":
      prompt = `You are a professional career consultant and resume expert.
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
Output only the summary, no explanations.`;
      break;

    case "ats_optimize":
      prompt = `You are an ATS scanning system.
Compare the resume to the job description and return JSON only with this exact shape:
{
  "missingKeywords": ["..."],
  "suggestedImprovements": ["..."],
  "quantifiableSuggestions": ["..."]
}
RESUME:
${payload.resumeText}

JOB DESCRIPTION:
${payload.jobDescription}`;
      responseFormat = "json";
      break;

    case "career_qa":
      prompt = `You are a friendly, knowledgeable career coach.
User Question: ${payload.question}
Industry: ${payload.industry ?? ""}
Experience Level: ${payload.experienceLevel ?? ""}
Provide a clear, actionable answer with 2–4 practical tips, adapted to the user's industry and experience level.
Keep it concise and professional. Output only the answer.`;
      break;

    case "orchestrate":
      prompt = `You are an expert resume writer. Create coherent outputs for a resume based on the provided user data.
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
- Skills: balance role-relevant and industry keywords.`;
      responseFormat = "json";
      break;

    case "analyze":
      prompt = `Analyze this resume against the job description and provide feedback:

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

Score the resume compatibility, identify matched and missed keywords, and provide actionable improvement suggestions.`;
      responseFormat = "json";
      break;

    default:
      return res.status(400).json({ error: "Invalid action" });
  }

  try {
    const response = await fetch(
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

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return res.status(502).json({ error: `Groq API error: ${response.status}` });
    }

    const data = await response.json();
    let content: string = data.choices[0].message.content;
    const cleanedContent = content
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let result: any;
    if (responseFormat === "json") {
      try {
        result = JSON.parse(cleanedContent || content);

        if (action === "skills") {
          if (Array.isArray(result)) result = { skills: result };
          else if (!("skills" in result)) result = { skills: [] };
        }

        if (action === "skills_grouped") {
          if (
            !(
              result &&
              result.skills &&
              (Array.isArray(result.skills.technical) ||
                Array.isArray(result.skills.soft))
            )
          ) {
            result = {
              skills: {
                technical: Array.isArray(result?.technical)
                  ? result.technical
                  : [],
                soft: Array.isArray(result?.soft) ? result.soft : [],
              },
            };
          }
        }

        if (action === "orchestrate") {
          result = {
            summary:
              typeof result?.summary === "string" ? result.summary : "",
            workBullets: Array.isArray(result?.workBullets)
              ? result.workBullets
              : [],
            educationEntries: Array.isArray(result?.educationEntries)
              ? result.educationEntries
              : [],
            skills: {
              technical: Array.isArray(result?.skills?.technical)
                ? result.skills.technical
                : [],
              soft: Array.isArray(result?.skills?.soft)
                ? result.skills.soft
                : [],
            },
          };
        }

        if (action === "ats_optimize") {
          result = {
            missingKeywords: Array.isArray(result?.missingKeywords)
              ? result.missingKeywords
              : [],
            suggestedImprovements: Array.isArray(result?.suggestedImprovements)
              ? result.suggestedImprovements
              : [],
            quantifiableSuggestions: Array.isArray(
              result?.quantifiableSuggestions
            )
              ? result.quantifiableSuggestions
              : [],
          };
        }

        if (action === "analyze") {
          result = {
            score: Number(result?.score) || 0,
            matchedKeywords: Array.isArray(result?.matchedKeywords)
              ? result.matchedKeywords
              : [],
            missedKeywords: Array.isArray(result?.missedKeywords)
              ? result.missedKeywords
              : [],
            suggestions: Array.isArray(result?.suggestions)
              ? result.suggestions
              : [],
          };
        }
      } catch (e) {
        try {
          const start = content.indexOf("{");
          const end = content.lastIndexOf("}");
          if (start !== -1 && end !== -1 && end > start) {
            result = JSON.parse(content.slice(start, end + 1));
          } else {
            throw new Error("No JSON block found");
          }
        } catch {
          if (action === "skills") result = { skills: [] };
          else if (action === "skills_grouped")
            result = { skills: { technical: [], soft: [] } };
          else if (action === "orchestrate")
            result = {
              summary: "",
              workBullets: [],
              educationEntries: [],
              skills: { technical: [], soft: [] },
            };
          else if (action === "ats_optimize")
            result = {
              missingKeywords: [],
              suggestedImprovements: [],
              quantifiableSuggestions: [],
            };
          else if (action === "analyze")
            result = {
              score: 0,
              matchedKeywords: [],
              missedKeywords: [],
              suggestions: ["Failed to analyze resume. Please try again."],
            };
        }
      }
    } else {
      result = { text: content };
    }

    return res.json(result);
  } catch (error: any) {
    console.error("Error in groq-generate:", error);
    return res.status(500).json({
      error: "Failed to generate content",
      details: error.message,
    });
  }
});

// Serve static files from Vite build in production
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
