import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Sparkles, Loader2, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { suggestSkillsWithReasons, SkillWithReason } from '@/services/resumeAI';

type Category = 'all' | 'technical' | 'soft' | 'tools' | 'languages';

const SUGGESTIONS: Record<Exclude<Category, 'all'>, string[]> = {
  technical: [
    'Python', 'JavaScript', 'Excel', 'HTML/CSS', 'SQL', 'Java', 'AutoCAD',
    'React', 'Node.js', 'TypeScript', 'Git', 'Data Analysis', 'C++',
    'Machine Learning', 'Photoshop', 'WordPress', 'R', 'MATLAB',
  ],
  soft: [
    'Communication', 'Teamwork', 'Leadership', 'Problem Solving',
    'Time Management', 'Adaptability', 'Critical Thinking', 'Creativity',
    'Attention to Detail', 'Work Ethic', 'Conflict Resolution', 'Empathy',
    'Public Speaking', 'Collaboration',
  ],
  tools: [
    'Microsoft Office', 'Canva', 'Figma', 'Google Workspace', 'Slack',
    'Notion', 'Trello', 'Zoom', 'Adobe Suite', 'GitHub', 'VS Code',
    'Salesforce', 'Jira', 'Airtable',
  ],
  languages: [
    'English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Portuguese',
    'German', 'Yoruba', 'Igbo', 'Hausa', 'Swahili', 'Hindi', 'Italian',
  ],
};

const EXAMPLES = [
  { label: 'Technical skills', items: ['Python', 'Excel', 'HTML/CSS', 'AutoCAD'] },
  { label: 'Soft skills', items: ['Communication', 'Teamwork', 'Leadership'] },
  { label: 'Tools', items: ['Canva', 'Figma', 'Google Workspace', 'Slack'] },
];

const TABS: { key: Category; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'technical', label: 'Technical' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'tools', label: 'Tools' },
  { key: 'languages', label: 'Languages' },
];

type AiChipsByCategory = {
  technical: SkillWithReason[];
  soft: SkillWithReason[];
  tools: SkillWithReason[];
};

function getAiChipsForCategory(
  category: Category,
  aiByCategory: AiChipsByCategory
): SkillWithReason[] {
  if (category === 'all') {
    return [
      ...aiByCategory.technical,
      ...aiByCategory.soft,
      ...aiByCategory.tools,
    ];
  }
  if (category === 'languages') return [];
  return aiByCategory[category] ?? [];
}

function getVisibleChipNames(
  category: Category,
  aiChipsForCategory: SkillWithReason[],
  addedNames: Set<string>
): string[] {
  let staticPool: string[];
  if (category === 'all') {
    staticPool = [
      ...SUGGESTIONS.technical,
      ...SUGGESTIONS.soft,
      ...SUGGESTIONS.tools,
      ...SUGGESTIONS.languages,
    ];
  } else {
    staticPool = SUGGESTIONS[category] ?? [];
  }
  const aiNames = aiChipsForCategory.map(c => c.name);
  const merged = [...new Set([...aiNames, ...staticPool])];
  return merged.filter(s => !addedNames.has(s.toLowerCase()));
}

export const SkillsForm = () => {
  const { resumeData, updateResumeData, nextStep } = useResumeContext();
  const skills = resumeData.skills || [];
  const addedNames = new Set(skills.map(s => s.name.toLowerCase()));

  const [activeTab, setActiveTab] = useState<Category>('all');
  const [customInput, setCustomInput] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiByCategory, setAiByCategory] = useState<AiChipsByCategory>({
    technical: [],
    soft: [],
    tools: [],
  });
  const [aiTip, setAiTip] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const aiChipsForTab = getAiChipsForCategory(activeTab, aiByCategory);
  const aiReasonMap = new Map(aiChipsForTab.map(c => [c.name.toLowerCase(), c.reason]));

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (addedNames.has(trimmed.toLowerCase())) {
      toast.info(`"${trimmed}" is already in your skills list`);
      return;
    }
    updateResumeData({
      skills: [
        ...skills,
        { id: `skill-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name: trimmed, level: 3 },
      ],
    });
  };

  const removeSkill = (id: string) => {
    updateResumeData({ skills: skills.filter(s => s.id !== id) });
  };

  const handleCustomAdd = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    addSkill(trimmed);
    setCustomInput('');
    inputRef.current?.focus();
  };

  const handleSuggestWithAI = async () => {
    setIsSuggesting(true);
    try {
      const fieldOfStudy = resumeData.education?.[0]?.fieldOfStudy || '';
      const degree = resumeData.education?.[0]?.degree || '';
      const careerGoal =
        resumeData.workExperience?.[0]?.position ||
        resumeData.personalInfo?.summary?.slice(0, 60) ||
        'entry-level professional';

      const workExp =
        resumeData.workExperience
          ?.map(e => `${e.position} at ${e.company}: ${e.description || ''}`)
          .join('; ') || '';

      const projs =
        resumeData.projects
          ?.map(p => `${p.name}: ${p.description || ''} (${p.technologies || ''})`)
          .join('; ') || '';

      const certs =
        resumeData.certifications?.map(c => c.name).join(', ') || '';

      const current = new Set(skills.map(s => s.name.toLowerCase()));

      const suggestions = await suggestSkillsWithReasons(
        fieldOfStudy,
        degree,
        careerGoal,
        workExp,
        projs,
        certs
      );

      const filtered: AiChipsByCategory = {
        technical: suggestions.technical.filter(s => !current.has(s.name.toLowerCase())),
        soft: suggestions.soft.filter(s => !current.has(s.name.toLowerCase())),
        tools: suggestions.tools.filter(s => !current.has(s.name.toLowerCase())),
      };

      const totalNew =
        filtered.technical.length + filtered.soft.length + filtered.tools.length;

      if (totalNew === 0) {
        setAiByCategory({ technical: [], soft: [], tools: [] });
        setAiTip('');
        toast.info('No new suggestions found. Try filling in more experience details first.');
        return;
      }

      setAiByCategory(filtered);
      setAiTip(suggestions.tip || '');
      setActiveTab('all');
      toast.success(`${totalNew} personalised skill suggestions ready — tap any to add`);
    } catch (err) {
      console.error(err);
      toast.error('Could not get AI suggestions. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const visibleChips = getVisibleChipNames(activeTab, aiChipsForTab, addedNames);
  const skillCount = skills.length;
  const counterMsg =
    skillCount === 0
      ? 'No skills added yet'
      : skillCount < 5
      ? `${skillCount} skill${skillCount !== 1 ? 's' : ''} added · aim for 5–10`
      : skillCount <= 10
      ? `${skillCount} skills added · great range!`
      : `${skillCount} skills added · consider trimming to your best`;

  return (
    <div className="min-h-screen bg-[#f7f3ed] flex flex-col">
      {/* ─── Header ─── */}
      <div className="px-4 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-[#1a1209] leading-tight">Your Skills</h1>
        <p className="text-sm text-[#5c4a2a] mt-1">
          Tell us what you're good at — we'll place them perfectly on your resume.
        </p>
      </div>

      <div className="flex-1 px-4 pb-32 space-y-5 overflow-y-auto">

        {/* ─── Explainer card ─── */}
        <div className="bg-[#e8f5ee] border border-[#b6d9c4] rounded-2xl p-4 flex gap-3">
          <BookOpen className="text-[#2d6a4f] shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm font-semibold text-[#2d6a4f] mb-1">What are skills on a resume?</p>
            <p className="text-sm text-[#3d5544] leading-relaxed">
              Skills are the things you know how to do — like using Microsoft Word, coding, or
              communicating well. Recruiters scan these first before reading anything else.
            </p>
          </div>
        </div>

        {/* ─── Examples box ─── */}
        <div className="bg-white border border-[#e5ddd0] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-[#c05621]" />
            <span className="text-xs font-semibold text-[#c05621] uppercase tracking-wide">Examples</span>
          </div>
          <div className="space-y-2.5">
            {EXAMPLES.map(row => (
              <div key={row.label} className="flex items-start gap-2">
                <span className="text-xs text-[#8a7560] font-medium w-28 shrink-0 pt-0.5">{row.label}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {row.items.map(item => (
                    <span
                      key={item}
                      className="text-xs bg-[#f0ebe3] text-[#5c4a2a] rounded-full px-2.5 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── AI Suggest button ─── */}
        <button
          type="button"
          onClick={handleSuggestWithAI}
          disabled={isSuggesting}
          data-testid="button-ai-suggest-skills"
          className={cn(
            'w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all',
            'bg-[#2d6a4f] text-white active:scale-[0.98]',
            isSuggesting && 'opacity-70 cursor-not-allowed'
          )}
        >
          {isSuggesting ? (
            <><Loader2 size={16} className="animate-spin" /> Thinking…</>
          ) : (
            <><Sparkles size={16} /> Suggest Skills with AI</>
          )}
        </button>

        {/* ─── AI tip card (dismissible) ─── */}
        {aiTip && (
          <div className="flex items-start gap-2 bg-[#e8f5ee] border border-[#b6d9c4] rounded-2xl p-3">
            <Sparkles className="text-[#2d6a4f] shrink-0 mt-0.5" size={14} />
            <p className="text-xs text-[#3d5544] leading-relaxed flex-1">{aiTip}</p>
            <button
              type="button"
              onClick={() => setAiTip('')}
              aria-label="Dismiss tip"
              data-testid="button-dismiss-ai-tip"
              className="text-[#6a9e82] hover:text-[#2d6a4f] transition-colors shrink-0 mt-0.5"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ─── Category tabs ─── */}
        <div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                data-testid={`tab-category-${tab.key}`}
                className={cn(
                  'shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all',
                  activeTab === tab.key
                    ? 'bg-[#2d6a4f] text-white'
                    : 'bg-white border border-[#e5ddd0] text-[#5c4a2a]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ─── Suggestion chips ─── */}
          <div className="mt-3 flex flex-wrap gap-2">
            {visibleChips.length === 0 && (
              <p className="text-xs text-[#8a7560] italic">
                {addedNames.size > 0
                  ? 'All suggestions in this category are already added.'
                  : 'No suggestions here yet.'}
              </p>
            )}
            {visibleChips.map(chip => {
              const reason = aiReasonMap.get(chip.toLowerCase());
              const isAi = reason !== undefined;
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addSkill(chip)}
                  data-testid={`chip-skill-${chip.replace(/\s+/g, '-').toLowerCase()}`}
                  className={cn(
                    'flex items-start gap-1.5 text-xs font-medium transition-all active:scale-95 text-left',
                    isAi
                      ? 'bg-[#fff3ec] border border-[#f0b48a] text-[#c05621] rounded-xl px-3 py-2 flex-col'
                      : 'bg-white border border-[#d6cfc5] text-[#3d2e1a] rounded-full px-3 py-1.5 flex-row items-center'
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Plus size={12} className="shrink-0" />
                    <span>{chip}</span>
                    {isAi && (
                      <span className="text-[9px] font-bold uppercase tracking-wide text-[#c05621] ml-0.5">AI</span>
                    )}
                  </div>
                  {reason && (
                    <span className="text-[10px] text-[#8a7560] leading-tight font-normal pl-4">{reason}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Added skills list ─── */}
        <div className="bg-white border border-[#e5ddd0] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-[#1a1209]">Added skills</span>
            <span
              data-testid="text-skill-counter"
              className={cn(
                'text-xs font-medium',
                skillCount >= 5 ? 'text-[#2d6a4f]' : 'text-[#8a7560]'
              )}
            >
              {counterMsg}
            </span>
          </div>

          {skills.length === 0 ? (
            <p className="text-xs text-[#a09080] text-center py-4 italic">
              Tap a suggestion above or type a skill below to get started
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span
                  key={skill.id}
                  data-testid={`tag-skill-${skill.id}`}
                  className="flex items-center gap-1.5 bg-[#e8f5ee] border border-[#b6d9c4] text-[#2d6a4f] text-xs font-semibold rounded-full px-3 py-1.5"
                >
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    data-testid={`button-remove-skill-${skill.id}`}
                    className="text-[#2d6a4f] hover:text-red-500 transition-colors"
                    aria-label={`Remove ${skill.name}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ─── Custom input ─── */}
        <div className="bg-white border border-[#e5ddd0] rounded-2xl p-4 space-y-2">
          <p className="text-xs font-semibold text-[#1a1209]">Add your own skill</p>
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCustomAdd(); } }}
              placeholder="Type a skill, e.g. Public Speaking"
              data-testid="input-custom-skill"
              className="flex-1 h-11 rounded-xl border-[#d6cfc5] bg-[#faf8f5] text-sm"
            />
            <Button
              type="button"
              onClick={handleCustomAdd}
              disabled={!customInput.trim()}
              data-testid="button-add-custom-skill"
              className="h-11 px-5 rounded-xl bg-[#2d6a4f] text-white hover:bg-[#245c43] text-sm font-semibold"
            >
              Add
            </Button>
          </div>
          <p className="text-xs text-[#8a7560]">Can't find your skill? Just type it and tap Add.</p>
        </div>
      </div>

      {/* ─── Bottom actions (fixed) ─── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#f7f3ed] border-t border-[#e5ddd0] px-4 py-4 space-y-3">
        <Button
          type="button"
          onClick={nextStep}
          disabled={skillCount === 0}
          data-testid="button-next-step"
          className={cn(
            'w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all',
            skillCount === 0
              ? 'bg-[#c8c0b4] text-[#8a7560] cursor-not-allowed'
              : 'bg-[#2d6a4f] text-white hover:bg-[#245c43]'
          )}
        >
          Next Step <ChevronRight size={18} />
        </Button>
        <button
          type="button"
          onClick={nextStep}
          data-testid="button-skip-skills"
          className="w-full text-center text-sm text-[#8a7560] hover:text-[#5c4a2a] transition-colors py-1"
        >
          Skip — I'll add skills later
        </button>
      </div>
    </div>
  );
};
