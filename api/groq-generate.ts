import type { IncomingMessage, ServerResponse } from "node:http";
import { buildPrompt, normalizeResult, emptyFallback, VALID_ACTIONS } from "../server/groqPrompts.js";

type Req = IncomingMessage & { body?: Record<string, unknown> };
type Res = ServerResponse;

function send(res: Res, status: number, data: unknown) {
  const body = JSON.stringify(data);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(body);
}

export default async function handler(req: Req, res: Res) {
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
  const { action, ...payload } = body as { action: string; [key: string]: unknown };

  if (!action || !(VALID_ACTIONS as readonly string[]).includes(action)) {
    return send(res, 400, { error: "Invalid action" });
  }

  const { prompt, responseFormat } = buildPrompt(action, payload);

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
        max_tokens: 1000,
      }),
    });

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
    console.error("Error in groq-generate:", err);
    return send(res, 500, {
      error: "Failed to generate content",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
