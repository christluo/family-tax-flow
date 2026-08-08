import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STATE_NAMES, getStateConfig } from '@/lib/stateData';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2, Building2, Calculator } from 'lucide-react';

interface PageProps {
  params: Promise<{
    state: string;
  }>;
}

// 1. Tell Next.js to pre-render static HTML for all 50 states + DC at build time
export async function generateStaticParams() {
  return Object.keys(STATE_NAMES).map((state) => ({
    state: state.toLowerCase(),
  }));
}

// 2. Generate dynamic SEO Title and Meta Description for search engines
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const stateData = getStateConfig(resolvedParams.state);
  
  const title = `${stateData.name} 529 Tax Deduction & Paycheck Calculator | Family Tax-Flow`;
  const description = stateData.has529Deduction
    ? `Calculate your ${stateData.name} net take-home pay and optimize state tax deductions up to $${stateData.max529DeductionMFJ.toLocaleString()}/yr with ${stateData.planName}.`
    : `Calculate your ${stateData.name} paycheck allocations and college savings strategies. 100% private & client-side.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

// 3. Render the State pSEO Landing Page
export default async function StateCalculatorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const stateCode = resolvedParams.state ? resolvedParams.state.toLowerCase() : '';
  
  // Validate if the route parameter is a valid U.S. state
  if (!stateCode || !STATE_NAMES[stateCode]) {
    notFound();
  }

  const stateData = getStateConfig(stateCode);
  const maxMonthlyDeduction = (stateData.max529DeductionMFJ / 12).toFixed(0);
  const maxMonthlyTaxSavings = ((stateData.max529DeductionMFJ / 12) * stateData.stateTaxRateMax).toFixed(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      {/* HEADER / NAVIGATION */}
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" /> Back to Main App Engine
        </Link>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Private Client-Side Engine</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        
        {/* HERO CARD */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-5">
          <div className="flex items-center gap-2">
            <span className="bg-blue-50 text-blue-700 font-bold text-xs px-3 py-1 rounded-md border border-blue-100 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {stateData.name} State Tax Guide
            </span>
            {stateData.has529Deduction && (
              <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-md border border-emerald-100">
                Direct State Tax Deduction Available
              </span>
            )}
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {stateData.name} 529 Deduction & Paycheck Allocation Rules
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed">
            {stateData.summary}
          </p>

          {/* QUICK METRIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <span className="text-xs font-medium text-slate-500 block">State 529 Plan</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">{stateData.planName}</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <span className="text-xs font-medium text-slate-500 block">Max Annual Deduction (MFJ)</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {stateData.has529Deduction ? `$${stateData.max529DeductionMFJ.toLocaleString()}/yr` : 'N/A (No Deduction)'}
              </span>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
              <span className="text-xs font-medium text-emerald-700 block">Est. Max Monthly Tax Credit</span>
              <span className="text-sm font-bold text-emerald-900 mt-0.5 block">
                {stateData.has529Deduction ? `~$${maxMonthlyTaxSavings}/mo` : '$0/mo'}
              </span>
            </div>
          </div>
        </div>

        {/* STRATEGY & STEPS CARD */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-5">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Recommended Paycheck Waterfall for {stateData.name} Residents
          </h2>

          <ul className="space-y-3.5 text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Step 1: Dependent Care FSA:</strong> Maximize FICA (7.65%) and federal income tax savings on daycare costs up to $5,000/yr before other contributions.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Step 2: 401(k) Employer Match:</strong> Ensure you capture 100% of employer matching dollars prior to funding external college savings.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              {stateData.has529Deduction ? (
                <span><strong>Step 3: {stateData.name} 529 Target:</strong> Target a monthly contribution of <strong>${maxMonthlyDeduction}/mo</strong> into {stateData.planName} to max out state tax savings.</span>
              ) : (
                <span><strong>Step 3: {stateData.name} 529 Target:</strong> Contributions enjoy federal tax-free investment growth, though {stateData.name} does not offer a direct state tax deduction write-off.</span>
              )}
            </li>
          </ul>

          {/* CALL TO ACTION BUTTON */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              Run interactive sliders tailored specifically to your household W-2 income.
            </p>
            <Link 
              href={`/?state=${stateData.code}`}
              className="w-full sm:w-auto text-center bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-sm shrink-0"
            >
              Launch Interactive Engine for {stateData.name}
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}