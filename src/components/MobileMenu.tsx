import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Menu, ChevronRight } from 'lucide-react';

export const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="block md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-resume-muted hover:text-resume-primary transition-all duration-200" 
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="text-xl font-semibold bg-gradient-to-r from-resume-primary to-resume-secondary text-transparent bg-clip-text">JR Resume Builder</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-4">
          <div className="space-y-3">
            <Link 
              to="/"
              className="flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 p-3 rounded-lg hover:bg-accent"
            >
              Home
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/job-search"
              className="flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 p-3 rounded-lg hover:bg-accent"
            >
              Job Search
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/interview-prep"
              className="flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 p-3 rounded-lg hover:bg-accent"
            >
              Interview Preparation
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/cover-letter-guide"
              className="flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 p-3 rounded-lg hover:bg-accent"
            >
              Cover Letter Guide
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6 px-3">
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-resume-primary to-resume-secondary hover:opacity-90 transition-all duration-200"
            >
              Create Resume
            </Button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};