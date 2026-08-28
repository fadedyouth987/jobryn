import React, { lazy, Suspense, useEffect } from 'react';
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

const LegacyCampaignApp = lazy(() => import('./LegacyCampaignApp'));

export default function App() {
  return <AuthProvider><Routes/></AuthProvider>;
}

function Routes() {
  const path=usePathname(); const auth=useAuth();
  if(path==='/')return <PublicHome/>;
  if(path==='/pricing')return <PricingPage/>;
  if(path==='/login'||path==='/signup')return <AuthEntry auth={auth}/>;
  if(path==='/auth/callback')return <AuthCallbackPage/>;
  if(path==='/forgot-password')return <ForgotPasswordPage/>;
  if(path==='/reset-password')return <ResetPasswordPage/>;
  if(path==='/payment-complete')return <PaymentOutcome complete/>;
  if(path==='/payment-cancelled')return <PaymentOutcome complete={false}/>;
  if(path==='/mfa')return <MfaPage/>;
  if(path==='/onboarding')return <OnboardingPage/>;
  if(path==='/app/campaigns/legacy')return <ProtectedLegacy auth={auth}/>;
  if(path.startsWith('/app'))return <AppShell/>;
  return <NotFound/>;
}

function AuthEntry({auth}:{auth:ReturnType<typeof useAuth>}) {
  useEffect(()=>{
    if (!auth.loading && auth.session) navigate(auth.workspaceId ? '/app' : '/onboarding', true);
  },[auth.loading,auth.session,auth.workspaceId]);
  if (auth.loading || auth.session) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Checking secure session…</div>;
  return <AuthPage/>;
}

function PaymentOutcome({complete}:{complete:boolean}){return <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5"><div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${complete?'bg-emerald-100 text-emerald-700':'bg-slate-100 text-slate-600'}`}>{complete?'✓':'—'}</div><p className="mt-5 text-sm font-bold uppercase tracking-wider text-indigo-600">Secure Stripe checkout</p><h1 className="mt-2 text-3xl font-black">{complete?'Payment submitted':'Payment cancelled'}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{complete?'Stripe is confirming the payment securely. The business records it only after receiving a signed confirmation from Stripe.':'No payment was recorded by Jobryn. You can return to the original payment link if you still need to pay.'}</p><p className="mt-6 text-xs text-slate-400">Jobryn does not receive or store your card number or security code.</p></div></div>}

function ProtectedLegacy({auth}:{auth:ReturnType<typeof useAuth>}) {
  useEffect(()=>{if(!auth.loading&&!auth.session)navigate('/login',true)},[auth.loading,auth.session]);
  if(auth.loading||!auth.session)return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">Checking session…</div>;
  return <div><div className="fixed right-4 top-4 z-[100] flex gap-2"><button onClick={()=>navigate('/app/campaigns')} className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-lg">Return to SaaS shell</button></div><Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">Loading retained Campaign OS…</div>}><LegacyCampaignApp/></Suspense></div>;
}

function NotFound(){return <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-5 text-center"><p className="text-sm font-bold text-indigo-600">404</p><h1 className="mt-2 text-4xl font-black">Page not found</h1><button onClick={()=>navigate('/')} className="mt-6 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white">Back to Jobryn</button></div>}
