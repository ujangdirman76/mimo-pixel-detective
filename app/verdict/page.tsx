'use client';

import { useGameStore } from '@/lib/store/gameStore';
import Link from 'next/link';
import { useState } from 'react';

export default function VerdictPage() {
  const { suspects, setVerdict } = useGameStore();
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitVerdict = async () => {
    if (!selectedSuspect || !reasoning.trim()) return;

    setIsSubmitting(true);
    try {
      setVerdict({
        accusedSuspectId: selectedSuspect,
        reasoning,
        confidence: 75, // Default confidence
      });
    } catch (error) {
      console.error('Failed to submit verdict:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSuspectData = suspects.find(s => s.id === selectedSuspect);

  if (!suspects || suspects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-red-400 mb-4">No Suspects Found</h2>
        <Link href="/clues" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Back to Clues
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">⚖️ Make Your Verdict</h1>
        <p className="text-slate-400">Accuse the suspect you believe is guilty</p>
      </div>

      {/* Suspect Selection */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">👥 Select the Culprit</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suspects.map((suspect) => (
            <button
              key={suspect.id}
              onClick={() => setSelectedSuspect(suspect.id)}
              className={`p-6 rounded-lg border-2 transition ${
                selectedSuspect === suspect.id
                  ? 'bg-red-500/20 border-red-400'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-4xl mb-2">{suspect.avatar}</div>
              <h3 className="text-lg font-bold text-slate-200 mb-1">{suspect.name}</h3>
              <p className="text-slate-400 text-sm mb-2">{suspect.occupation}</p>
              <p className="text-slate-500 text-xs">{suspect.relationship}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Suspect */}
      {selectedSuspectData && (
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-red-400">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{selectedSuspectData.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold text-red-400">You are accusing:</h2>
              <h3 className="text-3xl font-bold text-slate-200">{selectedSuspectData.name}</h3>
            </div>
          </div>
          
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h4 className="font-bold text-slate-300 mb-2">📝 Alibi</h4>
            <p className="text-slate-400">{selectedSuspectData.alibi}</p>
          </div>
        </div>
      )}

      {/* Reasoning Input */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">💭 Explain Your Reasoning</h2>
        <p className="text-slate-400 mb-4">
          Explain why you think this suspect is guilty. The AI will evaluate your logic.
        </p>
        
        <textarea
          value={reasoning}
          onChange={(e) => setReasoning(e.target.value)}
          placeholder="I believe [Suspect Name] is guilty because...
• Evidence 1: ...
• Evidence 2: ...
• Motive: ...
• Opportunity: ..."
          className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-yellow-400 focus:outline-none resize-none"
          rows={8}
          disabled={isSubmitting}
        />
        
        <div className="mt-4 text-sm text-slate-500">
          <p>💡 Tips for good reasoning:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Reference specific evidence from the clues</li>
            <li>Explain how evidence contradicts the suspect's alibi</li>
            <li>Consider motive and opportunity</li>
            <li>Address why other suspects are less likely</li>
          </ul>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center mb-8">
        <button
          onClick={handleSubmitVerdict}
          disabled={!selectedSuspect || !reasoning.trim() || isSubmitting}
          className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '⏳ Submitting...' : '🚨 Submit Verdict'}
        </button>
        
        {(!selectedSuspect || !reasoning.trim()) && (
          <p className="text-slate-500 text-sm mt-2">
            Please select a suspect and explain your reasoning to submit
          </p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Link
          href="/clues"
          className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
        >
          ← Review Clues
        </Link>
        
        <Link
          href="/results"
          className="px-6 py-3 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-600 transition"
        >
          See Results →
        </Link>
      </div>

      {/* Progress */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Game Progress</span>
          <span className="text-yellow-400 font-bold">Step 4 of 5</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 w-4/5"></div>
        </div>
      </div>
    </div>
  );
}
