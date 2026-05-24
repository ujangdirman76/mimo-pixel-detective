// API Client for MiMo Pixel Detective

const MIMO_API_BASE = process.env.NEXT_PUBLIC_MIMO_API_BASE || 'https://token-plan-sgp.xiaomimomo.com/v1';
const GROQ_API_BASE = process.env.NEXT_PUBLIC_GROQ_API_BASE || 'https://api.groq.com/openai/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface GenerateCaseRequest {
  theme?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface GenerateCaseResponse {
  caseId: string;
  crimeScene: any;
  suspects: any[];
  clues: any[];
}

interface InterrogateRequest {
  suspectId: string;
  question: string;
  caseContext: string;
}

interface InterrogateResponse {
  answer: string;
  emotion: 'neutral' | 'nervous' | 'angry' | 'sad' | 'evasive';
  truthfulness: number; // 0-100
}

interface JudgeVerdictRequest {
  caseId: string;
  accusedSuspectId: string;
  reasoning: string;
  evidence: any[];
  interrogations: any[];
}

interface JudgeVerdictResponse {
  isCorrect: boolean;
  correctSuspectId: string;
  score: number;
  feedback: string;
  deductionQuality: string;
  evidenceUsage: string;
  logicRating: number;
}

class GameApiClient {
  private async callApi<T>(
    endpoint: string,
    options: RequestInit = {},
    useFallback: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      const baseUrl = useFallback ? GROQ_API_BASE : MIMO_API_BASE;
      const apiKey = useFallback 
        ? process.env.NEXT_PUBLIC_GROQ_API_KEY
        : process.env.NEXT_PUBLIC_MIMO_API_KEY;

      if (!apiKey && !useFallback) {
        // Use mock data for development
        return this.getMockResponse<T>(endpoint);
      }

      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        if (!useFallback) {
          // Try fallback
          return this.callApi<T>(endpoint, options, true);
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API call failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private getMockResponse<T>(endpoint: string): ApiResponse<T> {
    // Mock responses for development
    const mockData: Record<string, any> = {
      '/generate-case': {
        caseId: 'mock-case-001',
        crimeScene: {
          title: 'The Stolen Diamond',
          location: 'Mansion Library',
          timeOfCrime: '10:00 PM',
          victimName: 'Lord Reginald',
          causeOfDeath: 'Blunt force trauma',
          description: 'A valuable diamond was stolen during a party.'
        },
        suspects: [
          { id: 's1', name: 'Butler James', occupation: 'Butler', isGuilty: false },
          { id: 's2', name: 'Lady Victoria', occupation: 'Socialite', isGuilty: true },
          { id: 's3', name: 'Dr. Watson', occupation: 'Doctor', isGuilty: false },
        ],
        clues: [
          { id: 'c1', title: 'Broken Window', description: 'Window was broken from inside', isRedHerring: false },
          { id: 'c2', title: 'Muddy Footprints', description: 'Footprints lead to garden', isRedHerring: true },
          { id: 'c3', title: 'Missing Key', description: 'Safe key is missing', isRedHerring: false },
        ]
      },
      '/interrogate': {
        answer: 'I was in the kitchen preparing dinner at that time.',
        emotion: 'neutral',
        truthfulness: 85
      },
      '/judge-verdict': {
        isCorrect: true,
        correctSuspectId: 's2',
        score: 85,
        feedback: 'Good deduction! You correctly identified the culprit.',
        deductionQuality: 'Excellent',
        evidenceUsage: 'Good use of evidence',
        logicRating: 4
      }
    };

    const data = mockData[endpoint] || {};
    return { success: true, data };
  }

  async generateCase(request: GenerateCaseRequest): Promise<ApiResponse<GenerateCaseResponse>> {
    return this.callApi<GenerateCaseResponse>('/generate-case', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async interrogate(request: InterrogateRequest): Promise<ApiResponse<InterrogateResponse>> {
    return this.callApi<InterrogateResponse>('/interrogate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async judgeVerdict(request: JudgeVerdictRequest): Promise<ApiResponse<JudgeVerdictResponse>> {
    return this.callApi<JudgeVerdictResponse>('/judge-verdict', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const gameApi = new GameApiClient();
