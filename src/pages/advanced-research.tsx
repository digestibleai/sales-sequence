import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Download, FileText, Lightbulb, RotateCcw } from "lucide-react";

type Screen = 1 | 2 | 3 | 4;

interface FlashcardData {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  correctFeedback: string;
  incorrectFeedback: string;
}

const flashcards: FlashcardData[] = [
  {
    front: "What is Chain-of-Thought Prompting?",
    back: "A technique where you ask the AI to explain its reasoning step-by-step before giving a final answer. This improves accuracy on complex problems by making the AI's thinking process explicit and verifiable."
  },
  {
    front: "What is Retrieval-Augmented Generation (RAG)?",
    back: "A method that combines AI language models with external knowledge retrieval. The AI first searches a database for relevant information, then uses that context to generate more accurate and up-to-date responses."
  },
  {
    front: "What are Few-Shot Examples?",
    back: "Providing the AI with 2-5 example inputs and desired outputs before asking your actual question. This teaches the AI the pattern you want without fine-tuning, dramatically improving response quality and consistency."
  },
  {
    front: "What is Prompt Chaining?",
    back: "Breaking complex tasks into multiple sequential prompts where each output feeds into the next prompt. This creates multi-step workflows that are more reliable than trying to solve everything in one prompt."
  }
];

const quizQuestions: QuizQuestion[] = [
  {
    question: "When should you use Chain-of-Thought prompting?",
    options: [
      "For simple factual questions",
      "For complex problems requiring multi-step reasoning",
      "Only when working with mathematical equations",
      "When you want shorter AI responses"
    ],
    correctAnswer: 1,
    correctFeedback: "Chain-of-Thought prompting excels at complex problems that benefit from step-by-step reasoning. It helps the AI break down complicated tasks and show its work, leading to more accurate and transparent results.",
    incorrectFeedback: "Simple tasks don't need chain of thought. Save it for complex problems that require multi-step reasoning and analysis, where seeing the AI's step-by-step thinking process adds real value."
  },
  {
    question: "What is the main advantage of RAG (Retrieval-Augmented Generation)?",
    options: [
      "It makes AI responses faster",
      "It allows AI to access current, specific information beyond its training data",
      "It reduces the cost of API calls",
      "It eliminates the need for prompts"
    ],
    correctAnswer: 1,
    correctFeedback: "RAG's key benefit is giving AI access to up-to-date information from external sources. This solves the problem of outdated training data and allows the AI to answer questions about recent events, proprietary documents, or specialized knowledge bases.",
    incorrectFeedback: "The main advantage of RAG is connecting AI to current, specific information beyond its training data. It's not about speed or cost - it's about accuracy and accessing knowledge the AI wasn't originally trained on."
  },
  {
    question: "How many examples should you typically provide in few-shot prompting?",
    options: [
      "At least 10-15 examples",
      "2-5 well-chosen examples",
      "Just 1 example is enough",
      "As many as possible, 20+"
    ],
    correctAnswer: 1,
    correctFeedback: "Research shows that 2-5 carefully selected examples hit the sweet spot. This is enough for the AI to understand the pattern without overwhelming the context window or adding unnecessary tokens. Quality matters more than quantity in few-shot learning.",
    incorrectFeedback: "Too many or too few examples can hurt performance. Research shows 2-5 well-chosen examples is optimal - enough to show the pattern clearly, but not so many that you waste tokens or dilute the signal with noise."
  }
];

function ProgressIndicator({ currentScreen }: { currentScreen: Screen }) {
  const steps = [1, 2, 3, 4];

  return (
    <div
      className="flex items-center justify-center max-w-[400px] mx-auto px-5"
      style={{ marginTop: '40px', marginBottom: '48px' }}
      role="progressbar"
      aria-label={`Progress: Step ${currentScreen} of 4`}
      aria-valuenow={currentScreen}
      aria-valuemin={1}
      aria-valuemax={4}
    >
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          {/* Circle */}
          <div
            className="flex items-center justify-center rounded-full transition-all duration-300 ease-in-out w-10 h-10 sm:w-14 sm:h-14 text-lg sm:text-2xl"
            style={{
              fontFamily: 'Poppins',
              fontWeight: step < currentScreen ? 700 : step === currentScreen ? 700 : 500,
              backgroundColor: step < currentScreen ? '#072D24' : step === currentScreen ? '#A8D5B7' : '#FFFFFF',
              border: step < currentScreen ? 'none' : step === currentScreen ? '2px solid #072D24' : '2px solid #E6D8B3',
              color: step < currentScreen ? '#FFFFFF' : step === currentScreen ? '#072D24' : '#6A7CA7'
            }}
            data-testid={`progress-step-${step}`}
          >
            {step < currentScreen ? '✓' : step}
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className="transition-all duration-300 ease-in-out w-10 sm:w-15"
              style={{
                height: '2px',
                backgroundColor: step < currentScreen ? '#A8D5B7' : '#E6D8B3'
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function FlashCard({ card, index }: { card: FlashcardData; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="relative h-64 cursor-pointer perspective-1000"
      data-testid={`flashcard-${index}`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""
          }`}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full backface-hidden"
        >
          <Card className="w-full h-full flex items-center justify-center p-6 bg-white border-2 border-border shadow-sm">
            <p className="text-center text-foreground font-normal" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {card.front}
            </p>
          </Card>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full backface-hidden rotate-y-180"
        >
          <Card className="w-full h-full flex items-center justify-center p-6 bg-card border-2 border-border shadow-sm">
            <p className="text-center text-foreground font-normal" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {card.back}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuizScreen({
  onComplete,
  score,
  setScore
}: {
  onComplete: () => void;
  score: number;
  setScore: (score: number) => void;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    setShowFeedback(true);

    const newAnswers = [...answers, index];
    setAnswers(newAnswers);

    if (index === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      onComplete();
    }
  };

  const currentQ = quizQuestions[currentQuestion];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-muted-foreground" style={{ lineHeight: '1.5' }} data-testid="text-question-number">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm font-medium text-muted-foreground" style={{ lineHeight: '1.5' }} data-testid="text-quiz-score">
            Score: {score}/{quizQuestions.length}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="mb-8 text-foreground font-medium" style={{ fontSize: '18px', lineHeight: '1.6' }}>
        {currentQ.question}
      </h3>

      <div className="space-y-4 mb-8">
        {currentQ.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectAnswer = index === currentQ.correctAnswer;
          const showAsCorrect = showFeedback && isCorrectAnswer;
          const showAsIncorrect = showFeedback && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left rounded-lg transition-all relative overflow-hidden ${selectedAnswer === null ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              style={{
                fontSize: '16px',
                padding: '18px 20px',
                lineHeight: '1.6',
                border: showAsCorrect
                  ? '2px solid #A8D5B7'
                  : showAsIncorrect
                    ? '2px solid #DC2626'
                    : selectedAnswer === null
                      ? '2px solid #072D24'
                      : '2px solid #E6D8B3',
                background: showAsCorrect
                  ? '#A8D5B7'
                  : showAsIncorrect
                    ? '#FEF2F2'
                    : selectedAnswer === null
                      ? '#FFFFFF'
                      : '#F5EFE0',
                color: showAsCorrect
                  ? '#072D24'
                  : showAsIncorrect
                    ? '#991B1B'
                    : selectedAnswer === null
                      ? '#072D24'
                      : '#6A7CA7'
              }}
              data-testid={`quiz-option-${index}`}
            >
              <span className="font-bold mr-2">{String.fromCharCode(65 + index)})</span>
              {option}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-lg mb-6"
          style={{
            padding: '24px',
            background: isCorrect ? '#A8D5B7' : '#FEF2F2',
            borderLeft: isCorrect ? '4px solid #072D24' : '4px solid #DC2626',
            color: isCorrect ? '#072D24' : '#991B1B'
          }}
          data-testid="quiz-feedback"
        >
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            {isCorrect ? "✓ Correct!" : "✗ Not quite."}
          </p>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            {isCorrect ? currentQ.correctFeedback : currentQ.incorrectFeedback}
          </p>
        </div>
      )}

      {showFeedback && (
        <Button
          onClick={handleNext}
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
          style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
          data-testid="button-next-question"
        >
          {currentQuestion < quizQuestions.length - 1 ? (
            <>
              Next Question
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          ) : (
            <>
              See My Results
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}

export default function AdvancedResearch() {
  // Always start at Screen 1 (no localStorage persistence for screen position)
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);

  // Keep quiz score in memory only (resets on page refresh)
  const [quizScore, setQuizScore] = useState(0);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentScreen]);

  const handleRestart = () => {
    setCurrentScreen(1);
    setQuizScore(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ProgressIndicator currentScreen={currentScreen} />

        {/* Screen 1: The Concept */}
        {currentScreen === 1 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight" style={{ fontSize: '48px', lineHeight: '1.15' }} data-testid="heading-concept">
              Advanced Research with AI
            </h1>

            <div className="max-w-none mb-8">
              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Take your AI skills to the next level by mastering advanced research techniques that professional researchers use daily. This lesson introduces four powerful methods that transform how you extract insights from AI systems.
              </p>

              <h2 className="text-4xl font-bold mb-6 mt-8 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>
                What You'll Learn
              </h2>

              <ul className="space-y-3 mb-8 text-foreground">
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span><strong>Chain-of-Thought Prompting</strong> - Guide AI through complex reasoning with step-by-step problem solving</span>
                </li>
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span><strong>Retrieval-Augmented Generation (RAG)</strong> - Connect AI to external knowledge bases for current, accurate information</span>
                </li>
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span><strong>Few-Shot Learning</strong> - Teach AI new patterns instantly by showing just a few examples</span>
                </li>
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span><strong>Prompt Chaining</strong> - Build sophisticated multi-step workflows that break down complex tasks</span>
                </li>
              </ul>

              <div className="bg-card rounded-lg p-6 mb-6 border-2 border-border">
                <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                  <strong>Why This Matters:</strong> These techniques are used by AI researchers, data scientists, and power users to get 10x better results from the same AI models. By the end of this lesson, you'll know exactly when and how to apply each method.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setCurrentScreen(2)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
              style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
              data-testid="button-continue-concept"
            >
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Screen 2: Flashcards */}
        {currentScreen === 2 && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-3 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }} data-testid="heading-flashcards">
                Quick Review
              </h2>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>
                Key concepts from advanced research
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
              {flashcards.map((card, index) => (
                <FlashCard key={index} card={card} index={index} />
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={() => setCurrentScreen(3)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-continue-flashcards"
              >
                Test Your Knowledge
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Screen 3: Quiz */}
        {currentScreen === 3 && (
          <div className="animate-in fade-in duration-500">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-3 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }} data-testid="heading-quiz">
                Quick Check
              </h2>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>
                Test your understanding
              </p>
            </div>

            <QuizScreen
              onComplete={() => setCurrentScreen(4)}
              score={quizScore}
              setScore={setQuizScore}
            />
          </div>
        )}

        {/* Screen 4: Results */}
        {currentScreen === 4 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto text-center">
            <h2 className="font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }} data-testid="heading-results">
              Nice Work! Advanced Research Resources
            </h2>

            <div className="bg-card rounded-lg p-8 mb-8 border-2 border-border">
              <p className="font-bold text-foreground mb-2" style={{ fontSize: '24px', lineHeight: '1.3' }} data-testid="text-score">
                You got {quizScore}/{quizQuestions.length} correct! 🎉
              </p>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>
                {quizScore === quizQuestions.length
                  ? "Perfect score! You've mastered the concepts!"
                  : quizScore >= 2
                    ? "Great job! You're on the right track!"
                    : "Keep learning! Review the concepts and try again."}
              </p>
            </div>

            <div className="border-t-2 border-dashed border-border my-8"></div>

            <h3 className="font-bold mb-6 text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }}>
              Download Your Research Tools
            </h3>

            <div className="space-y-4 mb-8">
              <Card className="p-6 text-left hover-elevate cursor-pointer border-2 border-border" data-testid="download-prompt-template" style={{ backgroundColor: 'white' }}>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg border border-border bg-card" style={{ padding: '8px' }}>
                    <FileText />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-2" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                      Advanced Prompt Templates
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3" style={{ lineHeight: '1.5' }}>
                      Ready-to-use templates for Chain-of-Thought, RAG, Few-Shot, and Prompt Chaining scenarios
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const content = `# Advanced AI Research Prompt Templates\n\n## Chain-of-Thought Prompting\n\n**Template:**\n"Let's solve this step by step:\n1. First, [identify the key components]\n2. Next, [analyze relationships]\n3. Then, [consider implications]\n4. Finally, [reach conclusion]\n\nPlease show your reasoning for each step."\n\n**Example:**\n"A company's revenue grew from $100M to $150M. Their costs increased from $80M to $110M. Let's calculate their profit margin change step by step:\n1. Calculate initial profit\n2. Calculate final profit\n3. Calculate profit margins\n4. Determine the change"\n\n---\n\n## Few-Shot Learning\n\n**Template:**\n"Here are examples of the pattern I want:\n\nExample 1:\nInput: [sample 1]\nOutput: [desired output 1]\n\nExample 2:\nInput: [sample 2]\nOutput: [desired output 2]\n\nExample 3:\nInput: [sample 3]\nOutput: [desired output 3]\n\nNow apply this pattern to:\nInput: [your actual query]"\n\n**Example:**\n"Convert these informal messages to professional emails:\n\nExample 1:\nInput: 'hey can u send the report thx'\nOutput: 'Dear colleague, Could you please send me the report at your earliest convenience? Thank you.'\n\nExample 2:\nInput: 'meeting postponed nvm'\nOutput: 'The meeting has been postponed. Please disregard the previous invitation.'\n\nNow convert: 'gonna be late sorry'"\n\n---\n\n## Prompt Chaining\n\n**Template:**\n"Step 1: [Extract key information]\nStep 2: [Analyze the extracted data]\nStep 3: [Generate recommendations based on analysis]\nStep 4: [Format findings into actionable plan]"\n\n**Example:**\n"Step 1: Read this customer feedback and extract main themes\nStep 2: For each theme, identify frequency and sentiment\nStep 3: Recommend 3 product improvements based on the themes\nStep 4: Create a prioritized action plan"\n\n---\n\n## RAG (Retrieval-Augmented Generation)\n\n**Concept:**\nRAG requires integration with a knowledge base or document store. The pattern is:\n1. User asks a question\n2. System retrieves relevant documents/passages\n3. AI uses retrieved context to answer\n\n**Implementation Note:**\nRAG is typically implemented through specialized tools and platforms (like LangChain, LlamaIndex) rather than pure prompting. However, you can simulate it by:\n\n"Based on the following retrieved documents:\n[Document 1]: [relevant excerpt]\n[Document 2]: [relevant excerpt]\n\nAnswer this question: [your question]\nOnly use information from the provided documents."`;

                        const blob = new Blob([content], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'advanced-prompt-templates.md';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 text-left hover-elevate cursor-pointer border-2 border-border" data-testid="download-quick-reference" style={{ backgroundColor: 'white' }}>
                <div className="flex items-start gap-4">
                  <div className="rounded-lg border border-border bg-card" style={{ padding: '8px' }}>
                    <Lightbulb />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground mb-2" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                      Quick Reference Guide
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3" style={{ lineHeight: '1.5' }}>
                      One-page cheat sheet with when to use each technique and common pitfalls to avoid
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        const content = `# Advanced AI Research - Quick Reference Guide\n\n## When to Use Each Technique\n\n### Chain-of-Thought Prompting ✓\n**Use when:**\n- Solving complex math or logic problems\n- Need to verify reasoning process\n- Breaking down multi-step tasks\n- Transparency in decision-making is important\n\n**Don't use when:**\n- Simple factual queries\n- Creative writing\n- Speed is critical (adds token overhead)\n\n**Common Pitfalls:**\n- Being too prescriptive in the steps\n- Not giving the AI space to show work\n- Using for questions that don't require reasoning\n\n---\n\n### Retrieval-Augmented Generation (RAG) ✓\n**Use when:**\n- Need current/up-to-date information\n- Working with proprietary documents\n- Answering from specific knowledge bases\n- Facts beyond AI's training cutoff\n\n**Don't use when:**\n- General knowledge questions\n- Creative tasks\n- No suitable document corpus exists\n\n**Common Pitfalls:**\n- Poor document chunking strategy\n- Irrelevant retrieval results\n- Not validating retrieved context quality\n- Overwhelming the AI with too much retrieved text\n\n---\n\n### Few-Shot Learning ✓\n**Use when:**\n- Teaching new formats or patterns\n- Standardizing output structure\n- Classification tasks\n- The pattern is clear from examples\n\n**Don't use when:**\n- Zero-shot already works well\n- Examples would be confusing\n- Task requires general knowledge, not pattern matching\n\n**Common Pitfalls:**\n- Using too many examples (2-5 is optimal)\n- Examples don't cover edge cases\n- Inconsistent example quality\n- Examples too similar to each other\n\n**Pro Tip:** Quality > Quantity. Three diverse, high-quality examples beat ten similar ones.\n\n---\n\n### Prompt Chaining ✓\n**Use when:**\n- Complex multi-stage workflows\n- Each step has distinct purpose\n- Need to validate intermediate outputs\n- Different expertise needed at each stage\n\n**Don't use when:**\n- Single-step tasks\n- Real-time response needed\n- Steps are tightly coupled\n\n**Common Pitfalls:**\n- Too many steps (diminishing returns after 4-5)\n- Not validating intermediate outputs\n- Losing context between steps\n- Over-engineering simple tasks\n\n---\n\n## Decision Tree: Which Technique to Use?\n\n**Start here:**\n1. Do I need external/current information?\n   → YES: Use RAG\n   → NO: Continue\n\n2. Is this a complex reasoning task?\n   → YES: Use Chain-of-Thought\n   → NO: Continue\n\n3. Do I need a specific output format/pattern?\n   → YES: Use Few-Shot Learning\n   → NO: Continue\n\n4. Is this a multi-stage workflow?\n   → YES: Use Prompt Chaining\n   → NO: Use standard prompting\n\n---\n\n## Combining Techniques\n\nThese techniques can be combined:\n\n✓ **RAG + Chain-of-Thought**\n  Retrieve relevant docs, then reason through them step-by-step\n\n✓ **Few-Shot + Chain-of-Thought**\n  Show examples of step-by-step reasoning\n\n✓ **Prompt Chaining + RAG**\n  Each step retrieves different context\n\n✓ **All Four Together**\n  Advanced pipeline: RAG retrieval → Few-shot classification → Chain-of-thought analysis → Output formatting\n\n---\n\n## Performance Tips\n\n1. **Start Simple:** Begin with standard prompting, add techniques only when needed\n2. **Measure Impact:** Test if the technique actually improves results\n3. **Token Awareness:** Chain-of-Thought and RAG increase token usage\n4. **Iteration:** Refine examples and steps based on outputs\n5. **Context Limits:** Be mindful of model context windows\n\n---\n\n## Common Mistakes Across All Techniques\n\n❌ Over-engineering simple problems\n❌ Not testing with edge cases\n❌ Ignoring token costs\n❌ Using techniques in isolation when combination would help\n❌ Not iterating based on results\n\n---\n\n**Remember:** These are tools, not rules. Experiment and adapt to your specific use case!`;

                        const blob = new Blob([content], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'ai-research-quick-reference.md';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Guide
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div className="border-t-2 border-dashed border-border my-8"></div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-8 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-restart-lesson"
              >
                <RotateCcw className="mr-2 w-5 h-5" />
                Restart Lesson
              </Button>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-start-trial"
              >
                <a
                  href="https://www.digestibly.ai/offers/rXwTSUjT/checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Start free trial (opens in new tab)"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
