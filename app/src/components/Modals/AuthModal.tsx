import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPasswordEmail 
} from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  themeMode?: 'light' | 'dark';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin',
  themeMode = 'light'
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isLight = themeMode === 'light';

  if (!isOpen) return null;

  const resetFormState = () => {
    setError(null);
    setSuccessMsg(null);
  };

  const handleSwitchMode = (newMode: 'signin' | 'signup' | 'forgot') => {
    resetFormState();
    setMode(newMode);
  };

  const mapAuthError = (err: any): string => {
    const code = err?.code || '';
    const message = String(err?.message || '');
    if (message.toLowerCase().includes('already registered')) return 'An account with this email already exists. Please sign in instead.';
    if (message.toLowerCase().includes('invalid login credentials')) return 'Incorrect email or password. Please check your credentials.';
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please sign in instead.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please check your credentials.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In was cancelled.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please wait a few minutes or reset your password.';
      default:
        return err?.message || 'Authentication failed. Please try again.';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormState();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (mode === 'forgot') {
      try {
        setLoading(true);
        await resetPasswordEmail(email.trim());
        setSuccessMsg('Password reset instructions sent! Check your inbox.');
      } catch (err) {
        setError(mapAuthError(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter.');
        return;
      }
      try {
        setLoading(true);
        await signUpWithEmail(email.trim(), password, name.trim());
        setSuccessMsg('Account created successfully! Welcome to Jobryn.');
        setTimeout(() => {
          onClose();
        }, 1200);
      } catch (err) {
        setError(mapAuthError(err));
      } finally {
        setLoading(false);
      }
    } else {
      // Sign In mode
      try {
        setLoading(true);
        await signInWithEmail(email.trim(), password);
        setSuccessMsg('Signed in successfully!');
        setTimeout(() => {
          onClose();
        }, 800);
      } catch (err) {
        setError(mapAuthError(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    resetFormState();
    try {
      setLoading(true);
      await signInWithGoogle();
      setSuccessMsg('Signed in with Google!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  // Password strength helper
  const hasMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className={`relative w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}
      >
        {/* Header Bar */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isLight ? 'border-slate-100 bg-slate-50/50' : 'border-slate-800 bg-slate-950/40'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {mode === 'signin' && 'Sign In to Workspace'}
                {mode === 'signup' && 'Create Your Account'}
                {mode === 'forgot' && 'Reset Password'}
              </h3>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {mode === 'signin' && 'Enter your credentials to access content workflows.'}
                {mode === 'signup' && 'Join thousands of creators automating short-form video.'}
                {mode === 'forgot' && 'We will send a password reset link to your email.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector (SignIn vs SignUp) */}
        {mode !== 'forgot' && (
          <div className={`grid grid-cols-2 p-1.5 mx-6 mt-6 rounded-xl border text-xs font-semibold ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-800'
          }`}>
            <button
              onClick={() => handleSwitchMode('signin')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signin'
                  ? isLight ? 'bg-white text-slate-900 shadow-sm font-bold' : 'bg-slate-800 text-white shadow-sm font-bold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleSwitchMode('signup')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup'
                  ? isLight ? 'bg-white text-slate-900 shadow-sm font-bold' : 'bg-slate-800 text-white shadow-sm font-bold'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Account
            </button>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Notifications / Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs transition-all outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' 
                        : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'
                    }`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs transition-all outline-none ${
                    isLight 
                      ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' 
                      : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'
                  }`}
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('forgot')}
                      className="text-[11px] text-indigo-600 hover:underline font-medium"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-xs transition-all outline-none ${
                      isLight 
                        ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' 
                        : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-3 p-0.5 ${isLight ? 'text-slate-400 hover:text-slate-600' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className={`text-xs font-semibold block ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className={`w-4 h-4 absolute left-3 top-3 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs transition-all outline-none ${
                        isLight 
                          ? 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-indigo-500' 
                          : 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Password strength checklist */}
                <div className="pt-1 flex items-center space-x-3 text-[10px] text-slate-500 font-medium">
                  <span className={`flex items-center space-x-1 ${hasMinLength ? 'text-emerald-600 font-bold' : ''}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Min 6 chars</span>
                  </span>
                  <span className={`flex items-center space-x-1 ${hasUpper ? 'text-emerald-600 font-bold' : ''}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Uppercase</span>
                  </span>
                  <span className={`flex items-center space-x-1 ${hasNumber ? 'text-emerald-600 font-bold' : ''}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Number</span>
                  </span>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all mt-2 ${
                loading
                  ? 'bg-indigo-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Auth Request...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In to Workspace'}
                    {mode === 'signup' && 'Create Secure Account'}
                    {mode === 'forgot' && 'Send Reset Email'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Auth Divider */}
          {mode !== 'forgot' && (
            <div className="space-y-3 pt-2">
              <div className="relative flex items-center justify-center">
                <div className={`w-full border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`} />
                <span className={`absolute px-3 text-[10px] uppercase font-bold tracking-wider ${
                  isLight ? 'bg-white text-slate-400' : 'bg-slate-900 text-slate-500'
                }`}>
                  Or continue with
                </span>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center space-x-2.5 transition-all ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Bottom helper link for forgot password mode */}
          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleSwitchMode('signin')}
                className="text-xs text-indigo-600 hover:underline font-semibold"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
