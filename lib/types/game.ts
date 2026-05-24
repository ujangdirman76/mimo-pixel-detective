// Game Types for MiMo Pixel Detective

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  relationship: string;
  alibi: string;
  personality: string;
  avatar: string;
  isGuilty: boolean;
}

export interface Clue {
  id: string;
  title: string;
  description: string;
  location: string;
  significance: string;
  isRedHerring: boolean;
}

export interface CrimeScene {
  id: string;
  title: string;
  location: string;
  timeOfCrime: string;
  victimName: string;
  victimAge: number;
  victimOccupation: string;
  causeOfDeath: string;
  description: string;
  initialEvidence: string[];
}

export interface Interrogation {
  suspectId: string;
  question: string;
  answer: string;
  timestamp: number;
}

export interface Verdict {
  accusedSuspectId: string;
  reasoning: string;
  confidence: number;
}

export interface JudgmentResult {
  isCorrect: boolean;
  correctSuspectId: string;
  score: number;
  feedback: string;
  deductionQuality: string;
  evidenceUsage: string;
  logicRating: number;
}

export interface GameState {
  caseId: string | null;
  crimeScene: CrimeScene | null;
  suspects: Suspect[];
  clues: Clue[];
  interrogations: Interrogation[];
  verdict: Verdict | null;
  judgment: JudgmentResult | null;
  currentPhase: 'start' | 'crime-scene' | 'suspects' | 'clues' | 'verdict' | 'results';
  isLoading: boolean;
  error: string | null;
}
