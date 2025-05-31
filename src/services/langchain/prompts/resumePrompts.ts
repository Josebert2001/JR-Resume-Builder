
import { PromptTemplate } from "@langchain/core/prompts";

export const resumeContentPrompt = PromptTemplate.fromTemplate(`
Create a professional resume summary and relevant skills list for:
Name: {name}
Education: {course} from {school}
Interests: {interests}

Generate:
1. A compelling career objective/professional summary (2-3 sentences) that:
   - Highlights educational background
   - Mentions career aspirations
   - Connects interests with professional goals
2. A list of 5-7 relevant technical and soft skills based on the course and interests

Return ONLY a JSON object with the following structure, nothing else:
{{
  "summary": "career objective here",
  "skills": ["skill1", "skill2", ...]
}}
`);

export const workDescriptionPrompt = PromptTemplate.fromTemplate(`
Generate a professional work experience description for:
Position: {position}
Company: {company}
{industry}

Include:
- Key responsibilities
- Notable achievements
- Impact on the organization
- Use action verbs and quantifiable results
- 3-4 bullet points

Format each point starting with "• " and separate with newlines.
`);

export const educationDescriptionPrompt = PromptTemplate.fromTemplate(`
Generate a concise, professional description for an education entry with:
Degree: {degree}
Field of Study: {fieldOfStudy}
School: {school}

Focus on:
- Relevant coursework
- Key academic achievements
- Research or projects if applicable
- Skills developed

Keep it to 2-3 sentences maximum.
`);

export const resumeAnalysisPrompt = PromptTemplate.fromTemplate(`
Analyze this resume against the following job description:

RESUME:
{resumeText}

JOB DESCRIPTION:
{jobDescription}

Provide a detailed analysis with the following components:
1. A match score as a percentage (0-100%) representing how well the resume matches the job requirements.
2. A list of keywords from the job description that are present in the resume.
3. A list of important keywords from the job description that are missing from the resume.
4. Specific suggestions for improving the resume to better match this job description.

Return the analysis as a JSON object with the following format:
{{
  "score": number,
  "matchedKeywords": string[],
  "missedKeywords": string[],
  "suggestions": string[]
}}

Be thorough but concise. The score should reflect the overall match quality.
`);

export const skillsSuggestionPrompt = PromptTemplate.fromTemplate(`
Suggest relevant professional skills for:
Position: {position}
Experience: {experience}

Include:
- Technical skills
- Soft skills
- Industry-specific skills
- Tools and technologies
- Certifications if applicable

Return only a JSON array of skills, nothing else.
`);
