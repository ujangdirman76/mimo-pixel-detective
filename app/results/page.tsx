'use client';

import { useGameStore } from '@/lib/store/gameStore';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ResultsPage() {
  const { verdict, suspects, clues, interrogations, crimeScene, judgment, setJudgment, resetGame } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (verdict && !judgment) {
      evaluateVerdict();
    }
  }, [verdict, judgment]);

  const evaluateVerdict = async () => {
    if (!verdict) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/judge-verdict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: crimeScene?.id,
          accusedSuspectId: verdict.accusedSuspectId,
          reasoning: verdict.reasoning,
          evidence: clues,
          interrogations,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setJudgment(data);
      }
    } catch (error) {
      console.error('Failed to evaluate verdict:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="text-4xl mb-4">⚖️</div>
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">AI is Evaluating Your Verdict...</h2>
        <p className="text-slate-400">Analyzing your deduction and evidence usage...</p>
      </div>
    );
  }

  if (!verdict || !judgment) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-red-400 mb-4">No Verdict Found</h2>
        <Link href="/verdict" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Make Your Verdict
        </Link>
      </div>
    );
  }

  const accusedSuspect = suspects.find(s => s.id === verdict.accusedSuspectId);
  const correctSuspect = suspects.find(s => s.id === judgment.correctSuspectId);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">📊 Case Results</h1>
        <p className="text-slate-400">AI Judgment & Analysis</p>
      </div>

      {/* Verdict Result */}
      <div className={`rounded-lg p-8 mb-8 border-4 ${
        judgment.isCorrect 
          ? 'bg-green-500/20 border-green-400' 
          : 'bg-red-500/20 border-red-400'
      }`}>
        <div className="text-center">
          <div className="text-6xl mb-4">{judgment.isCorrect ? '✅' : '❌'}</div>
          <h2 className="text-3xl font-bold mb-2">
            {judgment.isCorrect ? 'Correct!' : 'Incorrect'}
          </h2>
          <p className="text-xl text-slate-300">
            {judgment.isCorrect 
              ? `You correctly identified ${correctSuspect?.name} as the culprit!`
              : `The real culprit was ${correctSuspect?.name}, not ${accusedSuspect?.name}`
            }
          </p>
        </div>
      </div>

      {/* Score */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">🎯 Your Score</h2>
        
        <div className="flex items-center justify-center mb-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-400">{judgment.score}</div>
            <p className="text-slate-400">out of 100</p>
          </div>
        </div>

        <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-yellow-400 to-green-400 transition-all duration-1000"
            style={{ width: `${judgment.score}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>

      {/* Detailed Feedback */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">💬 AI Feedback</h2>
        
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-6">
          <p className="text-slate-300 leading-relaxed">{judgment.feedback}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold text-slate-300 mb-2">🧠 Deduction Quality</h3>
            <p className="text-slate-400">{judgment.deductionQuality}</p>
          </div>

          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h3 className="font-bold text-slate-300 mb-2">🔍 Evidence Usage</h3>
            <p className="text-slate-400">{judgment.evidenceUsage}</p>
          </div>
        </div>

        <div className="mt-4 bg-slate-900 p-4 rounded-lg border border-slate-700">
          <h3 className="font-bold text-slate-300 mb-2">⭐ Logic Rating</h3>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-2xl">
                {star <= judgment.logicRating ? '⭐' : '☆'}
              </span>
            ))}
            <span className="text-slate-400 ml-2">
              {judgment.logicRating} / 5
            </span>
          </div>
        </div>
      </div>

      {/* Your Reasoning */}
      <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">📝 Your Reasoning</h2>
        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
          <p className="text-slate-300 whitespace-pre-wrap">{verdict.reasoning}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          onClick={() => {
            resetGame();
            window.location.href = '/crime-scene';
          }}
          className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition text-lg"
        >
          🔄 Play Again
        </button>
        
        <Link
          href="/"
          className="px-8 py-4 bg-slate-700 text-slate-300 font-bold rounded-lg hover:bg-slate-600 transition text-lg text-center"
        >
          🏠 Back to Home
        </Link>
      </div>

      {/* Progress */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Game Progress</span>
          <span className="text-green-400 font-bold">Complete! ✅</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-green-400 w-full"></div>
        </div>
      </div>
    </div>
  );
}
