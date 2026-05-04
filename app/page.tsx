import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fdfeff] text-slate-900 font-sans selection:bg-indigo-100 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 backdrop-blur-md bg-white/30 border-b border-slate-100">
        <div className="flex items-center gap-2">
          
        </div>
        <Link href="/login">
          <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-slate-200 tracking-wider">
           Sign in
          </button>
        </Link>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-12 pb-24 max-w-5xl mx-auto text-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative w-full max-w-[300px] aspect-square mb-12 overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
            <img 
              src="https://img.freepik.com/free-vector/hand-drawn-neuroeducation-illustration_23-2150945405.jpg?semt=ais_hybrid&w=740&q=80" 
              alt="Developer"
              className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
         IT <br/>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
          Study
          </span>
        </h1>
        
        <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-2xl mb-12 font-medium">
         Come join our creative space! It’s all about getting your hands dirty and learning by doing. 
         No boring lectures—just real skills to help us build the future we want.
        </p>

        <div className="w-full max-w-md px-4">
          <Link href="/register ">
            <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1">
              Sign Up
              <span className="bg-white/20 p-1 rounded-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              </span>
            </button>
          </Link>
          
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full text-sm font-bold text-amber-700 shadow-sm">
            <span>🔥</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-8 right-8 z-50">
        <button className="bg-white text-indigo-600 p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 hover:bg-indigo-50 transition-all hover:scale-110 active:scale-95 group">
          <svg className="group-hover:rotate-12 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
    </div>
  );
}