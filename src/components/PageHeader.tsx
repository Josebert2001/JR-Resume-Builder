
import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, showBackButton = true, children }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                <Home className="h-4 w-4" />
                Home
              </Button>
            )}
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/a9717253-dac6-43c6-ae44-bf112da68b5e.png" 
                alt="JR Resume Builder Logo" 
                className="h-8 w-auto" 
              />
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-resume-primary to-resume-secondary text-transparent bg-clip-text">
                {title}
              </h1>
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
