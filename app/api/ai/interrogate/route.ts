import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
const MIMO_API_BASE = 'https://token-plan-sgp.xiaomimomo.com/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { suspectId, question, caseContext } = body;

    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const mimoKey = process.env.NEXT_PUBLIC_MIMO_API_KEY;

    // Try Groq first (primary)
    if (groqKey) {
      try {
        const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: 'mixtral-8x7b-32768',
            messages: [
              {
                role: 'system',
                content: `You are a suspect in a murder investigation. Respond in character based on this context: ${caseContext}. Keep responses brief (1-2 sentences). Include emotional cues in your response.`,
              },
              {
                role: 'user',
                content: question,
              },
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const answer = data.choices[0].message.content;
          const emotions: Array<'neutral' | 'nervous' | 'angry' | 'sad' | 'evasive'> = [
            'neutral', 'nervous', 'angry', 'sad', 'evasive'
          ];
          const emotion = emotions[Math.floor(Math.random() * emotions.length)];
          const truthfulness = suspectId === 'suspect-2' ? 40 : 85;

          return NextResponse.json({
            answer,
            emotion,
            truthfulness,
          });
        }
      } catch (groqError) {
        console.log('Groq API failed, trying MiMo fallback...');
      }
    }

    // Try MiMo fallback
    if (mimoKey) {
      try {
        const response = await fetch(`${MIMO_API_BASE}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mimoKey}`,
          },
          body: JSON.stringify({
            model: 'mimo-ai-v2.5-pro',
            messages: [
              {
                role: 'system',
                content: `You are a suspect in a murder investigation. Respond in character based on this context: ${caseContext}. Keep responses brief (1-2 sentences). Include emotional cues in your response.`,
              },
              {
                role: 'user',
                content: question,
              },
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const answer = data.choices[0].message.content;
          const emotions: Array<'neutral' | 'nervous' | 'angry' | 'sad' | 'evasive'> = [
            'neutral', 'nervous', 'angry', 'sad', 'evasive'
          ];
          const emotion = emotions[Math.floor(Math.random() * emotions.length)];
          const truthfulness = suspectId === 'suspect-2' ? 40 : 85;

          return NextResponse.json({
            answer,
            emotion,
            truthfulness,
          });
        }
      } catch (mimoError) {
        console.log('MiMo API also failed');
      }
    }

    // Fallback to mock data if both APIs fail
    const mockResponses: Record<string, string[]> = {
      'suspect-1': [
        "I was in the kitchen all evening, preparing refreshments for the guests.",
        "Lord Reginald was a fair employer. I have no reason to harm him.",
        "I did hear some raised voices from the library around 10 PM, but I thought nothing of it.",
        "The safe combination? Only family members knew it. I certainly didn't.",
        "Victoria seemed quite agitated that evening, but I can't say why.",
      ],
      'suspect-2': [
        "I was in my room reading. The walls are thick, I heard nothing.",
        "Uncle Reginald and I had a disagreement about my inheritance, but it was nothing serious.",
        "That piece of fabric? It must have torn earlier in the day. I was in the library earlier.",
        "I have financial troubles, yes, but I would never resort to violence.",
        "The diamond was beautiful, but I have my own collection. I didn't need it.",
      ],
      'suspect-3': [
        "I left at 9:45 PM, not 10 PM. I apologize for the confusion.",
        "Reginald and I were discussing his will. He was considering changes.",
        "I have a gambling problem, but Reginald was helping me with it.",
        "Victoria was the last person I saw with him. She seemed upset.",
        "The butler? He's been acting strangely lately, but I can't say why.",
      ],
    };

    const emotions: Array<'neutral' | 'nervous' | 'angry' | 'sad' | 'evasive'> = [
      'neutral', 'nervous', 'angry', 'sad', 'evasive'
    ];

    const responses = mockResponses[suspectId] || [
      "I don't know anything about that.",
      "I can't answer that question.",
      "You'll have to ask someone else.",
    ];

    const randomIndex = Math.floor(Math.random() * responses.length);
    const answer = responses[randomIndex];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const truthfulness = suspectId === 'suspect-2' ? 40 : 85;

    return NextResponse.json({
      answer,
      emotion,
      truthfulness,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process interrogation' },
      { status: 500 }
    );
  }
}
