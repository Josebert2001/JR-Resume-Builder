
import { LLMChain, SequentialChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { GroqLLM } from "../groqLLM";

const llm = new GroqLLM({
  temperature: 0.7,
  maxTokens: 1024
});

const jsonParser = new JsonOutputParser();

// Step 1: Content Analysis Chain
const contentAnalysisPrompt = PromptTemplate.fromTemplate(`
Analyze the following resume content for strengths and areas for improvement:

Resume Content:
{resumeContent}

Target Role: {targetRole}
Industry: {industry}

Analyze and return a JSON object with:
{{
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "missingElements": ["element1", "element2", ...],
  "industryAlignment": "high|medium|low",
  "overallScore": number (0-100)
}}
`);

export const contentAnalysisChain = new LLMChain({
  llm,
  prompt: contentAnalysisPrompt,
  outputKey: "analysis",
  outputParser: jsonParser
});

// Step 2: Improvement Suggestions Chain
const improvementPrompt = PromptTemplate.fromTemplate(`
Based on the analysis below, provide specific improvement recommendations:

Analysis Results:
{analysis}

Resume Content:
{resumeContent}

Target Role: {targetRole}

Provide detailed, actionable recommendations in JSON format:
{{
  "priorityActions": ["action1", "action2", ...],
  "contentSuggestions": {{
    "summary": "improved summary",
    "skills": ["skill1", "skill2", ...],
    "experiences": ["experience improvement 1", ...]
  }},
  "formattingTips": ["tip1", "tip2", ...],
  "keywordOptimization": ["keyword1", "keyword2", ...]
}}
`);

export const improvementChain = new LLMChain({
  llm,
  prompt: improvementPrompt,
  outputKey: "improvements",
  outputParser: jsonParser
});

// Step 3: ATS Optimization Chain
const atsOptimizationPrompt = PromptTemplate.fromTemplate(`
Optimize the resume for Applicant Tracking Systems (ATS):

Resume Content:
{resumeContent}

Job Description:
{jobDescription}

Provide ATS optimization suggestions:
{{
  "atsScore": number (0-100),
  "formatIssues": ["issue1", "issue2", ...],
  "keywordMatches": ["matched1", "matched2", ...],
  "missingKeywords": ["missing1", "missing2", ...],
  "optimizedSections": {{
    "skills": ["optimized skill 1", ...],
    "experience": ["optimized experience 1", ...]
  }},
  "recommendations": ["rec1", "rec2", ...]
}}
`);

export const atsOptimizationChain = new LLMChain({
  llm,
  prompt: atsOptimizationPrompt,
  outputKey: "atsOptimization",
  outputParser: jsonParser
});

// Sequential chain combining all analysis steps
export const comprehensiveResumeAnalysisChain = new SequentialChain({
  chains: [contentAnalysisChain, improvementChain, atsOptimizationChain],
  inputVariables: ["resumeContent", "targetRole", "industry", "jobDescription"],
  outputVariables: ["analysis", "improvements", "atsOptimization"],
  verbose: false
});

// Industry-specific optimization chain
const industryOptimizationPrompt = PromptTemplate.fromTemplate(`
Optimize this resume for the {industry} industry:

Resume Content:
{resumeContent}

Target Role: {targetRole}

Provide industry-specific optimization:
{{
  "industryKeywords": ["keyword1", "keyword2", ...],
  "preferredFormat": "description of preferred format",
  "essentialSkills": ["skill1", "skill2", ...],
  "industryTrends": ["trend1", "trend2", ...],
  "optimizedContent": {{
    "summary": "industry-optimized summary",
    "skills": ["industry-relevant skill 1", ...],
    "experience": ["industry-focused experience 1", ...]
  }},
  "additionalSections": ["section1", "section2", ...]
}}
`);

export const industryOptimizationChain = new LLMChain({
  llm,
  prompt: industryOptimizationPrompt,
  outputParser: jsonParser
});
