import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Mail, Lock } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reset = () => {
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(null);
    setLoading(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const handleModeSwitch = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        reset();
        onOpenChange(false);
      }
    } else {
      const { error } = await signUp(email, password);
      setLoading(false);
      if (error) {
        setError(error);
      } else {
        setSuccess('Account created! Check your email to confirm before signing in.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signin' ? 'Sign in to Talory' : 'Create your account'}
          </DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400">{success}</p>
            <Button variant="outline" onClick={() => { setMode('signin'); setSuccess(null); }}>
              Back to Sign In
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="auth-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="auth-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-9"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="auth-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input
                    id="auth-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-9"
                    required
                    minLength={6}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1a1209] hover:bg-[#2a1f10] dark:bg-[#f7f3ed] dark:text-[#1a1209] dark:hover:bg-[#ede8e2] text-white"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-stone-500 pb-1">
              {mode === 'signin' ? (
                <>
                  No account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signup')}
                    className="text-[#2d6a4f] font-medium hover:underline"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signin')}
                    className="text-[#2d6a4f] font-medium hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
