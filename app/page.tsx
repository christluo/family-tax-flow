'use client';

import React, { useState, useMemo } from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export default function FamilyTaxFlowApp() {
  // --- 1. STATE INPUTS ---
  const [filingStatus, setFilingStatus] = useState('MFJ'); // 'MFJ' | 'Single'
  const [stateCode, setStateCode] = useState('VA');
  
  // Income Sliders
  const [primaryW2, setPrimaryW2] = useState(10000);
  const [spouseW2, setSpouseW2] = useState(6000);
  
  // Benefits Switches
  const [hasDepFSA, setHasDepFSA] = useState(true);
  const [matchPct, setMatchPct] = useState(5);
  
  // Kids & Fixed Expenses
  const [daycareCost, setDaycareCost] = useState(1500);
  const [housingCost, setHousingCost] = useState(2800);

  // --- 2. CALCULATIONS ENGINE (client-side memoized) ---
  const calculations = useMemo(() => {
    const totalGross = primaryW2 + (filingStatus === 'MFJ' ? spouseW2 : 0);
    
    // Stage 1: FSA FICA Bypass
    const fsaMonthly = hasDepFSA ? Math.min(daycareCost, 625) : 0;
    const ficaSavings = fsaMonthly * 0.0765;
    const incTaxSavings = fsaMonthly * 0.22; // Est 22% bracket
    const totalFsaTaxSavings = ficaSavings + incTaxSavings;
    
    // Stage 2: 401k Match
    const matchMonthly = totalGross * (matchPct / 100);
    
    // Stage 3: Virginia 529 Credit Cap
    const va529CapMonthly = stateCode === 'VA' ? 666.67 : 500;
    const va529TaxSavings = va529CapMonthly * 0.0575; // 5.75% state tax rate

    // Net Summary
    const totalTaxSaved = totalFsaTaxSavings + va529TaxSavings;
    const netTakeHome = totalGross - (fsaMonthly + matchMonthly + va529CapMonthly) + totalTaxSaved - (housingCost * 0.2);

    return {
      totalGross,
      fsaMonthly,
      totalFsaTaxSavings,
      matchMonthly,
      va529CapMonthly,
      totalTaxSaved,
      netTakeHome
    };
  }, [primaryW2, spouseW2, filingStatus, stateCode, hasDepFSA, daycareCost, matchPct, housingCost]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8">
      {/* HEADER / PRIVACY TRUST BANNER */}
      <header className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Family Tax-Flow Engine</h1>
          <p className="text-sm text-slate-500">Paycheck-to-Wealth Allocation Router</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Client-Side Math — Zero Server Data Saved</span>
        </div>
      </header>

      {/* MAIN 2-COLUMN CONTAINER */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: INPUT CONTROLS */}
        <section className="lg:col-span-5 space-y-4">
          
          {/* SECTION 1: PROFILE & STATE */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">1. Household Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Filing Status</label>
                <select 
                  value={filingStatus} 
                  onChange={(e) => setFilingStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="MFJ">Married Filing Jointly</option>
                  <option value="Single">Single / Head of Household</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">State Residence</label>
                <select 
                  value={stateCode} 
                  onChange={(e) => setStateCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="VA">Virginia (VA)</option>
                  <option value="NY">New York (NY)</option>
                  <option value="TX">Texas (TX - No Tax)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: GROSS INCOME SLIDERS */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-5">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">2. Gross Monthly Income</h2>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-600">Primary W-2 Gross</span>
                <span className="text-sm font-bold text-slate-900">${primaryW2.toLocaleString()}/mo</span>
              </div>
              <input 
                type="range" min="3000" max="25000" step="250"
                value={primaryW2}
                onChange={(e) => setPrimaryW2(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {filingStatus === 'MFJ' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-600">Spouse W-2 Gross</span>
                  <span className="text-sm font-bold text-slate-900">${spouseW2.toLocaleString()}/mo</span>
                </div>
                <input 
                  type="range" min="0" max="25000" step="250"
                  value={spouseW2}
                  onChange={(e) => setSpouseW2(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            )}
          </div>

          {/* SECTION 3: BENEFIT TOGGLES */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">3. Employer Benefits</h2>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-slate-600">Has Dependent Care FSA?</span>
              <input 
                type="checkbox" 
                checked={hasDepFSA} 
                onChange={(e) => setHasDepFSA(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-slate-600">401(k) Company Match</span>
                <span className="text-xs font-bold text-blue-600">{matchPct}% Match</span>
              </div>
              <input 
                type="range" min="0" max="10" step="1"
                value={matchPct}
                onChange={(e) => setMatchPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: STICKY OUTPUT DASHBOARD */}
        <section className="lg:col-span-7 space-y-6 lg:sticky lg:top-8 self-start">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md">
              <p className="text-xs text-slate-400 font-medium">Est. Net Take-Home</p>
              <h3 className="text-2xl font-extrabold mt-1">${calculations.netTakeHome.toLocaleString('en-US', {maximumFractionDigits: 0})}<span className="text-xs font-normal text-slate-400">/mo</span></h3>
            </div>
            <div className="bg-emerald-600 text-white rounded-xl p-5 shadow-md">
              <p className="text-xs text-emerald-100 font-medium">Monthly Tax Saved</p>
              <h3 className="text-2xl font-extrabold mt-1">${calculations.totalTaxSaved.toFixed(0)}<span className="text-xs font-normal text-emerald-100">/mo</span></h3>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-between">
              <span>Monthly Action Plan Waterfall</span>
              <span className="text-xs font-normal bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">Ranked by Tax Efficiency</span>
            </h2>

            <div className="space-y-3">
              {hasDepFSA && (
                <div className="flex items-start justify-between p-3.5 bg-blue-50/60 rounded-lg border border-blue-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 1</span>
                      <h4 className="text-sm font-bold text-slate-800">Dependent Care FSA</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Saves $47 FICA + $137 Federal Tax every month.</p>
                  </div>
                  <span className="text-sm font-bold text-blue-700">${calculations.fsaMonthly.toFixed(0)}/mo</span>
                </div>
              )}

              <div className="flex items-start justify-between p-3.5 bg-emerald-50/60 rounded-lg border border-emerald-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 2</span>
                    <h4 className="text-sm font-bold text-slate-800">401(k) Match Capture</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Captures 100% free employer matching money.</p>
                </div>
                <span className="text-sm font-bold text-emerald-700">${calculations.matchMonthly.toFixed(0)}/mo</span>
              </div>

              <div className="flex items-start justify-between p-3.5 bg-purple-50/60 rounded-lg border border-purple-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">STEP 3</span>
                    <h4 className="text-sm font-bold text-slate-800">{stateCode} 529 State Deduction Cap</h4>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Maxes out state income tax deduction limit.</p>
                </div>
                <span className="text-sm font-bold text-purple-700">${calculations.va529CapMonthly.toFixed(0)}/mo</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <span className="font-bold block text-amber-950">Marginal Bracket Threshold Alert</span>
              <p>Adding an extra <span className="font-semibold text-amber-950">$120/mo</span> into your pre-tax 401(k) drops your household taxable baseline below the 22% federal bracket line, saving an extra $26/mo in income tax.</p>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}