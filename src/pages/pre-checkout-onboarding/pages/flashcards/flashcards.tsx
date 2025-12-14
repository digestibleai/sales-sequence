import React, { useState } from 'react';
import './flashcards.css';

interface FlashcardsProps {
  onNext?: () => void;
}

const Flashcards = ({ onNext }: FlashcardsProps): React.ReactNode => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const flipCard = (cardIndex: number) => {
    const wasFlipped = flippedCards.has(cardIndex);

    if (activeCard !== null && activeCard !== cardIndex) {
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(activeCard);
        return newSet;
      });
    }

    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (wasFlipped) {
        newSet.delete(cardIndex);
      } else {
        newSet.add(cardIndex);
      }
      return newSet;
    });

    setActiveCard(wasFlipped ? null : cardIndex);
  };

  const flashcards = [
    { term: 'Specificity', definition: 'Be precise about what you want. Instead of "write content," say "write a 300-word blog intro about AI tools for marketers in a conversational tone."' },
    { term: 'Clear Task', definition: 'Define the exact action and format. "Analyze" is vague - "Identify the top 3 trends with percentages" is clear and actionable.' },
    { term: 'Context', definition: 'Provide background: audience level, purpose, constraints. "Explain for a 10-year-old" vs. "Explain for a PhD student" yields completely different results.' }
  ];

  return (
    <div className="flashcards-wrapper">
      <div className="flashcards-content">
        <div className="flashcards-section">
          <h1 className="flashcards-heading">The Secret to 10x Better AI Results</h1>
          <p className="flashcards-subheading">Master prompting in 3 minutes with these real-world examples</p>
        </div>

        <div className="flashcard-container">
          <div className="flashcard-header">
            <div className="flashcard-icon">🎴</div>
            <div className="flashcard-title">Three Pillars of Great Prompts</div>
          </div>

          <div className="flashcard-grid">
            {flashcards.map((card, index) => (
              <div
                key={index}
                className={`flashcard ${flippedCards.has(index) ? 'flipped' : ''} ${activeCard === index ? 'spotlight' : ''} ${activeCard !== null && activeCard !== index ? 'blurred' : ''}`}
                onClick={() => flipCard(index)}
              >
                <div className="flashcard-inner">
                  <div className="flashcard-front">
                    <div className="flashcard-term">{card.term}</div>
                    <div className="flashcard-hint">Click to reveal</div>
                  </div>
                  <div className="flashcard-back">
                    <div className="flashcard-definition">{card.definition}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flashcard-instruction">💡 Click any card to see examples</div>
          <button className="next-btn" onClick={onNext}>Next: Practice with Real Scenarios →</button>
        </div>

      </div>
    </div>
  );
};

export { Flashcards };
