
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
        prompt = `Generate a professional education description for:
Degree: ${payload.degree}
Field of Study: ${payload.fieldOfStudy}
School: ${payload.school}

Write a concise, professional description (2-3 sentences) highlighting relevant coursework, achievements, or skills gained. Make it ATS-friendly and impactful.`;
        break;

      case 'work':
        prompt = `Generate a professional job description for:
Position: ${payload.position}
Company: ${payload.company}
${payload.industry ? `Industry: ${payload.industry}` : ''}

Write 3-4 bullet points describing typical responsibilities and achievements for this role. Use action verbs and quantifiable results where possible. Make it ATS-friendly.`;
        break;

      case 'skills':
        prompt = `Suggest 8-12 relevant skills for:
Position: ${payload.position}
Current Experience: ${JSON.stringify(payload.experience)}

Provide a list of technical and soft skills that would be valuable for this position. Include both hard skills (technologies, tools) and soft skills (communication, leadership). Return as a JSON array of strings.`;
        responseFormat = 'json';
        break;

      case 'analyze':
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
    const content = data.choices[0].message.content;

    console.log(`Generated content for ${action}:`, content);

    // Parse response based on format
    let result;
    if (responseFormat === 'json') {
      try {
        result = JSON.parse(content);
      } catch (e) {
        console.error('Failed to parse JSON response:', content);
        // Fallback for malformed JSON
        if (action === 'skills') {
          result = { skills: [] };
        } else if (action === 'analyze') {
          result = {
            score: 0,
            matchedKeywords: [],
            missedKeywords: [],
            suggestions: ['Failed to analyze resume. Please try again.']
          };
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
