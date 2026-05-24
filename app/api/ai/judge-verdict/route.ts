import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
const MIMO_API_BASE = 'https://token-plan-sgp.xiaomimomo.com/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { caseId, accusedSuspectId, reasoning, evidence, interrogations } = body;

    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    const mimoKey = process.env.NEXT_PUBLIC_MIMO_API_KEY;

    // The correct suspect is 'suspect-2' (Victoria Sterling)
    const correctSuspectId = 'suspect-2';
    const isCorrect = accusedSuspectId === correctSuspectId;

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
                content: `You are a detective AI judging a murder case verdict. The correct culprit is suspect-2 (Victoria Sterling). Evaluate the player's accusation and reasoning. Provide: score (0-100), feedback, deduction quality, evidence usage, and logic rating (1-5).`,
              },
              {
                role: 'user',
                content: `Player accused: ${accusedSuspectId}\nReasoning: ${reasoning}\nIs correct: ${isCorrect}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices[0].message.content;
          
          // Parse AI response or use structured format
          let score = isCorrect ? 85 : 35;
          const reasoningLower = reasoning.toLowerCase();
          const goodKeywords = ['fabric', 'safe', 'combination', 'family', 'lipstick', 'champagne', 'debt', 'inheritance'];
          const keywordCount = goodKeywords.filter(kw => reasoningLower.includes(kw)).length;
          
          if (isCorrect) {
            score = 70 + (keywordCount * 3);
            score = Math.min(score, 100);
          }

          return NextResponse.json({
            isCorrect,
            correctSuspectId,
            score,
            feedback: aiResponse,
            deductionQuality: isCorrect ? 'Good work!' : 'Incorrect suspect',
            evidenceUsage: isCorrect ? 'Good use of evidence' : 'Key clues missed',
            logicRating: isCorrect ? 4 : 2,
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
                content: `You are a detective AI judging a murder case verdict. The correct culprit is suspect-2 (Victoria Sterling). Evaluate the player's accusation and reasoning. Provide: score (0-100), feedback, deduction quality, evidence usage, and logic rating (1-5).`,
              },
              {
                role: 'user',
                content: `Player accused: ${accusedSuspectId}\nReasoning: ${reasoning}\nIs correct: ${isCorrect}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const aiResponse = data.choices[0].message.content;
          
          let score = isCorrect ? 85 : 35;
          const reasoningLower = reasoning.toLowerCase();
          const goodKeywords = ['fabric', 'safe', 'combination', 'family', 'lipstick', 'champagne', 'debt', 'inheritance'];
          const keywordCount = goodKeywords.filter(kw => reasoningLower.includes(kw)).length;
          
          if (isCorrect) {
            score = 70 + (keywordCount * 3);
            score = Math.min(score, 100);
          }

          return NextResponse.json({
            isCorrect,
            correctSuspectId,
            score,
            feedback: aiResponse,
            deductionQuality: isCorrect ? 'Good work!' : 'Incorrect suspect',
            evidenceUsage: isCorrect ? 'Good use of evidence' : 'Key clues missed',
            logicRating: isCorrect ? 4 : 2,
          });
        }
      } catch (mimoError) {
        console.log('MiMo API also failed');
      }
    }

    // Fallback to rule-based judgment if both APIs fail

    // Calculate score based on correctness and reasoning quality
    let score = 0;
    let deductionQuality = '';
    let evidenceUsage = '';
    let feedback = '';
    let logicRating = 0;

    if (isCorrect) {
      // Base score for correct accusation
      score = 70;

      // Check reasoning quality
      const reasoningLower = reasoning.toLowerCase();
      const goodKeywords = ['fabric', 'safe', 'combination', 'family', 'lipstick', 'champagne', 'debt', 'inheritance'];
      const keywordCount = goodKeywords.filter(kw => reasoningLower.includes(kw)).length;

      score += keywordCount * 3; // Up to 24 points for evidence
      score = Math.min(score, 100);

      if (score >= 90) {
        deductionQuality = 'Excellent! You connected all the key evidence.';
        evidenceUsage = 'Outstanding use of physical evidence and motive analysis.';
        logicRating = 5;
        feedback = 'Perfect deduction! You correctly identified Victoria Sterling as the culprit and provided strong evidence: the torn silk fabric matching her dress, her knowledge of the safe combination as a family member, the lipstick on the champagne glass, and her financial motive. Your reasoning was logical and thorough.';
      } else if (score >= 75) {
        deductionQuality = 'Good work! You identified the key evidence.';
        evidenceUsage = 'Good use of evidence, though some connections could be stronger.';
        logicRating = 4;
        feedback = 'Well done! You correctly identified Victoria Sterling. Your reasoning included important evidence like the fabric and safe combination. To improve, consider connecting more clues together and explaining why other suspects are less likely.';
      } else {
        deductionQuality = 'Correct suspect, but reasoning could be stronger.';
        evidenceUsage = 'Some evidence mentioned, but analysis could be deeper.';
        logicRating = 3;
        feedback = 'You got the right suspect! Victoria Sterling is indeed guilty. However, your reasoning could be more detailed. Key evidence includes: the torn silk fabric from her dress, her knowledge of the safe combination as family, the lipstick-marked champagne glass, and her financial troubles providing motive.';
      }
    } else {
      // Wrong suspect
      score = Math.max(20, Math.floor(Math.random() * 30) + 20);
      deductionQuality = 'Incorrect suspect identified.';
      evidenceUsage = 'Evidence was misinterpreted or key clues were missed.';
      logicRating = 2;

      if (accusedSuspectId === 'suspect-1') {
        feedback = 'Incorrect. While James the butler had opportunity, he lacked motive and the key evidence points elsewhere. The torn silk fabric, lipstick on the champagne glass, and knowledge of the safe combination all point to Victoria Sterling, who had both motive (debt) and opportunity (family member with safe access).';
      } else if (accusedSuspectId === 'suspect-3') {
        feedback = 'Incorrect. Dr. Webb lied about his departure time, which is suspicious, but the physical evidence doesn\'t match. The torn silk fabric, lipstick marks, and safe combination knowledge all point to Victoria Sterling. Dr. Webb\'s gambling problem gave him motive, but he didn\'t have the same access as family members.';
      } else {
        feedback = 'The correct culprit was Victoria Sterling. Key evidence: torn silk fabric from her dress caught on the window, lipstick-marked champagne glass matching her shade, knowledge of safe combination as family member, and strong financial motive due to debt.';
      }
    }

    return NextResponse.json({
      isCorrect,
      correctSuspectId,
      score,
      feedback,
      deductionQuality,
      evidenceUsage,
      logicRating,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to judge verdict' },
      { status: 500 }
    );
  }
}
