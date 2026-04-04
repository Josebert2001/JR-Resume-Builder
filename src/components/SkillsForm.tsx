import React, { useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, X, Sparkles, Loader2, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { useResumeContext } from '@/context/ResumeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { suggestGroupedSkills } from '@/services/resumeAI';

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

function getVisibleChips(category: Category, aiChips: string[], addedNames: Set<string>): string[] {
  let pool: string[];
  if (category === 'all') {
    pool = [
      ...SUGGESTIONS.technical,
      ...SUGGESTIONS.soft,
      ...SUGGESTIONS.tools,
      ...SUGGESTIONS.languages,
    ];
  } else {
    pool = SUGGESTIONS[category];
  }
  const merged = [...new Set([...aiChips, ...pool])];
  return merged.filter(s => !addedNames.has(s.toLowerCase()));
}

export const SkillsForm = () => {
  const { resumeData, updateResumeData, nextStep, prevStep } = useResumeContext();
  const skills = resumeData.skills || [];
  const addedNames = new Set(skills.map(s => s.name.toLowerCase()));

  const [activeTab, setActiveTab] = useState<Category>('all');
  const [customInput, setCustomInput] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiChips, setAiChips] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const targetRole =
        resumeData.workExperience?.[0]?.position ||
        resumeData.personalInfo?.summary?.slice(0, 40) ||
        'Student';

      const context: string[] = [];
      resumeData.workExperience?.forEach(e =>
        context.push(`${e.position} at ${e.company}: ${e.description || ''}`)
      );
      resumeData.education?.forEach(e =>
        context.push(`${e.degree} in ${e.fieldOfStudy} from ${e.school}`)
      );
      resumeData.projects?.forEach(p =>
        context.push(`Project: ${p.name} — ${p.description || ''} (${p.technologies || ''})`)
      );

      const current = skills.map(s => s.name);
      const suggestions = await suggestGroupedSkills(targetRole, context, current);
      const combined = [...suggestions.technical, ...suggestions.soft].filter(
        s => !addedNames.has(s.toLowerCase())
      );

      if (combined.length === 0) {
        toast.info('No new suggestions found. Try filling in more experience details first.');
        return;
      }
      setAiChips(combined);
      setActiveTab('all');
      toast.success(`${combined.length} AI-suggested skills ready — tap any to add`);
    } catch (err) {
      console.error(err);
      toast.error('Could not get AI suggestions. Please try again.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const visibleChips = getVisibleChips(activeTab, aiChips, addedNames);
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
              const isAi = aiChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addSkill(chip)}
                  data-testid={`chip-skill-${chip.replace(/\s+/g, '-').toLowerCase()}`}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-medium rounded-full px-3 py-1.5 transition-all active:scale-95',
                    isAi
                      ? 'bg-[#fff3ec] border border-[#f0b48a] text-[#c05621]'
                      : 'bg-white border border-[#d6cfc5] text-[#3d2e1a]'
                  )}
                >
                  <Plus size={12} />
                  {chip}
                  {isAi && <span className="text-[9px] font-bold uppercase tracking-wide text-[#c05621] ml-0.5">AI</span>}
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
