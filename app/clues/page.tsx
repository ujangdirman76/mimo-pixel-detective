'use client';

import { useGameStore } from '@/lib/store/gameStore';
import Link from 'next/link';

export default function CluesPage() {
  const { clues } = useGameStore();

  if (!clues || clues.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-red-400 mb-4">No Clues Found</h2>
        <Link href="/suspects" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Back to Suspects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">🔎 Evidence Board</h1>
        <p className="text-slate-400">Review all clues and evidence collected</p>
      </div>

      {/* Clues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {clues.map((clue, idx) => (
          <div
            key={clue.id}
            className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700 hover:border-yellow-400 transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">🔍</div>
              <span className="text-xs font-bold text-yellow-400 bg-yellow-400/20 px-2 py-1 rounded">
                Clue #{idx + 1}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-200 mb-2">{clue.title}</h3>

            <div className="space-y-3 mb-4">
              <div>
                <span className="text-xs text-slate-400 uppercase">Description</span>
                <p className="text-slate-300 mt-1">{clue.description}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase">Location</span>
                <p className="text-slate-300 mt-1">{clue.location}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 uppercase">Significance</span>
                <p className="text-slate-300 mt-1">{clue.significance}</p>
              </div>
            </div>

            {clue.isRedHerring && (
              <div className="bg-red-500/20 border border-red-500 rounded p-2 text-xs text-red-300">
                ⚠️ This might be a red herring!
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Analysis Section */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">📊 Clue Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-400">{clues.length}</div>
            <p className="text-slate-400 text-sm mt-1">Total Clues</p>
          </div>
          
          <div className="bg-slate-900 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-400">
              {clues.filter(c => c.isRedHerring).length}
            </div>
            <p className="text-slate-400 text-sm mt-1">Red Herrings</p>
          </div>
          
          <div className="bg-slate-900 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400">
              {clues.filter(c => !c.isRedHerring).length}
            </div>
            <p className="text-slate-400 text-sm mt-1">Real Evidence</p>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <h3 className="font-bold text-slate-300 mb-2">💡 Tips for Analysis</h3>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>• Look for clues that connect multiple suspects</li>
            <li>• Consider which evidence contradicts alibis</li>
            <li>• Red herrings are designed to mislead you</li>
            <li>• Focus on physical evidence and witness statements</li>
          </ul>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Link
          href="/suspects"
          className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
        >
          ← Interrogate Suspects
        </Link>
        
        <Link
          href="/verdict"
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
        >
          Make Your Verdict →
        </Link>
      </div>

      {/* Progress */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Game Progress</span>
          <span className="text-yellow-400 font-bold">Step 3 of 5</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 w-3/5"></div>
        </div>
      </div>
    </div>
  );
}
