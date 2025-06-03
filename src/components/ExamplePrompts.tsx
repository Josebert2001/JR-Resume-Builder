
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MessageSquare } from 'lucide-react';

interface ExamplePromptsProps {
  type: 'resume' | 'skills' | 'career';
  onPromptSelect: (prompt: string) => void;
}

const promptsByType = {
  resume: [
    "How can I make my resume stand out for tech roles?",
    "What's the best way to format my work experience?",
    "How do I write a compelling professional summary?",
    "Should I include a skills section on my resume?",
    "How can I optimize my resume for ATS systems?"
  ],
  skills: [
    "What skills are most in-demand for software developers?",
    "How can I learn data analysis skills quickly?",
    "What certifications would boost my career?",
    "How do I develop leadership skills?",
    "What technical skills should I focus on for my field?"
  ],
  career: [
    "How do I transition from one industry to another?",
    "What's the best way to negotiate salary?",
    "How can I build a professional network?",
    "When should I consider changing careers?",
    "How do I prepare for job interviews?"
  ]
};

export const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ type, onPromptSelect }) => {
  const prompts = promptsByType[type];

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" />
          Example Questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {prompts.map((prompt, index) => (
            <Button
              key={index}
              variant="ghost"
              className="justify-start text-left h-auto p-2 text-sm"
              onClick={() => onPromptSelect(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
