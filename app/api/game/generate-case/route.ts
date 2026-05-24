import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme = 'murder', difficulty = 'medium' } = body;

    // Mock case data for development
    const mockCase = {
      caseId: `case-${Date.now()}`,
      crimeScene: {
        id: `scene-${Date.now()}`,
        title: 'The Stolen Diamond Heist',
        location: 'Mansion Library',
        timeOfCrime: '10:30 PM',
        victimName: 'Lord Reginald Sterling',
        victimAge: 65,
        victimOccupation: 'Wealthy Collector',
        causeOfDeath: 'Blunt force trauma to the head',
        description: 'Lord Reginald was found dead in his private library. A valuable diamond from his collection is missing. The safe was opened from inside, suggesting the killer had access to the combination.',
        initialEvidence: [
          'Safe door left open',
          'Broken champagne glass near the body',
          'Muddy footprints leading to the garden',
          'A torn piece of fabric caught on the window latch',
        ],
      },
      suspects: [
        {
          id: 'suspect-1',
          name: 'James Butler',
          age: 45,
          occupation: 'Head Butler',
          relationship: 'Employee for 20 years',
          alibi: 'I was in the kitchen preparing late-night refreshments.',
          personality: 'Loyal and discreet, but recently had a dispute over wages.',
          avatar: '🎩',
          isGuilty: false,
        },
        {
          id: 'suspect-2',
          name: 'Victoria Sterling',
          age: 32,
          occupation: 'Art Dealer',
          relationship: 'Niece',
          alibi: 'I was in my room reading. I heard nothing unusual.',
          personality: 'Ambitious and charming, but heavily in debt.',
          avatar: '👩‍🎨',
          isGuilty: true,
        },
        {
          id: 'suspect-3',
          name: 'Dr. Marcus Webb',
          age: 58,
          occupation: 'Family Doctor',
          relationship: 'Close friend',
          alibi: 'I was in the study discussing investments with Lord Reginald until 10 PM.',
          personality: 'Calm and professional, but has a gambling addiction.',
          avatar: '👨‍⚕️',
          isGuilty: false,
        },
      ],
      clues: [
        {
          id: 'clue-1',
          title: 'Safe Combination',
          description: 'The safe was opened with the correct combination. Only family members knew it.',
          location: 'Library Safe',
          significance: 'Suggests the killer had inside knowledge.',
          isRedHerring: false,
        },
        {
          id: 'clue-2',
          title: 'Muddy Footprints',
          description: 'Large muddy footprints lead from the library to the garden.',
          location: 'Library Floor & Garden Path',
          significance: 'Could indicate an escape route or a distraction.',
          isRedHerring: true,
        },
        {
          id: 'clue-3',
          title: 'Torn Fabric',
          description: 'A piece of expensive silk fabric caught on the window latch.',
          location: 'Library Window',
          significance: 'Matches the dress Victoria was wearing that evening.',
          isRedHerring: false,
        },
        {
          id: 'clue-4',
          title: 'Champagne Glass',
          description: 'A broken champagne glass with lipstick marks near the body.',
          location: 'Library Floor',
          significance: 'Victoria wears the same shade of lipstick.',
          isRedHerring: false,
        },
        {
          id: 'clue-5',
          title: 'Forged Alibi',
          description: 'Dr. Webb admits he left at 9:45 PM, not 10 PM as he initially claimed.',
          location: 'Study',
          significance: 'A lie, but not necessarily proof of guilt.',
          isRedHerring: true,
        },
      ],
    };

    return NextResponse.json(mockCase);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate case' },
      { status: 500 }
    );
  }
}
