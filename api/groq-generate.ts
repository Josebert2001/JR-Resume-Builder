import type { IncomingMessage, ServerResponse } from "node:http";
import { z } from "zod";
import { buildPrompt, normalizeResult, emptyFallback, VALID_ACTIONS } from "../server/groqPrompts.js";

type Req = IncomingMessage & { body?: Record<string, unknown> };
type Res = ServerResponse;

const isDev = process.env.NODE_ENV !== "production";

const requestSchema = z
  .object({
    action: z.string(),
    resumeText: z.string().max(50000).optional(),
    jobDescription: z.string().max(10000).optional(),
  })
  .passthrough();

function send(res: Res, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(body);
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");

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
    return send(res, 500, { error: "GROQ_API_KEY not configured" });
  }

  const parseResult = requestSchema.safeParse(req.body ?? {});
  if (!parseResult.success) {
    return send(res, 400, { error: "Invalid request payload" });
  }

  const { action, ...payload } = parseResult.data;

  if (!action || !(VALID_ACTIONS as readonly string[]).includes(action)) {
    return send(res, 400, { error: "Invalid action" });
  }

  const { prompt, responseFormat, maxTokens } = buildPrompt(action, payload);

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      if (isDev) console.error("Groq API error:", errText);
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
            parsed = JSON.parse(content.slice(start, end + 1)) as Record<string, unknown>;
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
    if (isDev) console.error("Error in groq-generate:", err);
    return send(res, 500, {
      error: "Failed to generate content",
      ...(isDev && { details: err instanceof Error ? err.message : String(err) }),
    });
  }
}
