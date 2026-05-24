'use client';

import { useGameStore } from '@/lib/store/gameStore';
import Link from 'next/link';
import { useState } from 'react';

export default function SuspectsPage() {
  const { suspects, addInterrogation, crimeScene } = useGameStore();
  const [selectedSuspect, setSelectedSuspect] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

  const handleAskQuestion = async () => {
    if (!question.trim() || !selectedSuspect) return;

    setIsAsking(true);
    try {
      const response = await fetch('/api/ai/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suspectId: selectedSuspect,
          question,
          caseContext: crimeScene?.description || '',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setCurrentAnswer(data.answer);
        addInterrogation({
          suspectId: selectedSuspect,
          question,
          answer: data.answer,
          timestamp: Date.now(),
        });
        setQuestion('');
      }
    } catch (error) {
      console.error('Failed to interrogate:', error);
    } finally {
      setIsAsking(false);
    }
  };

  const selectedSuspectData = suspects.find(s => s.id === selectedSuspect);

  if (!suspects || suspects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-red-400 mb-4">No Suspects Found</h2>
        <Link href="/crime-scene" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          Go to Crime Scene
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">👥 Interrogate Suspects</h1>
        <p className="text-slate-400">Ask questions to uncover the truth</p>
      </div>

      {/* Suspect Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {suspects.map((suspect) => (
          <button
            key={suspect.id}
            onClick={() => setSelectedSuspect(suspect.id)}
            className={`p-6 rounded-lg border-2 transition ${
              selectedSuspect === suspect.id
                ? 'bg-yellow-500/20 border-yellow-400'
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

      {/* Selected Suspect Details */}
      {selectedSuspectData && (
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-yellow-400">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-5xl">{selectedSuspectData.avatar}</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">{selectedSuspectData.name}</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Age:</span>
                  <span className="ml-2 text-slate-200">{selectedSuspectData.age}</span>
                </div>
                <div>
                  <span className="text-slate-400">Occupation:</span>
                  <span className="ml-2 text-slate-200">{selectedSuspectData.occupation}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Relationship:</span>
                  <span className="ml-2 text-slate-200">{selectedSuspectData.relationship}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Alibi */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 mb-4">
            <h3 className="text-sm font-bold text-slate-300 mb-2">📝 Alibi</h3>
            <p className="text-slate-400">{selectedSuspectData.alibi}</p>
          </div>

          {/* Personality */}
          <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
            <h3 className="text-sm font-bold text-slate-300 mb-2">🧠 Personality</h3>
            <p className="text-slate-400">{selectedSuspectData.personality}</p>
          </div>
        </div>
      )}

      {/* Interrogation Interface */}
      {selectedSuspect && (
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border-2 border-slate-700">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">💬 Ask a Question</h2>
          
          <div className="mb-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here..."
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-yellow-400 focus:outline-none resize-none"
              rows={3}
              disabled={isAsking}
            />
          </div>

          <button
            onClick={handleAskQuestion}
            disabled={!question.trim() || isAsking}
            className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAsking ? '⏳ Asking...' : '🔍 Ask Question'}
          </button>

          {/* Current Answer */}
          {currentAnswer && (
            <div className="mt-6 bg-slate-900 p-4 rounded-lg border border-slate-700">
              <h3 className="text-sm font-bold text-yellow-400 mb-2">
                {selectedSuspectData?.name}'s Response:
              </h3>
              <p className="text-slate-300">{currentAnswer}</p>
            </div>
          )}
        </div>
      )}

      {/* Quick Questions */}
      {selectedSuspect && (
        <div className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
          <h3 className="text-lg font-bold text-slate-300 mb-4">💡 Suggested Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Where were you at the time of the crime?",
              "What was your relationship with the victim?",
              "Did you see anything suspicious?",
              "Can anyone verify your alibi?",
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => setQuestion(q)}
                className="p-3 bg-slate-900 text-slate-300 text-sm rounded-lg hover:bg-slate-700 transition text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Link
          href="/crime-scene"
          className="px-6 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition"
        >
          ← Crime Scene
        </Link>
        
        <Link
          href="/clues"
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition"
        >
          Collect Clues →
        </Link>
      </div>

      {/* Progress */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-400">Game Progress</span>
          <span className="text-yellow-400 font-bold">Step 2 of 5</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-yellow-400 w-2/5"></div>
        </div>
      </div>
    </div>
  );
}
