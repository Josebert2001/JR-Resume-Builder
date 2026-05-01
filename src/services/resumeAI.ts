async function invokeGroq(action: string, payload: Record<string, unknown>) {
  const response = await fetch("/api/groq-generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }));
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

// ─── Resume Score — section-by-section with grade A–F ────────────────────────

export type SectionScore = { score: number; max: number; status: string; fix: string };
export type TopFix = { priority: string; section: string; fix: string; score_impact: string };
export type ResumeScoreResult = {
  total_score: number;
  grade: string;
  grade_message: string;
  sections: {
    summary: SectionScore;
    experience: SectionScore;
    projects: SectionScore;
    skills: SectionScore;
    education: SectionScore;
    certifications: SectionScore;
    ats: SectionScore;
  };
  top_wins: string[];
  top_fixes: TopFix[];
  ats_risks: string[];
};

export const scoreResume = async (payload: {
  fullName: string;
  summary: string;
  education: string;
  workExperience: string;
  skills: string;
  projects: string;
  certifications: string;
}): Promise<ResumeScoreResult> => {
  const emptySect = (max: number): SectionScore => ({ score: 0, max, status: "weak", fix: "" });
  const empty: ResumeScoreResult = {
    total_score: 0, grade: "F", grade_message: "",
    sections: {
      summary: emptySect(20), experience: emptySect(25), projects: emptySect(20),
      skills: emptySect(15), education: emptySect(10), certifications: emptySect(5), ats: emptySect(5),
    },
    top_wins: [], top_fixes: [], ats_risks: [],
  };
  try {
    const result = await invokeGroq("resume_score", payload as unknown as Record<string, unknown>);
    const sects = result?.sections as Record<string, unknown> | undefined;
    const normSect = (s: unknown, max: number): SectionScore => {
      if (typeof s !== "object" || s === null) return emptySect(max);
      const o = s as Record<string, unknown>;
      return { score: Number(o.score) || 0, max: Number(o.max) || max, status: String(o.status ?? "weak"), fix: String(o.fix ?? "") };
    };
    const normFix = (f: unknown): TopFix | null => {
      if (typeof f !== "object" || f === null) return null;
      const o = f as Record<string, unknown>;
      return { priority: String(o.priority ?? "low"), section: String(o.section ?? ""), fix: String(o.fix ?? ""), score_impact: String(o.score_impact ?? "") };
    };
    return {
      total_score: Number(result?.total_score) || 0,
      grade: String(result?.grade ?? "F"),
      grade_message: String(result?.grade_message ?? ""),
      sections: {
        summary: normSect(sects?.summary, 20),
        experience: normSect(sects?.experience, 25),
        projects: normSect(sects?.projects, 20),
        skills: normSect(sects?.skills, 15),
        education: normSect(sects?.education, 10),
        certifications: normSect(sects?.certifications, 5),
        ats: normSect(sects?.ats, 5),
      },
      top_wins: Array.isArray(result?.top_wins) ? (result.top_wins as string[]) : [],
      top_fixes: Array.isArray(result?.top_fixes) ? (result.top_fixes as unknown[]).map(normFix).filter((f): f is TopFix => f !== null) : [],
      ats_risks: Array.isArray(result?.ats_risks) ? (result.ats_risks as string[]) : [],
    };
  } catch (error) {
    console.error("Error scoring resume:", error);
    return empty;
  }
};

// ─── Job Match — with section-level fixes and top 3 impactful changes ─────────

export type MissingKeyword = { keyword: string; importance: string; where_to_add: string };
export type SectionFix = { section: string; issue: string; fix: string };
export type Top3Fix = { rank: number; fix: string; score_gain: string };
export type JobMatchResult = {
  match_score: number;
  match_label: string;
  realistic_match: boolean;
  verdict: string;
  matched_keywords: string[];
  missing_keywords: MissingKeyword[];
  section_fixes: SectionFix[];
  top_3_fixes: Top3Fix[];
};

export const matchJobDescription = async (
  resumeText: string,
  jobTitle: string,
  company: string,
  jobDescription: string
): Promise<JobMatchResult> => {
  const empty: JobMatchResult = {
    match_score: 0, match_label: "Partial Match", realistic_match: true, verdict: "",
    matched_keywords: [], missing_keywords: [], section_fixes: [], top_3_fixes: [],
  };
  try {
    const result = await invokeGroq("job_match", { resumeText, jobTitle, company, jobDescription });
    const normMissing = (m: unknown): MissingKeyword | null => {
      if (typeof m !== "object" || m === null) return null;
      const o = m as Record<string, unknown>;
      return { keyword: String(o.keyword ?? ""), importance: String(o.importance ?? ""), where_to_add: String(o.where_to_add ?? "") };
    };
    const normSectionFix = (f: unknown): SectionFix | null => {
      if (typeof f !== "object" || f === null) return null;
      const o = f as Record<string, unknown>;
      return { section: String(o.section ?? ""), issue: String(o.issue ?? ""), fix: String(o.fix ?? "") };
    };
    const normTop3 = (f: unknown): Top3Fix | null => {
      if (typeof f !== "object" || f === null) return null;
      const o = f as Record<string, unknown>;
      return { rank: Number(o.rank) || 0, fix: String(o.fix ?? ""), score_gain: String(o.score_gain ?? "") };
    };
    return {
      match_score: Number(result?.match_score) || 0,
      match_label: String(result?.match_label ?? "Partial Match"),
      realistic_match: result?.realistic_match !== false,
      verdict: String(result?.verdict ?? ""),
      matched_keywords: Array.isArray(result?.matched_keywords) ? (result.matched_keywords as string[]) : [],
      missing_keywords: Array.isArray(result?.missing_keywords)
        ? (result.missing_keywords as unknown[]).map(normMissing).filter((m): m is MissingKeyword => m !== null)
        : [],
      section_fixes: Array.isArray(result?.section_fixes)
        ? (result.section_fixes as unknown[]).map(normSectionFix).filter((f): f is SectionFix => f !== null)
        : [],
      top_3_fixes: Array.isArray(result?.top_3_fixes)
        ? (result.top_3_fixes as unknown[]).map(normTop3).filter((f): f is Top3Fix => f !== null)
        : [],
    };
  } catch (error) {
    console.error("Error matching job description:", error);
    return empty;
  }
};

// ─── No Experience Mode — reframe profile for zero-experience students ─────────

export type ProjectAsExperience = { project_name: string; role_title: string; bullets: string[] };
export type TieredSkills = { primary: string[]; supporting: string[]; learning: string[] };
export type NoExperienceResult = {
  has_nothing_flag: boolean;
  recommended_section_order: string[];
  rewritten_summary: string;
  projects_as_experience: ProjectAsExperience[];
  tiered_skills: TieredSkills;
  thirty_day_plan: string[];
  tip: string;
};

export const buildNoExperienceResume = async (payload: {
  fullName: string;
  fieldOfStudy: string;
  careerGoal: string;
  education: string;
  projects: string;
  skills: string;
  certifications: string;
  hasVolunteer: string;
}): Promise<NoExperienceResult> => {
  const empty: NoExperienceResult = {
    has_nothing_flag: false, recommended_section_order: [], rewritten_summary: "",
    projects_as_experience: [], tiered_skills: { primary: [], supporting: [], learning: [] },
    thirty_day_plan: [], tip: "",
  };
  try {
    const result = await invokeGroq("no_experience", payload as unknown as Record<string, unknown>);
    const normProject = (p: unknown): ProjectAsExperience | null => {
      if (typeof p !== "object" || p === null) return null;
      const o = p as Record<string, unknown>;
      return {
        project_name: String(o.project_name ?? ""),
        role_title: String(o.role_title ?? ""),
        bullets: Array.isArray(o.bullets) ? (o.bullets as unknown[]).map(String) : [],
      };
    };
    const ts = result?.tiered_skills as Record<string, unknown> | undefined;
    return {
      has_nothing_flag: result?.has_nothing_flag === true,
      recommended_section_order: Array.isArray(result?.recommended_section_order) ? (result.recommended_section_order as string[]) : [],
      rewritten_summary: String(result?.rewritten_summary ?? ""),
      projects_as_experience: Array.isArray(result?.projects_as_experience)
        ? (result.projects_as_experience as unknown[]).map(normProject).filter((p): p is ProjectAsExperience => p !== null)
        : [],
      tiered_skills: {
        primary: Array.isArray(ts?.primary) ? (ts.primary as unknown[]).map(String) : [],
        supporting: Array.isArray(ts?.supporting) ? (ts.supporting as unknown[]).map(String) : [],
        learning: Array.isArray(ts?.learning) ? (ts.learning as unknown[]).map(String) : [],
      },
      thirty_day_plan: Array.isArray(result?.thirty_day_plan) ? (result.thirty_day_plan as string[]) : [],
      tip: String(result?.tip ?? ""),
    };
  } catch (error) {
    console.error("Error building no-experience resume:", error);
    return empty;
  }
};

// ─── Nigerian NYSC — dual format for local + international employers ───────────

export type NyscVersion = { degree_line: string; cgpa_line?: string; gpa_line?: string; nysc_line?: string; service_line?: string; bullets: string[] };
export type NigerianNyscResult = {
  local_version: NyscVersion;
  international_version: NyscVersion;
  tip: string;
};

export const formatNigerianEducation = async (payload: {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
  cgpa: string;
  cgpaScale: string;
  degreeClass: string;
  honors: string;
  nyscStatus: string;
  nyscState: string;
  ppa: string;
  ppaRole: string;
  cdsGroup: string;
  careerGoal: string;
}): Promise<NigerianNyscResult> => {
  const emptyVer: NyscVersion = { degree_line: "", cgpa_line: "", bullets: [] };
  const empty: NigerianNyscResult = { local_version: emptyVer, international_version: emptyVer, tip: "" };
  try {
    const result = await invokeGroq("nigeria_nysc", payload as unknown as Record<string, unknown>);
    const normVer = (v: unknown): NyscVersion => {
      if (typeof v !== "object" || v === null) return emptyVer;
      const o = v as Record<string, unknown>;
      return {
        degree_line: String(o.degree_line ?? ""),
        cgpa_line: String(o.cgpa_line ?? ""),
        gpa_line: String(o.gpa_line ?? ""),
        nysc_line: String(o.nysc_line ?? ""),
        service_line: String(o.service_line ?? ""),
        bullets: Array.isArray(o.bullets) ? (o.bullets as unknown[]).map(String) : [],
      };
    };
    return {
      local_version: normVer(result?.local_version),
      international_version: normVer(result?.international_version),
      tip: String(result?.tip ?? ""),
    };
  } catch (error) {
    console.error("Error formatting Nigerian education:", error);
    return empty;
  }
};

// ─── Shareable Link Copy — AI-generated social share text ─────────────────────

export type ShareableCopyResult = {
  page_headline: string;
  whatsapp_message: string;
  linkedin_caption: string;
  email_signature: string;
  availability_badge: string;
  og_description: string;
};

export const generateShareableCopy = async (payload: {
  fullName: string;
  careerGoal: string;
  topSkills: string;
  fieldOfStudy: string;
  availabilityStatus: string;
  bestAchievement: string;
}): Promise<ShareableCopyResult> => {
  const empty: ShareableCopyResult = {
    page_headline: "", whatsapp_message: "", linkedin_caption: "",
    email_signature: "", availability_badge: "Open to opportunities", og_description: "",
  };
  try {
    const result = await invokeGroq("shareable_link", payload as unknown as Record<string, unknown>);
    return {
      page_headline: String(result?.page_headline ?? ""),
      whatsapp_message: String(result?.whatsapp_message ?? ""),
      linkedin_caption: String(result?.linkedin_caption ?? ""),
      email_signature: String(result?.email_signature ?? ""),
      availability_badge: String(result?.availability_badge ?? "Open to opportunities"),
      og_description: String(result?.og_description ?? ""),
    };
  } catch (error) {
    console.error("Error generating shareable copy:", error);
    return empty;
  }
};

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
