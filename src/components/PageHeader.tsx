import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, showBackButton = true, children }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
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
              <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
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
