import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './app/auth';
import { navigate, usePathname } from './app/router';
import PublicHome from './pages/PublicHome';
import PricingPage from './pages/PricingPage';
import AuthPage from './pages/AuthPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/PasswordPages';
import MfaPage from './pages/MfaPage';
import OnboardingPage from './pages/OnboardingPage';
import AppShell from './pages/AppShell';
import LegacyCampaignApp from './LegacyCampaignApp';

export default function App() {
  return <AuthProvider><Routes/></AuthProvider>;
}

function Routes() {
  const path=usePathname(); const auth=useAuth();
  if(path==='/')return <PublicHome/>;
  if(path==='/pricing')return <PricingPage/>;
  if(path==='/login'||path==='/signup')return <AuthPage/>;
  if(path==='/auth/callback')return <AuthCallbackPage/>;
  if(path==='/forgot-password')return <ForgotPasswordPage/>;
  if(path==='/reset-password')return <ResetPasswordPage/>;
  if(path==='/mfa')return <MfaPage/>;
  if(path==='/onboarding')return <OnboardingPage/>;
  if(path==='/app/campaigns/legacy')return <ProtectedLegacy auth={auth}/>;
  if(path.startsWith('/app'))return <AppShell/>;
  return <NotFound/>;
}

function ProtectedLegacy({auth}:{auth:ReturnType<typeof useAuth>}) {
  useEffect(()=>{if(!auth.loading&&!auth.session)navigate('/login',true)},[auth.loading,auth.session]);
  if(auth.loading||!auth.session)return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Checking session…</div>;
  return <div><div className="fixed right-4 top-4 z-[100] flex gap-2"><button onClick={()=>navigate('/app/campaigns')} className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-lg">Return to SaaS shell</button></div><LegacyCampaignApp/></div>;
}

function NotFound(){return <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5 text-center"><p className="text-sm font-bold text-indigo-600">404</p><h1 className="mt-2 text-4xl font-black">Page not found</h1><button onClick={()=>navigate('/')} className="mt-6 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Back to Jobryn</button></div>}
