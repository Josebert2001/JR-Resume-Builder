import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Menu, Upload, Layout, LogOut, User } from 'lucide-react';
import { TaloryIcon } from '@/components/TaloryLogo';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/AuthModal';

const navigationItems = [
  { label: 'Templates', href: '/templates', icon: Layout },
  { label: 'Upload & Improve', href: '/upload-resume', icon: Upload },
];

export function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : '';

  const NavLinks = ({ mobile = false }) => (
    <>
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={`
            flex items-center gap-2 text-stone-600 dark:text-stone-400
            hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-150 font-medium
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
    <>
      <header className="sticky top-0 z-50 w-full border-b border-stone-200/60 dark:border-stone-800/40 bg-[#f7f3ed]/80 dark:bg-[#0e0b08]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <TaloryIcon size={28} />
            <span className="text-base font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              Talory
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <NavLinks />
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Auth area — desktop */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-9 px-3 gap-2 border-stone-200 dark:border-stone-700"
                    >
                      <div className="w-5 h-5 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white text-[10px] font-bold">
                        {initials}
                      </div>
                      <span className="text-sm max-w-[120px] truncate text-stone-700 dark:text-stone-300">
                        {user.email}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem disabled className="text-xs text-stone-500 cursor-default">
                      <User className="w-3.5 h-3.5 mr-2" />
                      {user.email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl h-9 border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign In
                </Button>
              )}

              <Button
                asChild
                className="bg-[#1a1209] hover:bg-[#2a1f10] dark:bg-[#f7f3ed] dark:text-[#1a1209] dark:hover:bg-[#ede8e2] text-white rounded-xl text-sm px-4 h-9"
              >
                <Link to="/resume-builder">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col gap-1 mt-8">
                  <NavLinks mobile />
                  <div className="pt-4 border-t border-border mt-3 space-y-2">
                    {user ? (
                      <>
                        <p className="text-xs text-stone-500 px-4 truncate">{user.email}</p>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 dark:text-red-400"
                          onClick={() => { signOut(); setIsOpen(false); }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full rounded-xl"
                        onClick={() => { setShowAuthModal(true); setIsOpen(false); }}
                      >
                        Sign In
                      </Button>
                    )}
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

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
