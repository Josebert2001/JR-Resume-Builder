import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { buildPrompt, normalizeResult, emptyFallback, VALID_ACTIONS } from "./groqPrompts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== "production";

// Security headers (helmet-equivalent without adding a dependency)
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (!isDev) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5000", "http://localhost:3001"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin and server-to-server requests (no origin header)
      if (!origin) return callback(null, true);
      if (isDev || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json({ limit: "2mb" }));

const MAX_RATE_LIMIT_ENTRIES = 10000;
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Prune expired entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now >= entry.resetTime) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);

function isRateLimited(
  identifier: string,
  action: string
): { limited: boolean; resetTime?: number } {
  // Evict oldest entry when cap is reached to bound memory usage
  if (rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES) {
    const oldest = rateLimitStore.keys().next().value;
    if (oldest) rateLimitStore.delete(oldest);
  }

  const key = `${identifier}:${action}`;
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

const generateRequestSchema = z
  .object({
    action: z.string(),
    resumeText: z.string().max(50000).optional(),
    jobDescription: z.string().max(10000).optional(),
  })
  .passthrough();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/groq-generate", async (req, res) => {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    return res.status(500).json({ error: "GROQ_API_KEY not configured on server" });
  }

  const parseResult = generateRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  const { action, ...payload } = parseResult.data;

  if (!action || !(VALID_ACTIONS as readonly string[]).includes(action)) {
    return res.status(400).json({ error: "Invalid action" });
  }

  // Use IP address as rate limit identifier — not spoofable unlike x-user-id header
  const clientIp =
    (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
    req.socket.remoteAddress ||
    "unknown";

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

  const rateLimitCheck = isRateLimited(clientIp, rateLimitAction);
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
      const errorText = await response.text();
      if (isDev) console.error("Groq API error:", errorText);
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
    if (isDev) console.error("Error in groq-generate:", error);
    return res.status(500).json({
      error: "Failed to generate content",
      ...(isDev && { details: error instanceof Error ? error.message : String(error) }),
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
