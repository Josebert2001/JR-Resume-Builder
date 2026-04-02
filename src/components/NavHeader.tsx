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
            flex items-center gap-2 text-zinc-600 dark:text-zinc-400
            hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 font-medium
            ${mobile ? 'py-2.5 px-4 text-base' : 'text-sm'}
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            ResumAI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden md:block">
            <Button
              asChild
              className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 text-white rounded-xl text-sm px-4 h-9"
            >
              <Link to="/resume-builder">Get Started</Link>
            </Button>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-1 mt-8">
                <NavLinks mobile />
                <div className="pt-4 border-t border-border mt-3">
                  <Button
                    asChild
                    className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 text-white rounded-xl"
                    onClick={() => setIsOpen(false)}
                  >
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
