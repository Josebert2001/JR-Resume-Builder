import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { buildPrompt, normalizeResult, emptyFallback, VALID_ACTIONS } from "./groqPrompts.js";

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/groq-generate", async (req, res) => {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured on server" });
  }

  const { action, ...payload } = req.body;
  const userId = (req.headers["x-user-id"] as string) || "anonymous";

  if (!action || !(VALID_ACTIONS as readonly string[]).includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

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

  const { prompt, responseFormat, maxTokens } = buildPrompt(action, payload);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
        max_tokens: maxTokens ?? 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return res.status(502).json({ error: `Groq API error: ${response.status}` });
    }

    const data = await response.json();
    const content: string = data.choices[0].message.content;
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
            parsed = JSON.parse(content.slice(start, end + 1)) as Record<string, unknown>;
          } catch {
            return res.json(emptyFallback(action));
          }
        } else {
          return res.json(emptyFallback(action));
        }
      }
      return res.json(normalizeResult(action, parsed));
    }

    return res.json({ text: content });
  } catch (error: unknown) {
    console.error("Error in groq-generate:", error);
    return res.status(500).json({
      error: "Failed to generate content",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
