import {
  type ResumeData,
  type WorkExperience,
  type Project,
  type Education,
  type Skill,
  type Certification,
} from '@/context/ResumeContext';

export type OrchestratorProgress = {
  step: number;
  message: string;
  percent: number;
};

export type MasterAssemblerResult = {
  recommended_summary: string;
  work_bullets: { id: string; bullets: string[] }[];
  project_bullets: { id: string; bullets: string[] }[];
  skills: { technical: string[]; soft: string[]; tools: string[] };
  consistency_tip: string | null;
  ats_rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
};

export type OrchestratorResult = {
  success: boolean;
  updates: Partial<ResumeData>;
  score?: number;
  grade?: string;
  atsRating?: string;
  consistencyTip?: string | null;
  appliedSections: string[];
  error?: string;
};

async function invokeGroqAction(action: string, payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const response = await fetch('/api/groq-generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  });
  if (!response.ok) throw new Error(`${action} failed: HTTP ${response.status}`);
  return response.json();
}

async function safeCall<T>(
  fn: () => Promise<T>,
  fallback: T,
  label: string
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.warn(`[Orchestrator] ${label} failed — using fallback.`, err);
    return fallback;
  }
}

export async function buildFullResume(
  resumeData: ResumeData,
  onProgress: (p: OrchestratorProgress) => void,
  options: {
    includeNysc?: boolean;
    jobDescription?: string;
    jobTitle?: string;
  } = {}
): Promise<OrchestratorResult> {
  const pi = resumeData.personalInfo;
  const fullName = [pi?.firstName, pi?.lastName].filter(Boolean).join(' ') || 'Student';
  const careerGoal = pi?.summary || '';
  const fieldOfStudy = resumeData.education?.[0]?.fieldOfStudy || '';
  const degree = resumeData.education?.[0]?.degree || '';
  const education: Education[] = resumeData.education || [];
  const workExp: WorkExperience[] = resumeData.workExperience || [];
  const projects: Project[] = resumeData.projects || [];
  const certifications: Certification[] = resumeData.certifications || [];
  const existingSkills: Skill[] = resumeData.skills || [];
  const hasExperience = workExp.length > 0;

  const appliedSections: string[] = [];

  onProgress({ step: 1, message: 'Reading your profile...', percent: 5 });

  // ─── WAVE 1: Section processors (parallel) ─────────────────────────────────
  const certsText = certifications.map((c: Certification) => `${c.name} — ${c.issuer}`).join(', ');
  const skillsText = existingSkills.map((s: Skill) => s.name).join(', ');
  const workExpText = workExp.map((w: WorkExperience) =>
    `${w.position} at ${w.company}: ${w.description}`
  ).join('\n');
  const projectsText = projects.map((p: Project) =>
    `${p.name}: ${p.description}${p.technologies ? ` [${p.technologies}]` : ''}`
  ).join('\n');

  const [
    eduResults,
    workResults,
    projResults,
    certsResult,
    skillsResult,
  ] = await Promise.all([
    // education_v2 per entry
    Promise.all(education.map((edu: Education) =>
      safeCall(
        () => invokeGroqAction('education_v2', {
          institution: edu.school,
          degreeType: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          major: edu.fieldOfStudy,
          endYear: edu.graduationDate || '',
          gpa: edu.gpa || '',
          gpaScale: '5.0',
          relevantCourses: '',
          achievements: edu.description || '',
          careerGoal,
        }),
        null,
        `education_v2 [${edu.school}]`
      ).then(r => ({ id: edu.id, result: r }))
    )),
    // work_bullets per entry
    Promise.all(workExp.map((w: WorkExperience) =>
      safeCall(
        () => invokeGroqAction('work_bullets', {
          position: w.position,
          company: w.company,
          duration: `${w.startDate} – ${w.endDate || 'Present'}`,
          rawDescription: w.description,
          fieldOfStudy,
          careerGoal,
        }),
        null,
        `work_bullets [${w.company}]`
      ).then(r => ({ id: w.id, result: r }))
    )),
    // project_bullets per entry
    Promise.all(projects.map((p: Project) =>
      safeCall(
        () => invokeGroqAction('project_bullets', {
          projectName: p.name,
          techStack: p.technologies || '',
          rawDescription: p.description,
          motivation: '',
          fieldOfStudy,
          careerGoal,
        }),
        null,
        `project_bullets [${p.name}]`
      ).then(r => ({ id: p.id, result: r }))
    )),
    // certifications_v2
    safeCall(
      () => invokeGroqAction('certifications_v2', {
        certificationsList: certsText,
        fieldOfStudy,
        careerGoal,
        existingSkills: skillsText,
      }),
      null,
      'certifications_v2'
    ),
    // skills_v2
    safeCall(
      () => invokeGroqAction('skills_v2', {
        fieldOfStudy,
        degree,
        careerGoal,
        workExperience: workExpText,
        projects: projectsText,
        certifications: certsText,
      }),
      null,
      'skills_v2'
    ),
  ]);

  onProgress({ step: 2, message: 'Rewriting your experience with AI...', percent: 30 });

  // ─── WAVE 2: Enhancement layer (parallel) ──────────────────────────────────
  const bestWorkEntry = workExp[0];
  const bestProjEntry = projects[0];
  const suggestedSkills = (skillsResult?.suggested_skills as Record<string, unknown[]> | undefined);
  const topSkillsList = [
    ...((suggestedSkills?.technical as string[]) || existingSkills.slice(0, 4).map(s => s.name)),
  ].slice(0, 6).join(', ');

  const wave2Calls: Promise<unknown>[] = [
    // summary_v2
    safeCall(
      () => invokeGroqAction('summary_v2', {
        fullName,
        fieldOfStudy,
        degree,
        academicLevel: 'undergraduate',
        careerGoal,
        topSkills: topSkillsList,
        bestExperience: bestWorkEntry
          ? `${bestWorkEntry.position} at ${bestWorkEntry.company}: ${bestWorkEntry.description?.slice(0, 120)}`
          : '',
        bestProject: bestProjEntry
          ? `${bestProjEntry.name}: ${bestProjEntry.description?.slice(0, 100)}`
          : '',
        certifications: certsText,
        personalityKeywords: '',
      }),
      null,
      'summary_v2'
    ),
    // resume_score
    safeCall(
      () => invokeGroqAction('resume_score', {
        fullName,
        summary: pi?.summary || '',
        education: education.map((e: Education) => `${e.degree} in ${e.fieldOfStudy} — ${e.school}`).join('; '),
        workExperience: workExpText,
        skills: skillsText,
        projects: projectsText,
        certifications: certsText,
      }),
      null,
      'resume_score'
    ),
  ];

  if (!hasExperience) {
    wave2Calls.push(
      safeCall(
        () => invokeGroqAction('no_experience', {
          fullName,
          fieldOfStudy,
          careerGoal,
          academicLevel: 'undergraduate',
          gpa: education[0]?.gpa || '',
          courses: '',
          projects: projectsText,
          extracurriculars: '',
          volunteer: '',
          certifications: certsText,
          skills: skillsText,
          relevantHobbies: '',
          hasWorkExperience: false,
        }),
        null,
        'no_experience'
      )
    );
  }

  if (options.includeNysc && education.length > 0) {
    const edu0 = education[0];
    wave2Calls.push(
      safeCall(
        () => invokeGroqAction('nigeria_nysc', {
          institution: edu0.school,
          faculty: '',
          department: edu0.fieldOfStudy,
          degree: edu0.degree,
          cgpa: edu0.gpa || '',
          cgpaScale: '5.0',
          degreeClass: '',
          graduationYear: edu0.graduationDate || '',
          nyscStatus: 'Completed',
          nyscState: '',
          nyscYear: '',
          nyscPPA: '',
          nyscCDS: '',
          careerGoal,
          target: 'both',
        }),
        null,
        'nigeria_nysc'
      )
    );
  }

  const wave2Results = await Promise.all(wave2Calls);
  const summaryResult = wave2Results[0] as Record<string, unknown> | null;
  const scoreResult = wave2Results[1] as Record<string, unknown> | null;

  onProgress({ step: 3, message: 'Tailoring your skills for your target role...', percent: 55 });

  // ─── WAVE 3: Master Assembler ───────────────────────────────────────────────
  const workOutputForAssembler = workResults
    .filter(w => w.result !== null)
    .map(w => ({ id: w.id, bullets: (w.result as Record<string, unknown>)?.bullets ?? [] }));

  const projOutputForAssembler = projResults
    .filter(p => p.result !== null)
    .map(p => ({ id: p.id, bullets: (p.result as Record<string, unknown>)?.bullets ?? [] }));

  const assemblerResult = await safeCall(
    () => invokeGroqAction('master_assembler', {
      summaryOutput: summaryResult,
      educationOutput: eduResults.filter(e => e.result !== null).map(e => e.result),
      workOutput: workOutputForAssembler,
      projectsOutput: projOutputForAssembler,
      skillsOutput: skillsResult,
      certsOutput: certsResult,
      careerGoal,
      hasExperience,
      targetMarket: 'Nigeria',
    }),
    null,
    'master_assembler'
  ) as MasterAssemblerResult | null;

  onProgress({ step: 4, message: 'Assembling your final resume...', percent: 72 });

  // ─── WAVE 4: Shareable copy ─────────────────────────────────────────────────
  const shareResult = await safeCall(
    () => invokeGroqAction('shareable_link', {
      fullName,
      careerGoal,
      topSkills: topSkillsList,
      fieldOfStudy,
      availabilityStatus: 'open to work',
      bestAchievement: certifications[0]?.name || projects[0]?.name || '',
    }),
    null,
    'shareable_link'
  );

  onProgress({ step: 5, message: 'Running quality checks...', percent: 90 });

  // ─── Build Partial<ResumeData> updates ─────────────────────────────────────
  const updates: Partial<ResumeData> = {};

  // Summary: prefer master assembler's recommended_summary, fall back to summary_v2
  const recommendedKey = (summaryResult?.recommended as string) || 'skills_led';
  const summaries = summaryResult?.summaries as Record<string, unknown> | undefined;
  const chosenSummary =
    assemblerResult?.recommended_summary ||
    ((summaries?.[recommendedKey] as Record<string, unknown>)?.text as string) ||
    '';
  if (chosenSummary) {
    updates.personalInfo = { ...(resumeData.personalInfo || { firstName: '', lastName: '', email: '', phone: '' }), summary: chosenSummary };
    appliedSections.push('Professional Summary');
  }

  // Work experience: apply master assembler bullets or raw wave1 bullets
  if (workExp.length > 0) {
    const updatedWork = workExp.map((w: WorkExperience) => {
      const assembled = assemblerResult?.work_bullets?.find(wb => wb.id === w.id);
      const raw = workResults.find(wr => wr.id === w.id);
      const rawBullets = (raw?.result as Record<string, unknown>)?.bullets as string[] | undefined;
      const bullets = assembled?.bullets || rawBullets;
      if (bullets && bullets.length > 0) {
        return { ...w, description: bullets.join('\n') };
      }
      return w;
    });
    if (JSON.stringify(updatedWork) !== JSON.stringify(workExp)) {
      updates.workExperience = updatedWork;
      appliedSections.push('Work Experience');
    }
  }

  // Projects: apply master assembler bullets or raw wave1 bullets
  if (projects.length > 0) {
    const updatedProjects = projects.map((p: Project) => {
      const assembled = assemblerResult?.project_bullets?.find(pb => pb.id === p.id);
      const raw = projResults.find(pr => pr.id === p.id);
      const rawBullets = (raw?.result as Record<string, unknown>)?.bullets as string[] | undefined;
      const oneLiner = (raw?.result as Record<string, unknown>)?.one_liner as string | undefined;
      const bullets = assembled?.bullets || rawBullets;
      if (bullets && bullets.length > 0) {
        return { ...p, description: bullets.join('\n') };
      } else if (oneLiner) {
        return { ...p, description: oneLiner };
      }
      return p;
    });
    if (JSON.stringify(updatedProjects) !== JSON.stringify(projects)) {
      updates.projects = updatedProjects;
      appliedSections.push('Projects');
    }
  }

  // Skills: use master assembler merged skills or raw skills_v2
  const assembledSkills = assemblerResult?.skills;
  const rawSuggestedSkills = skillsResult?.suggested_skills as Record<string, unknown> | undefined;
  const allSkillNames: string[] = [
    ...((assembledSkills?.technical || (rawSuggestedSkills?.technical as string[])) || []),
    ...((assembledSkills?.soft || (rawSuggestedSkills?.soft as string[])) || []),
    ...((assembledSkills?.tools || (rawSuggestedSkills?.tools as string[])) || []),
  ];
  if (allSkillNames.length > 0) {
    const newSkills: Skill[] = allSkillNames.slice(0, 20).map((name, i) => ({
      id: `ai-skill-${i}`,
      name,
      level: i < 6 ? 4 : 3,
    }));
    updates.skills = newSkills;
    appliedSections.push('Skills');
  }

  onProgress({ step: 6, message: 'Your resume is ready!', percent: 100 });

  const totalScore = (scoreResult?.total_score as number) || 0;
  const grade = (scoreResult?.grade as string) || '';
  const atsRating = assemblerResult?.ats_rating || 'Fair';
  const consistencyTip = assemblerResult?.consistency_tip ?? null;

  return {
    success: true,
    updates,
    score: totalScore,
    grade,
    atsRating,
    consistencyTip,
    appliedSections,
  };
}
