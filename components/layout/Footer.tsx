import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-slate-800 border-t-4 border-yellow-500 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">🕵️‍♂️ MiMo Pixel Detective</h3>
            <p className="text-slate-400 text-sm">
              AI-powered detective game. Solve mysteries with MiMo AI V2.5 Pro.
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} MiMo Pixel Detective
            </p>
            <p className="text-slate-600 text-xs mt-1">
              Powered by Next.js 14 & MiMo AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
