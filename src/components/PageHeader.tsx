
import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, showBackButton = true, children }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="py-6 border-b border-slate-800/50 sticky top-0 z-50 glass-panel">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-slate-300 hover:bg-slate-800/60 hover:text-white rounded-lg px-3 py-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <div className="logo-glow">
                <img 
                  src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
                  alt="JR Resume Builder Logo" 
                  className="h-10 w-auto" 
                />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold text-slate-50">
                  {title}
                </h1>
                <Sparkles className="h-5 w-5 text-blue-400/80" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {children}
          </div>
        </div>
      </div>
    </header>
  );
};
