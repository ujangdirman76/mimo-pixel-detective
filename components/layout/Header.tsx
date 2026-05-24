import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b-4 border-yellow-500 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <span className="text-3xl">🕵️‍♂️</span>
          <h1 className="text-2xl font-bold text-yellow-400">MiMo Pixel Detective</h1>
        </Link>
        
        <nav className="flex gap-6">
          <Link href="/" className="text-slate-300 hover:text-yellow-400 transition font-semibold">
            Home
          </Link>
          <Link href="/crime-scene" className="text-slate-300 hover:text-yellow-400 transition font-semibold">
            Play
          </Link>
        </nav>
      </div>
    </header>
  );
}
