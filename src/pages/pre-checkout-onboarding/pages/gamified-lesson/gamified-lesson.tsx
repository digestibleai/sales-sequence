import React, { useState } from 'react';
import './gamified-lesson.css';

interface GamifiedLessonProps {
  onComplete?: () => void;
}

const GamifiedLesson = ({ onComplete }: GamifiedLessonProps): React.ReactNode => {
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: boolean}>({});

  const totalQuestions = 2;

  const checkAnswer = (isCorrect: boolean, questionNum: number) => {
    if (answeredQuestions.has(questionNum)) return;

    setAnsweredQuestions(prev => new Set(prev).add(questionNum));
    setSelectedAnswers(prev => ({ ...prev, [questionNum]: isCorrect }));

    if (isCorrect) {
      const newCorrectCount = correctAnswers + 1;
      setCorrectAnswers(newCorrectCount);
    }

    // Check if all questions are answered (after state update)
    const newAnsweredCount = answeredQuestions.size + 1;
    if (newAnsweredCount === totalQuestions) {
      setTimeout(() => {
        document.getElementById('completionSection')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1000);
    }
  };

  const getBrainNeurons = () => {
    const neurons: string[] = [];
    const connections: string[] = [];

    if (correctAnswers >= 1) {
      neurons.push('neuron1', 'neuron2', 'neuron3', 'neuron10', 'neuron11');
      connections.push('conn1', 'conn2', 'conn11', 'conn12');
    }
    if (correctAnswers >= 2) {
      neurons.push('neuron4', 'neuron5', 'neuron6', 'neuron12', 'neuron13', 'neuron14', 'neuron7', 'neuron8', 'neuron9', 'neuron15', 'neuron16', 'neuron17', 'neuron18');
      connections.push('conn3', 'conn4', 'conn5', 'conn6', 'conn13', 'conn14', 'conn15', 'conn21', 'conn7', 'conn8', 'conn9', 'conn10', 'conn16', 'conn17', 'conn18', 'conn19', 'conn20', 'conn22');
    }

    return { neurons, connections };
  };

  const { neurons: activeNeurons, connections: activeConnections } = getBrainNeurons();
  const progressPercent = (correctAnswers / totalQuestions) * 100;

  const feedbackMessages = [
    {
      success: 'This prompt includes specificity (3 sentences, professional tone) and clear context (declining while maintaining relationships). AI knows exactly what to deliver!',
      error: 'This prompt is too vague. AI doesn\'t know the tone, length, or purpose. You\'d likely get something generic that needs heavy editing.'
    },
    {
      success: 'Perfect! This prompt has a clear task (analyze), specific output (top 3 trends), and context (Q3, with numbers). No guessing needed!',
      error: 'Too generic! AI doesn\'t know what to look for, what time period, or what format you want. You\'d waste time clarifying.'
    }
  ];

  const quizzes = [
    { icon: '✉️', title: 'Scenario 1: Email Writing', question: 'You need to decline a meeting invitation. Which prompt works better?', options: ['Write an email', 'Write a 3-sentence professional email declining a meeting, keeping the relationship warm'] },
    { icon: '📊', title: 'Scenario 2: Data Analysis', question: 'You have a sales spreadsheet to review. Which prompt works better?', options: ['Look at this spreadsheet', 'Analyze this sales data for the top 3 revenue trends in Q3 with specific numbers'] }
  ];

  return (
    <div className="gamified-lesson-wrapper">
      <div className="brain-tracker">
        <div className="brain-container">
          <svg className="brain-svg" viewBox="0 0 120 100">
            <path className="brain-outline" d="M 25 40 Q 20 25, 30 15 Q 45 5, 55 10 Q 58 8, 62 10 Q 72 5, 87 15 Q 97 25, 92 40 Q 95 50, 92 60 Q 90 75, 75 85 Q 65 90, 60 88 Q 55 90, 45 85 Q 30 75, 28 60 Q 25 50, 25 40 Z"/>
            <path className="brain-outline" d="M 60 10 Q 60 30, 60 88" strokeDasharray="3,3" />

            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map(num => {
              const positions: {[key: number]: {cx: number, cy: number}} = {
                1: {cx: 35, cy: 25}, 2: {cx: 45, cy: 22}, 3: {cx: 32, cy: 38},
                4: {cx: 42, cy: 40}, 5: {cx: 50, cy: 35}, 6: {cx: 38, cy: 52},
                7: {cx: 48, cy: 55}, 8: {cx: 40, cy: 68}, 9: {cx: 50, cy: 70},
                10: {cx: 72, cy: 22}, 11: {cx: 82, cy: 25}, 12: {cx: 75, cy: 40},
                13: {cx: 67, cy: 35}, 14: {cx: 85, cy: 38}, 15: {cx: 69, cy: 55},
                16: {cx: 79, cy: 52}, 17: {cx: 67, cy: 70}, 18: {cx: 77, cy: 68}
              };
              return (
                <circle
                  key={`neuron${num}`}
                  className={`neuron ${activeNeurons.includes(`neuron${num}`) ? 'active' : 'inactive'}`}
                  id={`neuron${num}`}
                  cx={positions[num].cx}
                  cy={positions[num].cy}
                  r="3.5"
                />
              );
            })}

            {[
              {id: 1, x1: 35, y1: 25, x2: 45, y2: 22},
              {id: 2, x1: 35, y1: 25, x2: 32, y2: 38},
              {id: 3, x1: 45, y1: 22, x2: 50, y2: 35},
              {id: 4, x1: 32, y1: 38, x2: 42, y2: 40},
              {id: 5, x1: 42, y1: 40, x2: 50, y2: 35},
              {id: 6, x1: 42, y1: 40, x2: 38, y2: 52},
              {id: 7, x1: 50, y1: 35, x2: 48, y2: 55},
              {id: 8, x1: 38, y1: 52, x2: 48, y2: 55},
              {id: 9, x1: 38, y1: 52, x2: 40, y2: 68},
              {id: 10, x1: 48, y1: 55, x2: 50, y2: 70},
              {id: 11, x1: 72, y1: 22, x2: 82, y2: 25},
              {id: 12, x1: 72, y1: 22, x2: 67, y2: 35},
              {id: 13, x1: 82, y1: 25, x2: 85, y2: 38},
              {id: 14, x1: 67, y1: 35, x2: 75, y2: 40},
              {id: 15, x1: 75, y1: 40, x2: 85, y2: 38},
              {id: 16, x1: 75, y1: 40, x2: 79, y2: 52},
              {id: 17, x1: 67, y1: 35, x2: 69, y2: 55},
              {id: 18, x1: 69, y1: 55, x2: 79, y2: 52},
              {id: 19, x1: 69, y1: 55, x2: 67, y2: 70},
              {id: 20, x1: 79, y1: 52, x2: 77, y2: 68},
              {id: 21, x1: 50, y1: 35, x2: 67, y2: 35},
              {id: 22, x1: 48, y1: 55, x2: 69, y2: 55}
            ].map(conn => (
              <line
                key={`conn${conn.id}`}
                className={`connection ${activeConnections.includes(`conn${conn.id}`) ? 'active' : ''}`}
                id={`conn${conn.id}`}
                x1={conn.x1}
                y1={conn.y1}
                x2={conn.x2}
                y2={conn.y2}
              />
            ))}
          </svg>

          <div className="brain-info">
            <div className="brain-title">🧠 Mastering AI Communication</div>
            <div className="brain-progress"><span id="correctCount">{correctAnswers}</span> of {totalQuestions} prompting principles learned</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="lesson-content">
        <div className="lesson-section">
          <h1 className="lesson-heading">Practice with Real Scenarios</h1>
        </div>

        {quizzes.map((quiz, qIndex) => {
          const questionNum = qIndex + 1;
          const isAnswered = answeredQuestions.has(questionNum);
          const wasCorrect = selectedAnswers[questionNum];

          return (
            <div key={questionNum} className="quiz-container">
              <div className="quiz-header">
                <div className="quiz-icon">{quiz.icon}</div>
                <div className="quiz-title">{quiz.title}</div>
              </div>

              <div className="quiz-question">{quiz.question}</div>

              <div className="quiz-options">
                {quiz.options.map((option, optionIndex) => {
                  const isCorrect = optionIndex === 1;
                  const wasSelected = isAnswered && ((wasCorrect && isCorrect) || (!wasCorrect && !isCorrect));

                  return (
                    <div
                      key={optionIndex}
                      className={`quiz-option ${isAnswered ? 'disabled' : ''} ${wasSelected && isCorrect ? 'correct' : ''} ${wasSelected && !isCorrect ? 'incorrect' : ''}`}
                      onClick={() => !isAnswered && checkAnswer(isCorrect, questionNum)}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>

              <div id={`feedback${questionNum}`} className={`quiz-feedback ${isAnswered ? 'show' : ''} ${wasCorrect ? 'success' : 'error'}`}>
                <div className="quiz-feedback-title">
                  {wasCorrect ? '✅ Correct!' : '❌ Not quite!'}
                </div>
                <div className="quiz-feedback-text">
                  {isAnswered ? (wasCorrect ? feedbackMessages[qIndex].success : feedbackMessages[qIndex].error) : ''}
                </div>
              </div>
            </div>
          );
        })}

        <div className="completion-section show" id="completionSection">
              <button className="cta-button" onClick={() => onComplete?.()}>Continue</button>
        </div>
      </div>
    </div>
  );
};

export { GamifiedLesson };
