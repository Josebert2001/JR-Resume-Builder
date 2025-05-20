import { Groq } from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true
});

export const generateEducationDescription = async (
  degree: string,
  fieldOfStudy: string,
  school: string
): Promise<string> => {
  const prompt = `Generate a concise, professional description for an education entry with:
Degree: ${degree}
Field of Study: ${fieldOfStudy}
School: ${school}

Focus on:
- Relevant coursework
- Key academic achievements
- Research or projects if applicable
- Skills developed

Keep it to 2-3 sentences maximum.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating education description:', error);
    return '';
  }
};

export const generateWorkDescription = async (
  position: string,
  company: string,
  industry?: string
): Promise<string> => {
  const prompt = `Generate a professional work experience description for:
Position: ${position}
Company: ${company}
${industry ? `Industry: ${industry}` : ''}

Include:
- Key responsibilities
- Notable achievements
- Impact on the organization
- Use action verbs and quantifiable results
- 3-4 bullet points

Format each point starting with "• " and separate with newlines.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 300,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating work description:', error);
    return '';
  }
};

export const suggestSkills = async (
  position: string,
  experience: string[]
): Promise<string[]> => {
  const prompt = `Suggest relevant professional skills for:
Position: ${position}
Experience: ${experience.join(', ')}

Include:
- Technical skills
- Soft skills
- Industry-specific skills
- Tools and technologies
- Certifications if applicable

Return only a JSON array of skills, nothing else.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 200,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    return JSON.parse(content);
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return [];
  }
};