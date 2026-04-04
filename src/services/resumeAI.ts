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

// ─── Summary V2 — 3 coached versions ────────────────────────────────────────

export type SummaryVersion = { text: string; best_for: string };

export type SummaryVariants = {
  summaries: {
    skills_led: SummaryVersion;
    goal_led: SummaryVersion;
    story_led: SummaryVersion;
  };
  recommended: "skills_led" | "goal_led" | "story_led";
  reason: string;
  tip: string;
};

export const generateSummaryV2 = async (
  fullName: string,
  fieldOfStudy: string,
  degree: string,
  academicLevel: string,
  careerGoal: string,
  topSkills: string,
  bestExperience: string,
  bestProject: string,
  certifications: string,
  personalityKeywords?: string
): Promise<SummaryVariants> => {
  const empty: SummaryVariants = {
    summaries: {
      skills_led: { text: "", best_for: "" },
      goal_led: { text: "", best_for: "" },
      story_led: { text: "", best_for: "" },
    },
    recommended: "skills_led",
    reason: "",
    tip: "",
  };
  try {
    const result = await invokeGroq("summary_v2", {
      fullName, fieldOfStudy, degree, academicLevel, careerGoal,
      topSkills, bestExperience, bestProject, certifications,
      personalityKeywords: personalityKeywords ?? "",
    });
    const ss = result?.summaries as Record<string, unknown> | undefined;
    const parseVersion = (v: unknown): SummaryVersion => {
      if (typeof v === "object" && v !== null) {
        const o = v as Record<string, unknown>;
        return { text: String(o.text ?? ""), best_for: String(o.best_for ?? "") };
      }
      return { text: "", best_for: "" };
    };
    return {
      summaries: {
        skills_led: parseVersion(ss?.skills_led),
        goal_led: parseVersion(ss?.goal_led),
        story_led: parseVersion(ss?.story_led),
      },
      recommended: (["skills_led", "goal_led", "story_led"].includes(String(result?.recommended))
        ? result.recommended
        : "skills_led") as SummaryVariants["recommended"],
      reason: String(result?.reason ?? ""),
      tip: String(result?.tip ?? ""),
    };
  } catch (error) {
    console.error("Error generating summary v2:", error);
    return empty;
  }
};

// ─── Education V2 — rich enhancement ────────────────────────────────────────

export type EnhancedEducationEntry = {
  degree_line: string;
  institution: string;
  duration: string;
  gpa: string | null;
  honors: string[];
  relevant_courses: string[];
  achievements: string[];
  extracurriculars: string[];
};

export const enhanceEducationEntry = async (
  institution: string,
  degreeType: string,
  fieldOfStudy: string,
  major: string,
  endYear: string,
  gpa: string,
  gpaScale: string,
  relevantCourses: string,
  achievements: string,
  careerGoal: string,
  minor?: string,
  startYear?: string,
  honors?: string,
  extracurriculars?: string
): Promise<{ entry: EnhancedEducationEntry; tip: string }> => {
  const empty = {
    entry: {
      degree_line: "", institution: "", duration: "", gpa: null,
      honors: [], relevant_courses: [], achievements: [], extracurriculars: [],
    },
    tip: "",
  };
  try {
    const result = await invokeGroq("education_v2", {
      institution, degreeType, fieldOfStudy, major,
      minor: minor ?? "", startYear: startYear ?? "", endYear,
      gpa, gpaScale, honors: honors ?? "", relevantCourses, achievements,
      extracurriculars: extracurriculars ?? "", careerGoal,
    });
    const e = result?.education_entry as Record<string, unknown> | undefined;
    if (!e) return empty;
    return {
      entry: {
        degree_line: String(e.degree_line ?? ""),
        institution: String(e.institution ?? ""),
        duration: String(e.duration ?? ""),
        gpa: e.gpa !== null && e.gpa !== undefined ? String(e.gpa) : null,
        honors: Array.isArray(e.honors) ? (e.honors as unknown[]).map(String) : [],
        relevant_courses: Array.isArray(e.relevant_courses) ? (e.relevant_courses as unknown[]).map(String) : [],
        achievements: Array.isArray(e.achievements) ? (e.achievements as unknown[]).map(String) : [],
        extracurriculars: Array.isArray(e.extracurriculars) ? (e.extracurriculars as unknown[]).map(String) : [],
      },
      tip: String(result?.tip ?? ""),
    };
  } catch (error) {
    console.error("Error enhancing education entry:", error);
    return empty;
  }
};

// ─── Certifications V2 — AI analysis with hidden skills ──────────────────────

export type AICertEntry = {
  rank: number;
  formatted_name: string;
  value_statement: string;
  hidden_skills: string[];
  relevance: "high" | "medium" | "low";
  include_on_resume: boolean;
};

export type MissingCert = {
  name: string;
  issuer: string;
  why: string;
  priority: "high" | "medium";
};

export type CertAnalysis = {
  certifications: AICertEntry[];
  missing_certifications: MissingCert[];
  tip: string;
};

export const analyzeCertifications = async (
  certificationsList: string,
  fieldOfStudy: string,
  careerGoal: string,
  existingSkills: string
): Promise<CertAnalysis> => {
  const empty: CertAnalysis = { certifications: [], missing_certifications: [], tip: "" };
  try {
    const result = await invokeGroq("certifications_v2", {
      certificationsList, fieldOfStudy, careerGoal, existingSkills,
    });
    const parseCert = (c: unknown): AICertEntry | null => {
      if (typeof c !== "object" || c === null) return null;
      const obj = c as Record<string, unknown>;
      return {
        rank: Number(obj.rank) || 0,
        formatted_name: String(obj.formatted_name ?? ""),
        value_statement: String(obj.value_statement ?? ""),
        hidden_skills: Array.isArray(obj.hidden_skills) ? (obj.hidden_skills as unknown[]).map(String) : [],
        relevance: (["high", "medium", "low"].includes(String(obj.relevance)) ? obj.relevance : "medium") as AICertEntry["relevance"],
        include_on_resume: obj.include_on_resume !== false,
      };
    };
    const parseMissing = (c: unknown): MissingCert | null => {
      if (typeof c !== "object" || c === null) return null;
      const obj = c as Record<string, unknown>;
      return {
        name: String(obj.name ?? ""),
        issuer: String(obj.issuer ?? ""),
        why: String(obj.why ?? ""),
        priority: (["high", "medium"].includes(String(obj.priority)) ? obj.priority : "medium") as MissingCert["priority"],
      };
    };
    return {
      certifications: (Array.isArray(result?.certifications) ? result.certifications : [])
        .map(parseCert).filter((c): c is AICertEntry => c !== null),
      missing_certifications: (Array.isArray(result?.missing_certifications) ? result.missing_certifications : [])
        .map(parseMissing).filter((c): c is MissingCert => c !== null),
      tip: String(result?.tip ?? ""),
    };
  } catch (error) {
    console.error("Error analyzing certifications:", error);
    return empty;
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
