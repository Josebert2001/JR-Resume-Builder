import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';

export const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild className="block md:hidden">
        <Button variant="ghost" size="icon" className="text-resume-muted hover:text-resume-primary" aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-resume-primary">Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-4">
          <Link 
            to="/"
            className="text-resume-muted hover:text-resume-primary transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-resume-light"
          >
            Home
          </Link>
          <Link 
            to="/job-search"
            className="text-resume-muted hover:text-resume-primary transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-resume-light"
          >
            Job Search
          </Link>
          <Link 
            to="/interview-prep"
            className="text-resume-muted hover:text-resume-primary transition-colors duration-200 px-2 py-1.5 rounded-md hover:bg-resume-light"
          >
            Interview Prep
          </Link>
          <div className="h-px bg-border my-4" />
          <Button 
            variant="default" 
            className="w-full bg-resume-primary hover:bg-resume-secondary transition-colors duration-200"
          >
            Create Resume
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};