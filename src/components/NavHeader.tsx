import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, FileText, Upload, Layout } from 'lucide-react';

const navigationItems = [
  { label: 'Templates', href: '/templates', icon: Layout },
  { label: 'Upload & Improve', href: '/upload-resume', icon: Upload },
];

export function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const NavLinks = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={`
            flex items-center space-x-2 text-resume-dark dark:text-resume-light
            hover:text-resume-primary transition-colors duration-200
            ${mobile ? 'py-2 px-4' : 'px-3 py-2 rounded-md text-sm font-medium'}
          `}
          onClick={() => mobile && setIsOpen(false)}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-resume-dark dark:text-resume-light">
            ResumAI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </nav>

        {/* Theme Toggle & CTA */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <div className="hidden md:flex items-center space-x-2">
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Link to="/resume-builder">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                <NavLinks mobile />
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" onClick={() => setIsOpen(false)}>
                    <Link to="/resume-builder">Get Started</Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
