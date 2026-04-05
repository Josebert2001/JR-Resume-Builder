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

function extractSkillNames(arr: unknown): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((s: unknown) => {
    if (typeof s === 'string') return s;
    if (typeof s === 'object' && s !== null && 'name' in s) {
      return String((s as Record<string, unknown>).name);
    }
    return String(s);
  }).filter(Boolean);
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
  const { jobDescription = '', jobTitle = '' } = options;

  const appliedSections: string[] = [];

  onProgress({ step: 1, message: 'Reading your profile...', percent: 5 });

  // ─── Derived text strings for prompt context ────────────────────────────────
  const certsText = certifications.map((c: Certification) => `${c.name} — ${c.issuer}`).join(', ');
  const skillsText = existingSkills.map((s: Skill) => s.name).join(', ');
  const workExpText = workExp.map((w: WorkExperience) =>
    `${w.position} at ${w.company}: ${w.description}`
  ).join('\n');
  const projectsText = projects.map((p: Project) =>
    `${p.name}: ${p.description}${p.technologies ? ` [${p.technologies}]` : ''}`
  ).join('\n');
  const jdContext = [
    jobTitle ? `Target Job Title: ${jobTitle}` : '',
    jobDescription ? `Target Job Description:\n${jobDescription.slice(0, 600)}` : '',
  ].filter(Boolean).join('\n');
  const jdContextBlock = jdContext ? `\n\n${jdContext}` : '';

  onProgress({ step: 2, message: 'Enhancing each section with AI...', percent: 15 });

  // ─── WAVE 1: Section processors (all parallel) ──────────────────────────────
  const [
    eduResults,
    workResults,
    projResults,
    certsResult,
    skillsResult,
  ] = await Promise.all([
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
          careerGoal: careerGoal + jdContextBlock,
        }),
        null,
        `education_v2 [${edu.school}]`
      ).then(r => ({ id: edu.id, result: r }))
    )),
    Promise.all(workExp.map((w: WorkExperience) =>
      safeCall(
        () => invokeGroqAction('work_bullets', {
          position: w.position,
          company: w.company,
          duration: `${w.startDate} – ${w.endDate || 'Present'}`,
          rawDescription: w.description,
          fieldOfStudy,
          careerGoal: careerGoal + jdContextBlock,
        }),
        null,
        `work_bullets [${w.company}]`
      ).then(r => ({ id: w.id, result: r }))
    )),
    Promise.all(projects.map((p: Project) =>
      safeCall(
        () => invokeGroqAction('project_bullets', {
          projectName: p.name,
          techStack: p.technologies || '',
          rawDescription: p.description,
          motivation: '',
          fieldOfStudy,
          careerGoal: careerGoal + jdContextBlock,
        }),
        null,
        `project_bullets [${p.name}]`
      ).then(r => ({ id: p.id, result: r }))
    )),
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
    safeCall(
      () => invokeGroqAction('skills_v2', {
        fieldOfStudy,
        degree,
        careerGoal: careerGoal + jdContextBlock,
        workExperience: workExpText,
        projects: projectsText,
        certifications: certsText,
      }),
      null,
      'skills_v2'
    ),
  ]);

  onProgress({ step: 3, message: 'Writing your summary & scoring resume...', percent: 45 });

  // ─── WAVE 2: Enhancement layer (parallel) ──────────────────────────────────
  const rawSuggestedSkills = skillsResult?.suggested_skills as Record<string, unknown> | undefined;
  const techSkillNames = extractSkillNames(rawSuggestedSkills?.technical);
  const softSkillNames = extractSkillNames(rawSuggestedSkills?.soft);
  const toolSkillNames = extractSkillNames(rawSuggestedSkills?.tools);
  const topSkillsList = [...techSkillNames, ...toolSkillNames].slice(0, 6).join(', ') || skillsText;

  const bestWorkEntry = workExp[0];
  const bestProjEntry = projects[0];

  const wave2Calls: Promise<unknown>[] = [
    safeCall(
      () => invokeGroqAction('summary_v2', {
        fullName,
        fieldOfStudy,
        degree,
        academicLevel: 'undergraduate',
        careerGoal: careerGoal + jdContextBlock,
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

  let nyscResultIndex = -1;
  if (options.includeNysc && education.length > 0) {
    nyscResultIndex = wave2Calls.length;
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
  const nyscResult = nyscResultIndex >= 0 ? wave2Results[nyscResultIndex] as Record<string, unknown> | null : null;

  // ─── WAVE 3: Master Assembler ───────────────────────────────────────────────
  const workOutputForAssembler = workResults
    .filter(w => w.result !== null)
    .map(w => ({ id: w.id, bullets: (w.result as Record<string, unknown>)?.bullets ?? [] }));

  const projOutputForAssembler = projResults
    .filter(p => p.result !== null)
    .map(p => ({ id: p.id, bullets: (p.result as Record<string, unknown>)?.bullets ?? [] }));

  onProgress({ step: 4, message: 'Assembling your final resume...', percent: 62 });

  const assemblerResult = await safeCall(
    () => invokeGroqAction('master_assembler', {
      summaryOutput: summaryResult,
      educationOutput: eduResults.filter(e => e.result !== null).map(e => e.result),
      workOutput: workOutputForAssembler,
      projectsOutput: projOutputForAssembler,
      skillsOutput: skillsResult,
      certsOutput: certsResult,
      careerGoal: careerGoal + jdContextBlock,
      hasExperience,
      targetMarket: 'Nigeria',
    }),
    null,
    'master_assembler'
  ) as MasterAssemblerResult | null;

  onProgress({ step: 5, message: 'Running quality checks...', percent: 82 });

  // ─── WAVE 4: Shareable copy ─────────────────────────────────────────────────
  await safeCall(
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

  // ─── Build Partial<ResumeData> updates ─────────────────────────────────────
  const updates: Partial<ResumeData> = {};

  // ── Summary ─────────────────────────────────────────────────────────────────
  const recommendedKey = (summaryResult?.recommended as string) || 'skills_led';
  const summaries = summaryResult?.summaries as Record<string, unknown> | undefined;
  const chosenSummary =
    assemblerResult?.recommended_summary ||
    ((summaries?.[recommendedKey] as Record<string, unknown>)?.text as string) ||
    '';
  if (chosenSummary) {
    updates.personalInfo = {
      ...(resumeData.personalInfo || { firstName: '', lastName: '', email: '', phone: '' }),
      summary: chosenSummary,
    };
    appliedSections.push('Professional Summary');
  }

  // ── Education ───────────────────────────────────────────────────────────────
  if (education.length > 0) {
    const updatedEducation = education.map((edu: Education) => {
      const eduAIResult = eduResults.find(r => r.id === edu.id);
      if (!eduAIResult?.result) return edu;
      const entry = (eduAIResult.result as Record<string, unknown>)?.education_entry as Record<string, unknown> | undefined;
      if (!entry) return edu;
      const bullets: string[] = [
        ...((entry.achievements as string[]) || []),
        ...((entry.honors as string[]) || []),
        ...((entry.extracurriculars as string[]) || []),
      ].filter(Boolean);
      if (bullets.length === 0) return edu;
      return { ...edu, description: bullets.join('\n') };
    });

    // Apply NYSC formatting to first education entry if requested
    if (nyscResult && education.length > 0) {
      const localVer = (nyscResult.local_version || nyscResult.international_version) as Record<string, unknown> | undefined;
      if (localVer) {
        const nyscBullets = Array.isArray(localVer.bullets) ? (localVer.bullets as string[]) : [];
        const nyscLines = [
          localVer.degree_line ? String(localVer.degree_line) : '',
          localVer.nysc_line ? String(localVer.nysc_line) : '',
          localVer.service_line ? String(localVer.service_line) : '',
          localVer.cgpa_line ? String(localVer.cgpa_line) : '',
          ...nyscBullets,
        ].filter(Boolean);
        if (nyscLines.length > 0) {
          updatedEducation[0] = { ...updatedEducation[0], description: nyscLines.join('\n') };
        }
      }
    }

    if (JSON.stringify(updatedEducation) !== JSON.stringify(education)) {
      updates.education = updatedEducation;
      appliedSections.push('Education');
    }
  }

  // ── Work experience ─────────────────────────────────────────────────────────
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

  // ── Projects ────────────────────────────────────────────────────────────────
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

  // ── Skills ──────────────────────────────────────────────────────────────────
  const assembledSkills = assemblerResult?.skills;
  const allSkillNames: string[] = [
    ...((assembledSkills?.technical) || techSkillNames),
    ...((assembledSkills?.soft) || softSkillNames),
    ...((assembledSkills?.tools) || toolSkillNames),
  ].filter(Boolean);

  if (allSkillNames.length > 0) {
    const newSkills: Skill[] = allSkillNames.slice(0, 20).map((name, i) => ({
      id: `ai-skill-${i}`,
      name,
      level: i < 6 ? 4 : 3,
    }));
    updates.skills = newSkills;
    appliedSections.push('Skills');
  }

  // ── Certifications ──────────────────────────────────────────────────────────
  if (certifications.length > 0 && certsResult) {
    type NormCert = { rank: number; formatted_name: string; value_statement: string; include_on_resume: boolean };
    const aiCerts = (certsResult.certifications as NormCert[] | undefined) || [];
    if (aiCerts.length > 0) {
      const updatedCerts = certifications
        .map((c: Certification) => {
          const match = aiCerts.find(ac =>
            ac.formatted_name.toLowerCase().includes(c.name.toLowerCase().slice(0, 6)) ||
            c.name.toLowerCase().includes(ac.formatted_name.toLowerCase().slice(0, 6))
          );
          if (!match || !match.include_on_resume) return c;
          return {
            ...c,
            name: match.formatted_name || c.name,
            description: match.value_statement || c.description,
          };
        })
        .filter((_, i) => !aiCerts[i] || aiCerts[i].include_on_resume !== false);

      if (JSON.stringify(updatedCerts) !== JSON.stringify(certifications)) {
        updates.certifications = updatedCerts;
        appliedSections.push('Certifications');
      }
    }
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
