'use client';

import { useGameStore } from '@/lib/store/gameStore';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CrimeScenePage() {
  const { crimeScene, suspects, isLoading, startNewGame } = useGameStore();

  useEffect(() => {
    if (!crimeScene) {
      startNewGame();
    }
  }, [crimeScene, startNewGame]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-4xl mb-4">🕵️‍♂️</div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Generating Your Mystery...</h2>
        <p className="text-slate-400">MiMo AI is creating a unique case for you...</p>
      </div>
    );
  }

  if (!crimeScene) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-red-400 mb-4">No Case Found</h2>
        <button
          onClick={() => startNewGame()}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Generate New Case
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Case Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">🔍 Crime Scene Investigation</h1>
        <p className="text-slate-400">Case ID: {crimeScene.id}</p>
      </div>

      {/* Crime Scene Details */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">📋 Case Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Crime Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-slate-400">Title:</span>
                <span className="ml-2 text-slate-200 font-semibold">{crimeScene.title}</span>
              </div>
              <div>
                <span className="text-slate-400">Location:</span>
                <span className="ml-2 text-slate-200 font-semibold">{crimeScene.location}</span>
              </div>
              <div>
                <span className="text-slate-400">Time of Crime:</span>
                <span className="ml-2 text-slate-200 font-semibold">{crimeScene.timeOfCrime}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Victim Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-slate-400">Name:</span>
                <span className="ml-2 text-slate-200 font-semibold">{crimeScene.victimName}</span>
              </div>
              <div>
                <span className="text-slate-400">Age:</span>
                <span className="ml-2 text-slate-200 font-semibold">{crimeScene.victimAge}</span>
              </div>
              <div>
                <span className="text-slate-400">Occupation:</span>
                <span className="ml-2 text-slate-200 font-semibold">{crimeScene.victimOccupation}</span>
              </div>
              <div>
                <span className="text-slate-400">Cause of Death:</span>
                <span className="ml-2 text-slate-200 font-semibold">{crimeScene.causeOfDeath}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Crime Description */}
        <div className="mt-6">
          <h3 className="text-xl font-bold text-slate-300 mb-2">📝 Crime Description</h3>
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <p className="text-slate-300 leading-relaxed">{crimeScene.description}</p>
          </div>
        </div>

        {/* Initial Evidence */}
        {crimeScene.initialEvidence && crimeScene.initialEvidence.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-slate-300 mb-2">🔦 Initial Evidence</h3>
            <ul className="list-disc pl-5 text-slate-300 space-y-1">
              {crimeScene.initialEvidence.map((evidence, idx) => (
                <li key={idx}>{evidence}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Suspects Preview */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">👥 Suspects</h2>
        <p className="text-slate-400 mb-4">You will interrogate these 3 suspects:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suspects.map((suspect) => (
            <div key={suspect.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
              <div className="text-3xl mb-2">{suspect.avatar}</div>
              <h3 className="text-lg font-bold text-slate-200 mb-1">{suspect.name}</h3>
              <p className="text-slate-400 text-sm mb-2">{suspect.occupation}</p>
              <p className="text-slate-500 text-xs">{suspect.relationship}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Link
          href="/"
          className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
        >
          ← Back to Home
        </Link>
        
        <Link
          href="/suspects"
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center gap-2"
        >
          Interrogate Suspects →
        </Link>
      </div>

      {/* Game Progress */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Game Progress</span>
          <span className="text-yellow-400 font-bold">Step 1 of 5</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 w-1/5"></div>
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Crime Scene</span>
          <span>Suspects</span>
          <span>Clues</span>
          <span>Verdict</span>
          <span>Results</span>
        </div>
      </div>
    </div>
  );
}
