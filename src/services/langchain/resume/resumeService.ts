
import { createGroqChat, safeJsonParse } from '../core/llmCore';

export interface GenerationRequest {
  name: string;
  email: string;
  phone: string;
  course: string;
  school: string;
  interests: string;
}

export interface GenerationResponse {
  summary: string;
  skills: string[];
}

export interface ResponsibilityGenerationRequest {
  position: string;
  company: string;
  industry?: string;
}

export const generateResumeContent = async (data: GenerationRequest): Promise<GenerationResponse> => {
  try {
    const chat = createGroqChat();
    
    if (!data.course || !data.school || !data.interests) {
      throw new Error('Missing required fields for resume content generation');
    }

    const prompt = `Create a professional resume summary and relevant skills list for:
Name: ${data.name}
Education: ${data.course} from ${data.school}
Interests: ${data.interests}

Generate:
1. A compelling career objective/professional summary (2-3 sentences)
2. A list of 5-7 relevant technical and soft skills

Return ONLY a JSON object with the following structure:
{
  "summary": "career objective here",
  "skills": ["skill1", "skill2", ...]
}`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "You are a professional resume writer. Return ONLY properly formatted JSON with a summary and skills array."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);

    const defaultResponse: GenerationResponse = {
      summary: "Recent graduate seeking opportunities to apply academic knowledge and develop professional skills.",
      skills: ["Communication", "Problem Solving", "Teamwork", "Time Management", "Adaptability"]
    };

    const parsed = safeJsonParse<GenerationResponse>(response.content as string, defaultResponse);

    return {
      summary: parsed.summary || defaultResponse.summary,
      skills: Array.isArray(parsed.skills) ? parsed.skills : defaultResponse.skills
    };
  } catch (error) {
    console.error('Resume content generation error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate resume content');
  }
};

export const generateJobResponsibilities = async (data: ResponsibilityGenerationRequest): Promise<string> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Generate 4-5 detailed bullet points describing key responsibilities for a ${data.position} role at ${data.company}${data.industry ? ` in the ${data.industry} industry` : ''}.
    Focus on specific, measurable achievements and key responsibilities.
    Format each bullet point starting with "• " and separate with newlines.`;

    const response = await chat.invoke([
      { role: "user", content: prompt }
    ]);

    return response.content as string || "Failed to generate responsibilities";
  } catch (error) {
    console.error('Error generating job responsibilities:', error);
    throw new Error('Failed to generate job responsibilities');
  }
};

export const generateEducationDescription = async (degree: string, fieldOfStudy: string, school: string): Promise<string> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Generate a concise, professional description for an education entry with:
Degree: ${degree}
Field of Study: ${fieldOfStudy}
School: ${school}

Focus on:
- Relevant coursework
- Key academic achievements
- Research or projects if applicable
- Skills developed

Keep it to 2-3 sentences maximum. Return only the description text.`;

    const response = await chat.invoke([
      { role: "user", content: prompt }
    ]);

    return response.content as string || '';
  } catch (error) {
    console.error('Error generating education description:', error);
    throw new Error('Failed to generate education description');
  }
};

export const suggestSkills = async (position: string, experience: string[]): Promise<string[]> => {
  try {
    const chat = createGroqChat();
    
    const prompt = `Suggest relevant professional skills for:
Position: ${position}
Experience: ${experience.join(', ')}

Include:
- Technical skills
- Soft skills
- Industry-specific skills
- Tools and technologies
- Certifications if applicable

Return only a JSON array of skills, nothing else.
Example: ["skill1", "skill2", "skill3", "skill4", "skill5"]`;

    const response = await chat.invoke([
      { 
        role: "system", 
        content: "Return ONLY a JSON array of skills. No additional text or explanations."
      },
      { 
        role: "user", 
        content: prompt 
      }
    ]);

    const content = response.content as string || '[]';
    const defaultSkills = ["Communication", "Problem Solving", "Teamwork", "Leadership", "Technical Skills"];
    
    try {
      const parsed = safeJsonParse<string[]>(content, defaultSkills);
      return Array.isArray(parsed) ? parsed : defaultSkills;
    } catch (error) {
      console.error('Error parsing skills:', error);
      return defaultSkills;
    }
  } catch (error) {
    console.error('Error suggesting skills:', error);
    throw new Error('Failed to suggest skills');
  }
};
