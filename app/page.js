'use client';
import { useState, useEffect, useRef } from 'react';

function formatCount(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num;
}

export default function Home() {
  const [inputVal, setInputVal] = useState('vercel/next.js');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [report, setReport] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) heroRef.current.classList.add('animate-wipe');
  }, []);

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    let parts = e.target.value.replace(/https?:\/\/(www\.)?github\.com\//, '').split('/').filter(Boolean);
    setStatus(parts.length === 2 ? 'valid' : 'invalid');
  };

  const executeAudit = async (e) => {
    e.preventDefault();
    if (status === 'invalid') return setErrorMsg('Use user/repo format.');
    setStatus('loading');
    let [owner, repo] = inputVal.replace(/https?:\/\/(www\.)?github\.com\//, '').split('/').filter(Boolean);

    try {
      const res = await fetch(`/api/pulse?owner=${owner}&repo=${repo}`);
      const data = await res.json();
      if (!res.ok) { setErrorMsg(data.error); setStatus('invalid'); }
      else { setReport(data); setStatus('idle'); }
    } catch { setErrorMsg('Pipeline error.'); setStatus('invalid'); }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans relative p-4 md:p-8">
      <nav className="w-full flex justify-between items-center border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-12">
        <span className="font-mono font-bold tracking-tighter text-xl bg-[#CCFF00] px-2 border-2 border-black">⚡ GITPULSE</span>
      </nav>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl w-full mx-auto my-auto">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h1 ref={heroRef} className="font-mono text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9]">
            CHECK THE <br />
            <span className="bg-[#CCFF00] px-2 border-4 border-black inline-block my-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">PULSE</span> OF <br />
            ANY GITHUB REPO.
          </h1>
          <form onSubmit={executeAudit} className="w-full max-w-xl mt-4">
            <div className={`flex border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${status === 'invalid' ? 'bg-[#FFE0E0]' : status === 'valid' ? 'bg-[#EAFFD1]' : 'bg-white'}`}>
              <div className="p-4 font-bold bg-[#CCFF00] border-r-4 border-black">🔍</div>
              <input type="text" value={inputVal} onChange={handleInputChange} className="w-full p-4 font-mono bg-transparent outline-none" />
              <button type="submit" className="bg-black text-white font-mono font-bold px-6 border-l-4 border-black">
                {status === 'loading' ? 'CHECKING...' : 'RUN AUDIT'}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 w-full flex justify-center">
          <div className="w-full max-w-md bg-white border-4 border-black p-6 rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            <div className="absolute top-[-20px] left-[-15px] bg-[#B9FFB1] font-mono font-bold text-xs px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              SCORE: {report ? report.score.grade : 'A+'}
            </div>
            <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
              <span className="font-mono font-bold text-sm bg-gray-100 border-2 border-black px-2">{report ? report.repo.name : 'vercel/next.js'}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-4 border-black p-3 bg-white"><div className="text-2xl font-mono font-black">{report ? formatCount(report.metrics.contributors) : '312'}</div><div className="text-[10px] font-mono font-bold text-gray-500 uppercase">Contributors</div></div>
              <div className="border-4 border-black p-3 bg-[#FFDE6A]"><div className="text-2xl font-mono font-black">{report ? formatCount(report.metrics.openIssues) : '1.2K'}</div><div className="text-[10px] font-mono font-bold text-black uppercase">Open Issues</div></div>
              <div className="border-4 border-black p-3 bg-[#69C0FF]"><div className="text-2xl font-mono font-black">{report ? formatCount(report.metrics.stars) : '140K'}</div><div className="text-[10px] font-mono font-bold text-black uppercase">Stars</div></div>
              <div className="border-4 border-black p-3 bg-[#FF6B8B] text-white"><div className="text-2xl font-mono font-black">{report ? report.score.score + '%' : '100%'}</div><div className="text-[10px] font-mono font-bold text-white uppercase">Index</div></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
