import { create } from 'zustand';
import { GameState, CrimeScene, Suspect, Clue, Interrogation, Verdict, JudgmentResult } from '@/lib/types/game';

interface GameStore extends GameState {
  // Actions
  startNewGame: () => Promise<void>;
  setCrimeScene: (scene: CrimeScene) => void;
  setSuspects: (suspects: Suspect[]) => void;
  setClues: (clues: Clue[]) => void;
  addInterrogation: (interrogation: Interrogation) => void;
  setVerdict: (verdict: Verdict) => void;
  setJudgment: (judgment: JudgmentResult) => void;
  setPhase: (phase: GameState['currentPhase']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetGame: () => void;
}

const initialState: GameState = {
  caseId: null,
  crimeScene: null,
  suspects: [],
  clues: [],
  interrogations: [],
  verdict: null,
  judgment: null,
  currentPhase: 'start',
  isLoading: false,
  error: null,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  startNewGame: async () => {
    set({ isLoading: true, error: null, currentPhase: 'crime-scene' });
    try {
      const response = await fetch('/api/game/generate-case', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme: 'murder', difficulty: 'medium' }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to generate case');
      
      set({
        caseId: data.caseId,
        crimeScene: data.crimeScene,
        suspects: data.suspects,
        clues: data.clues,
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false 
      });
    }
  },

  setCrimeScene: (scene) => set({ crimeScene: scene }),
  setSuspects: (suspects) => set({ suspects }),
  setClues: (clues) => set({ clues }),
  
  addInterrogation: (interrogation) =>
    set((state) => ({
      interrogations: [...state.interrogations, interrogation],
    })),

  setVerdict: (verdict) => set({ verdict, currentPhase: 'results' }),
  
  setJudgment: (judgment) => set({ judgment }),
  
  setPhase: (phase) => set({ currentPhase: phase }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),

  resetGame: () => set(initialState),
}));
