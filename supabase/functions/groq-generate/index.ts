
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const groqApiKey = Deno.env.get('GROQ_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!groqApiKey) {
    console.error('GROQ_API_KEY not found');
    return new Response(
      JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { action, ...payload } = await req.json();
    console.log(`Processing action: ${action}`, payload);

    let prompt = '';
    let responseFormat = 'text';

    switch (action) {
      case 'education':
        prompt = `You are an expert in professional resume writing.
Given:
- Degree: ${payload.degree}
- Field of Study: ${payload.fieldOfStudy ?? ''}
- Institution: ${payload.school ?? ''}
- Graduation Year: ${payload.graduationYear ?? ''}
- Relevant Coursework/Achievements: ${payload.coursework ?? ''}
Write a concise education entry in 1–2 lines that:
- Highlights honors, awards, or specializations if any.
- Includes relevant keywords for the target role.
Output only the final formatted line(s).`;
        break;

      case 'work':
        prompt = `You are an ATS optimization specialist.
Given:
- Job Title: ${payload.position}
- Company: ${payload.company}
- Employment Dates: ${payload.dates ?? ''}
- Responsibilities/Notes: ${payload.responsibilities ?? ''}
Rewrite into 3–5 concise, achievement-based bullet points that:
- Start with strong action verbs.
- Include measurable results or impacts where possible.
- Naturally include relevant industry keywords.
- Avoid personal pronouns.
Output only the bullet points.`;
        break;

      case 'skills':
        prompt = `You are an ATS and career consultant.
Given:
- Target Role: ${payload.position ?? payload.role ?? ''}
- Experience: ${JSON.stringify(payload.experience ?? [])}
- Current Skills: ${JSON.stringify(payload.currentSkills ?? [])}
Suggest 8–12 skills as a flat list. Return JSON with this exact shape:
{ "skills": ["Skill 1", "Skill 2", "..."] }
Only return valid JSON.`;
        responseFormat = 'json';
        break;

      case 'skills_grouped':
        prompt = `You are an ATS and career consultant.
Given:
- Target Role: ${payload.role ?? payload.position ?? ''}
- Experience: ${JSON.stringify(payload.experience ?? [])}
- Current Skills: ${JSON.stringify(payload.currentSkills ?? [])}
Suggest 8–12 skills grouped into:
- Technical Skills
- Soft Skills
Return JSON with this exact shape:
{ "skills": { "technical": ["..."], "soft": ["..."] } }
Only return valid JSON.`;
        responseFormat = 'json';
        break;

      case 'summary':
        prompt = `You are a professional career consultant and resume expert.
Given:
- Target Role: ${payload.role ?? ''}
- Industry: ${payload.industry ?? ''}
- Experience Summary: ${payload.experience ?? ''}
- Key Skills: ${JSON.stringify(payload.skills ?? [])}
Write a professional summary in 3–4 sentences that:
- Uses an active, confident tone.
- Includes relevant keywords for the target role.
- Highlights unique strengths and achievements.
- Avoids clichés like "hardworking" or "team player".
Output only the summary, no explanations.`;
        break;

      case 'ats_optimize':
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
        responseFormat = 'json';
        break;

      case 'career_qa':
        prompt = `You are a friendly, knowledgeable career coach.
User Question: ${payload.question}
Industry: ${payload.industry ?? ''}
Experience Level: ${payload.experienceLevel ?? ''}
Provide a clear, actionable answer with 2–4 practical tips, adapted to the user's industry and experience level.
Keep it concise and professional. Output only the answer.`;
        break;

      case 'orchestrate':
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
        responseFormat = 'json';
        break;

      case 'analyze':
        // Keep existing analyze behavior for compatibility
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
        responseFormat = 'json';
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume and career expert. Provide helpful, accurate, and ATS-friendly content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Groq API error:', error);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content as string;
    const cleanedContent = (typeof content === 'string'
      ? content.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
      : '');

    console.log(`Generated content for ${action}:`, content);

    // Parse response based on format
    let result: any;
    if (responseFormat === 'json') {
      try {
        result = JSON.parse(cleanedContent || content);

        // Normalize shapes for compatibility
        if (action === 'skills') {
          if (Array.isArray(result)) {
            result = { skills: result };
          } else if (!('skills' in result)) {
            result = { skills: [] };
          }
        }

        if (action === 'skills_grouped') {
          if (!(result && result.skills && (Array.isArray(result.skills.technical) || Array.isArray(result.skills.soft)))) {
            const technical = result?.technical ?? [];
            const soft = result?.soft ?? [];
            result = {
              skills: {
                technical: Array.isArray(technical) ? technical : [],
                soft: Array.isArray(soft) ? soft : [],
              }
            };
          }
        }

        if (action === 'orchestrate') {
          result = {
            summary: typeof result?.summary === 'string' ? result.summary : '',
            workBullets: Array.isArray(result?.workBullets) ? result.workBullets : [],
            educationEntries: Array.isArray(result?.educationEntries) ? result.educationEntries : [],
            skills: {
              technical: Array.isArray(result?.skills?.technical) ? result.skills.technical : [],
              soft: Array.isArray(result?.skills?.soft) ? result.skills.soft : [],
            }
          };
        }

        if (action === 'ats_optimize') {
          result = {
            missingKeywords: Array.isArray(result?.missingKeywords) ? result.missingKeywords : [],
            suggestedImprovements: Array.isArray(result?.suggestedImprovements) ? result.suggestedImprovements : [],
            quantifiableSuggestions: Array.isArray(result?.quantifiableSuggestions) ? result.quantifiableSuggestions : [],
          };
        }

        if (action === 'analyze') {
          result = {
            score: Number(result?.score) || 0,
            matchedKeywords: Array.isArray(result?.matchedKeywords) ? result.matchedKeywords : [],
            missedKeywords: Array.isArray(result?.missedKeywords) ? result.missedKeywords : [],
            suggestions: Array.isArray(result?.suggestions) ? result.suggestions : [],
          };
        }
      } catch (e) {
        console.error('Failed to parse JSON response:', content);
        // Try to extract JSON object from within code fences or text
        try {
          const start = content.indexOf('{');
          const end = content.lastIndexOf('}');
          if (start !== -1 && end !== -1 && end > start) {
            const extracted = content.slice(start, end + 1);
            result = JSON.parse(extracted);
          } else {
            throw new Error('No JSON block found');
          }
        } catch (_e2) {
          // Fallback for malformed JSON
          if (action === 'skills') {
            result = { skills: [] };
          } else if (action === 'skills_grouped') {
            result = { skills: { technical: [], soft: [] } };
          } else if (action === 'orchestrate') {
            result = { summary: '', workBullets: [], educationEntries: [], skills: { technical: [], soft: [] } };
          } else if (action === 'ats_optimize') {
            result = { missingKeywords: [], suggestedImprovements: [], quantifiableSuggestions: [] };
          } else if (action === 'analyze') {
            result = {
              score: 0,
              matchedKeywords: [],
              missedKeywords: [],
              suggestions: ['Failed to analyze resume. Please try again.']
            };
          }
        }
      }
    } else {
      result = { text: content };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in groq-generate function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate content',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
