import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { suspectId, question, caseContext } = body;

    // Mock responses based on suspect ID
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

    // Pick a random response
    const randomIndex = Math.floor(Math.random() * responses.length);
    const answer = responses[randomIndex];
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const truthfulness = suspectId === 'suspect-2' ? 40 : 85; // Victoria is less truthful

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
