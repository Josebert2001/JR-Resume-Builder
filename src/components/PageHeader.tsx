import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TaloryIcon } from '@/components/TaloryLogo';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, showBackButton = true, children }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/60 dark:border-stone-800/40 bg-[#f7f3ed]/80 dark:bg-[#0e0b08]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
            )}
            <div className="flex items-center gap-2.5">
              <TaloryIcon size={28} />
              <span className="font-semibold text-base">{title}</span>
            </div>
          </div>
          {children && (
            <div className="flex items-center gap-2">{children}</div>
          )}
        </div>
      </div>
    </header>
  );
};
