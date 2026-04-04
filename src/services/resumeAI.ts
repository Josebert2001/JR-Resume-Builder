// Calls the local Express backend which proxies Groq API securely
async function invokeGroq(action: string, payload: Record<string, unknown>) {
  const response = await fetch("/api/groq-generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action, ...payload }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
    console.error(`Groq API error [${action}]`, error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const generateEducationDescription = async (
  degree: string,
  fieldOfStudy: string,
  school: string
): Promise<string> => {
  try {
    const result = await invokeGroq("education", { degree, fieldOfStudy, school });
    return (result?.text as string) || "";
  } catch (error) {
    console.error("Error generating education description:", error);
    return "";
  }
};

export const generateWorkDescription = async (
  position: string,
  company: string,
  industry?: string
): Promise<string> => {
  try {
    const result = await invokeGroq("work", { position, company, industry });
    return (result?.text as string) || "";
  } catch (error) {
    console.error("Error generating work description:", error);
    return "";
  }
};

// Rich work experience bullet generator (new)
export const generateWorkBullets = async (
  position: string,
  company: string,
  duration: string,
  rawDescription: string,
  fieldOfStudy: string,
  careerGoal: string
): Promise<{ bullets: string[]; tip: string }> => {
  try {
    const result = await invokeGroq("work_bullets", {
      position,
      company,
      duration,
      rawDescription,
      fieldOfStudy,
      careerGoal,
    });
    return {
      bullets: (result?.bullets as string[]) || [],
      tip: (result?.tip as string) || "",
    };
  } catch (error) {
    console.error("Error generating work bullets:", error);
    return { bullets: [], tip: "" };
  }
};

// Rich project description generator (new)
export const generateProjectBullets = async (
  projectName: string,
  techStack: string,
  rawDescription: string,
  motivation: string,
  fieldOfStudy: string,
  careerGoal: string
): Promise<{ oneLiner: string; bullets: string[]; tip: string }> => {
  try {
    const result = await invokeGroq("project_bullets", {
      projectName,
      techStack,
      rawDescription,
      motivation,
      fieldOfStudy,
      careerGoal,
    });
    return {
      oneLiner: (result?.one_liner as string) || "",
      bullets: (result?.bullets as string[]) || [],
      tip: (result?.tip as string) || "",
    };
  } catch (error) {
    console.error("Error generating project bullets:", error);
    return { oneLiner: "", bullets: [], tip: "" };
  }
};

export type SkillWithReason = { name: string; reason: string };

// Rich skills suggester with reasons per skill and tools category (new)
export const suggestSkillsWithReasons = async (
  fieldOfStudy: string,
  degree: string,
  careerGoal: string,
  workExperience: string,
  projects: string,
  certifications: string
): Promise<{
  technical: SkillWithReason[];
  soft: SkillWithReason[];
  tools: SkillWithReason[];
  tip: string;
}> => {
  try {
    const result = await invokeGroq("skills_v2", {
      fieldOfStudy,
      degree,
      careerGoal,
      workExperience,
      projects,
      certifications,
    });
    const ss = result?.suggested_skills as Record<string, unknown> | undefined;
    const toArr = (arr: unknown): SkillWithReason[] =>
      Array.isArray(arr)
        ? arr.map((s: unknown) =>
            typeof s === "object" && s !== null && "name" in s
              ? {
                  name: String((s as Record<string, unknown>).name),
                  reason: String((s as Record<string, unknown>).reason ?? ""),
                }
              : { name: String(s), reason: "" }
          )
        : [];
    return {
      technical: toArr(ss?.technical),
      soft: toArr(ss?.soft),
      tools: toArr(ss?.tools),
      tip: (result?.tip as string) || "",
    };
  } catch (error) {
    console.error("Error suggesting skills with reasons:", error);
    return { technical: [], soft: [], tools: [], tip: "" };
  }
};

export const suggestSkills = async (
  position: string,
  experience: string[]
): Promise<string[]> => {
  try {
    const result = await invokeGroq("skills", { position, experience });
    const skills = (result?.skills as string[]) || [];
    return Array.isArray(skills) ? skills : [];
  } catch (error) {
    console.error("Error suggesting skills:", error);
    return [];
  }
};

export const analyzeResume = async (
  resumeText: string,
  jobDescription: string
): Promise<{
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
  suggestions: string[];
}> => {
  try {
    const result = await invokeGroq("analyze", { resumeText, jobDescription });
    return {
      score: Number(result?.score) || 0,
      matchedKeywords: (result?.matchedKeywords as string[]) || [],
      missedKeywords: (result?.missedKeywords as string[]) || [],
      suggestions: (result?.suggestions as string[]) || [],
    };
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return { 
      score: 0, 
      matchedKeywords: [], 
      missedKeywords: [], 
      suggestions: ["Failed to complete AI analysis."] 
    };
  }
};

// Professional Summary
export const generateProfessionalSummary = async (
  role: string,
  industry: string,
  experience: string,
  skills: string[]
): Promise<string> => {
  try {
    const result = await invokeGroq("summary", { role, industry, experience, skills });
    return (result?.text as string) || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
};

// Grouped Skills (legacy — kept for backward compat)
export const suggestGroupedSkills = async (
  role: string,
  experience: string[],
  currentSkills: string[]
): Promise<{ technical: string[]; soft: string[] }> => {
  try {
    const result = await invokeGroq("skills_grouped", { role, experience, currentSkills });
    return {
      technical: (result?.skills?.technical as string[]) || [],
      soft: (result?.skills?.soft as string[]) || [],
    };
  } catch (error) {
    console.error("Error suggesting grouped skills:", error);
    return { technical: [], soft: [] };
  }
};

// ATS Optimization (detailed)
export const optimizeResumeATS = async (
  resumeText: string,
  jobDescription: string
): Promise<{
  missingKeywords: string[];
  suggestedImprovements: string[];
  quantifiableSuggestions: string[];
}> => {
  try {
    const result = await invokeGroq("ats_optimize", { resumeText, jobDescription });
    return {
      missingKeywords: (result?.missingKeywords as string[]) || [],
      suggestedImprovements: (result?.suggestedImprovements as string[]) || [],
      quantifiableSuggestions: (result?.quantifiableSuggestions as string[]) || [],
    };
  } catch (error) {
    console.error("Error optimizing resume:", error);
    return { missingKeywords: [], suggestedImprovements: [], quantifiableSuggestions: [] };
  }
};

// Career Assistant Q&A
export const careerAssistant = async (
  question: string,
  industry?: string,
  experienceLevel?: string
): Promise<string> => {
  try {
    const result = await invokeGroq("career_qa", { question, industry, experienceLevel });
    return (result?.text as string) || "";
  } catch (error) {
    console.error("Error with career assistant:", error);
    return "";
  }
};

// Orchestrate full resume pieces
export const orchestrateResume = async (
  payload: Record<string, unknown>
): Promise<{
  summary: string;
  workBullets: string[];
  educationEntries: string[];
  skills: { technical: string[]; soft: string[] };
}> => {
  try {
    const result = await invokeGroq("orchestrate", payload);
    return {
      summary: (result?.summary as string) || "",
      workBullets: (result?.workBullets as string[]) || [],
      educationEntries: (result?.educationEntries as string[]) || [],
      skills: {
        technical: (result?.skills?.technical as string[]) || [],
        soft: (result?.skills?.soft as string[]) || [],
      },
    };
  } catch (error) {
    console.error("Error orchestrating resume:", error);
    return { summary: "", workBullets: [], educationEntries: [], skills: { technical: [], soft: [] } };
  }
};
