import { useState, useEffect } from "react";
import { Check, Copy, ChevronRight, Target, Search, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type QuizAnswer = {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
};

export default function ChainOfThought() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentScreen]);

  const flashcards = [
    {
      front: "What is chain of thought prompting?",
      back: "Asking AI to 'show its work' and think through problems step-by-step instead of just giving you an answer. Makes responses more accurate and thoughtful.",
    },
    {
      front: "Why does chain of thought make AI better?",
      back: "When AI breaks things down step-by-step, it catches mistakes, considers more factors, and gives you the reasoning behind the answer—not just the answer itself.",
    },
    {
      front: "When should you use chain of thought prompting?",
      back: "For complex reasoning, strategic decisions, problem-solving, analysis, or anything requiring logic. Not needed for simple tasks like writing emails or summarizing.",
    },
    {
      front: "How do you trigger chain of thought?",
      back: "Add phrases like 'think through this step-by-step,' 'show your work,' or 'walk me through your reasoning' to your prompt. That's it.",
    },
  ];

  const quizQuestions = [
    {
      id: 1,
      question: "You're trying to decide between two different pricing strategies for your product. Which approach will give you a better answer?",
      options: [
        { label: "A", text: '"Which pricing strategy is better: A or B?"' },
        { label: "B", text: '"Which pricing strategy is better: A or B? Think through the pros and cons of each step-by-step before recommending one."' },
        { label: "C", text: '"Tell me about pricing strategies"' },
        { label: "D", text: '"Just pick one: A or B"' },
      ],
      correct: "B",
      correctFeedback: "Exactly! By asking AI to think through the pros and cons first, you get the reasoning behind its recommendation—not just a random pick.",
      incorrectFeedback: "Not quite. The key is asking AI to break down its thinking step-by-step before giving you a recommendation. This gives you the reasoning, not just the answer.",
    },
    {
      id: 2,
      question: "When is chain of thought prompting NOT necessary?",
      options: [
        { label: "A", text: "When you need AI to analyze complex data" },
        { label: "B", text: "When you're asking AI to write a simple email" },
        { label: "C", text: "When you're making a strategic decision" },
        { label: "D", text: "When you need to solve a problem" },
      ],
      correct: "B",
      correctFeedback: "Right! Simple tasks don't need it. Save chain of thought for when you actually need reasoning and analysis.",
      incorrectFeedback: "Not quite. Simple tasks like writing an email don't need step-by-step reasoning. Chain of thought is for complex analysis, strategic decisions, and problem-solving.",
    },
    {
      id: 3,
      question: "What's the secret to triggering chain of thought?",
      options: [
        { label: "A", text: "You need to use special technical commands" },
        { label: "B", text: 'Just add "think step-by-step" or similar phrases to your prompt' },
        { label: "C", text: "You have to upload a file first" },
        { label: "D", text: "It only works with premium AI tools" },
      ],
      correct: "B",
      correctFeedback: "Yep! It's that simple. Just ask AI to show its work, and it will. No special tricks needed.",
      incorrectFeedback: "Not quite. There's no special setup needed. Just add phrases like 'think step-by-step' or 'show your work' to your prompt, and AI will break down its reasoning.",
    },
  ];

  const templates = [
    {
      icon: Target,
      title: "STRATEGIC DECISION TEMPLATE",
      subtitle: "Best for: Big decisions, strategy choices, resource allocation",
      code: `You're a [role with relevant expertise]. I need to decide between [Option A] and [Option B] for [goal/context].
Think through this step-by-step:
1. First, analyze the pros and cons of Option A
2. Then, analyze the pros and cons of Option B
3. Consider the key factors: [factor 1], [factor 2], [factor 3]
4. Think about potential risks and opportunities for each
5. Finally, recommend which option makes more sense and why
Be thorough in your reasoning before giving me your recommendation.`,
    },
    {
      icon: Search,
      title: "PROBLEM ANALYSIS TEMPLATE",
      subtitle: "Best for: Diagnosing issues, troubleshooting, fixing what's broken",
      code: `You're a [relevant expert role]. I'm facing this problem: [describe problem]
Walk me through this step-by-step:
1. First, what are the likely root causes of this problem?
2. For each cause, what evidence supports it?
3. What factors might be making this worse?
4. What are 3-5 potential solutions, ranked by feasibility?
5. For your top recommendation, walk me through implementation
Show your complete reasoning at each step.`,
    },
    {
      icon: BarChart3,
      title: "DATA ANALYSIS TEMPLATE",
      subtitle: "Best for: Making sense of numbers, finding insights, data-driven decisions",
      code: `You're a [data analyst/strategist]. I'm going to share [type of data/information] with you.
Analyze this step-by-step:
1. First, what are the 3-5 most important patterns you notice?
2. For each pattern, explain what it means and why it matters
3. What's surprising or unexpected in this data?
4. What questions does this raise?
5. Based on this analysis, what are 3 actionable recommendations?
Think through each step carefully before moving to the next.
[Paste your data/information here]`,
    },
  ];

  const toggleFlipCard = (index: number) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(index)) {
      newFlipped.delete(index);
    } else {
      newFlipped.add(index);
    }
    setFlippedCards(newFlipped);
  };

  const handleQuizAnswer = (questionId: number, answer: string) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = answer === question.correct;
    const existingAnswerIndex = quizAnswers.findIndex((a) => a.questionId === questionId);

    if (existingAnswerIndex >= 0) {
      const newAnswers = [...quizAnswers];
      newAnswers[existingAnswerIndex] = { questionId, selectedAnswer: answer, isCorrect };
      setQuizAnswers(newAnswers);
    } else {
      setQuizAnswers([...quizAnswers, { questionId, selectedAnswer: answer, isCorrect }]);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast({
        title: "Copied to clipboard!",
        duration: 2000,
      });
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch {
      toast({
        title: "Failed to copy",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const copyAllTemplates = async () => {
    const allTemplatesText = templates.map((t) => `${t.title}\n${t.subtitle}\n\n${t.code}`).join("\n\n---\n\n");
    await copyToClipboard(allTemplatesText, "all");
  };

  const getQuizScore = () => {
    return quizAnswers.filter((a) => a.isCorrect).length;
  };

  const isQuizComplete = () => {
    return quizAnswers.length === quizQuestions.length;
  };

  const getSelectedAnswer = (questionId: number) => {
    return quizAnswers.find((a) => a.questionId === questionId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Progress Indicator */}
        <div
          className="flex items-center justify-center max-w-[400px] mx-auto mt-10 mb-12 px-5"
          role="progressbar"
          aria-label={`Progress: Step ${currentScreen} of 4`}
          aria-valuenow={currentScreen}
          aria-valuemin={1}
          aria-valuemax={4}
        >
          {[1, 2, 3, 4].map((step, index) => {
            const isCompleted = step < currentScreen;
            const isActive = step === currentScreen;
            const isUpcoming = step > currentScreen;

            return (
              <div key={step} className="flex items-center">
                {/* Circle */}
                <div
                  className="flex items-center justify-center rounded-full transition-all duration-300 ease-in-out w-10 h-10 sm:w-14 sm:h-14 text-lg sm:text-2xl"
                  style={{
                    fontFamily: 'Poppins',
                    backgroundColor: isCompleted ? '#072D24' : isActive ? '#A8D5B7' : '#FFFFFF',
                    color: isCompleted ? '#FFFFFF' : isActive ? '#072D24' : '#6A7CA7',
                    fontWeight: isCompleted || isActive ? 700 : 500,
                    border: isActive ? '2px solid #072D24' : isUpcoming ? '2px solid #E6D8B3' : 'none'
                  }}
                  data-testid={`progress-step-${step}`}
                >
                  {isCompleted ? '✓' : step}
                </div>

                {/* Connector Line (don't render after last step) */}
                {index < 3 && (
                  <div
                    className="h-0.5 w-10 sm:w-[60px] transition-all duration-300 ease-in-out"
                    style={{
                      backgroundColor: step < currentScreen ? '#A8D5B7' : '#E6D8B3'
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Screen 1: The Concept */}
        {currentScreen === 1 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto" data-testid="screen-concept">
            <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight" style={{ fontSize: '48px', lineHeight: '1.15' }}>
              Chain of Thought - Making AI Actually Think
            </h1>

            <div className="max-w-none mb-8">
              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Alright, quick experiment. If I asked you "What's 47 × 23?" you'd probably need a second to think it through, right?
                You wouldn't just blurt out a number. You'd do some mental math—break it down, work through the steps, maybe even jot something down.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                <strong>That's chain of thought.</strong> Thinking step-by-step instead of jumping straight to an answer.
                Now here's the interesting part: AI works the same way. When you ask ChatGPT a question, it <em>can</em> just spit out an answer.
                But if you tell it to <strong>think through the problem first</strong>, it literally gets smarter.
              </p>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Why This Works</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  AI models are better at reasoning when they "show their work." It's not magic—it's just how they're built.
                  When you force AI to break something down step-by-step, it catches its own mistakes, considers edge cases, and gives you more thoughtful answers.
                </p>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  <strong>Without chain of thought:</strong><br />
                  "Should I launch this product in Q1 or Q2?"<br />
                  → "Q2 would be better."<br />
                  Cool, but... why? What are you basing that on?
                </p>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  <strong>With chain of thought:</strong><br />
                  "Should I launch this product in Q1 or Q2? Think through the considerations step-by-step before answering."<br />
                  → "Let me think through this: First, Q1 typically has lower consumer spending post-holidays. Second, your development timeline suggests Q1 would be rushed.
                  Third, Q2 aligns with your competitor's typical slow season. Based on these factors, Q2 makes more sense because..."
                </p>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  See the difference? You get the reasoning, not just the conclusion.
                </p>
              </div>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>When To Use Chain of Thought</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Not every prompt needs this. If you're asking AI to write an email or summarize an article, regular prompts work fine.
                </p>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  But use chain of thought when you need:
                </p>

                <ul className="list-disc pl-6 space-y-2 mb-6 text-foreground">
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Complex reasoning</strong> → "Should I hire internally or externally?"</span>
                  </li>
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Problem-solving</strong> → "Why isn't this marketing campaign working?"</span>
                  </li>
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Strategic decisions</strong> → "What should our Q3 priorities be?"</span>
                  </li>
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Analysis</strong> → "What patterns do you see in this data?"</span>
                  </li>
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Math or logic</strong> → Pretty much anything with numbers</span>
                  </li>
                </ul>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Basically: if the answer requires <em>thinking</em>, make AI think out loud.
                </p>
              </div>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>How To Trigger It</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  It's stupidly simple. Just add something like:
                </p>

                <ul className="list-disc pl-6 space-y-2 mb-6 text-foreground">
                  <li className="text-base" style={{ lineHeight: '1.6' }}>"Think through this step-by-step"</li>
                  <li className="text-base" style={{ lineHeight: '1.6' }}>"Let's break this down before answering"</li>
                  <li className="text-base" style={{ lineHeight: '1.6' }}>"Walk me through your reasoning"</li>
                  <li className="text-base" style={{ lineHeight: '1.6' }}>"Consider each factor one at a time"</li>
                  <li className="text-base" style={{ lineHeight: '1.6' }}>"Show your work"</li>
                </ul>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  That's it. Five extra words, and suddenly AI is way more useful.
                </p>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  The best part? You can combine this with everything else you've learned. Role + Task + Context + Chain of Thought = absolute magic.
                  Alright, let's lock this in.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setCurrentScreen(2)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
              style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
              data-testid="button-continue-1"
            >
              Continue
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Screen 2: Flashcards */}
        {currentScreen === 2 && (
          <div className="animate-in fade-in duration-500" data-testid="screen-flashcards">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-3 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Quick Review - Lock This In</h2>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Flip through these so it sticks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flashcards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => toggleFlipCard(index)}
                  className="h-64 cursor-pointer perspective-1000"
                  data-testid={`flashcard-${index}`}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-[600ms] ease-in-out transform-style-3d ${flippedCards.has(index) ? "rotate-y-180" : ""
                      }`}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {/* Front */}
                    <Card
                      className={`absolute w-full h-full flex items-center justify-center p-6 backface-hidden border-2 bg-card ${flippedCards.has(index) ? "opacity-0" : "opacity-100"
                        }`}
                      style={{ backfaceVisibility: "hidden", borderColor: 'var(--border)' }}
                    >
                      <p className="text-base font-medium text-center text-foreground">
                        {card.front}
                      </p>
                    </Card>

                    {/* Back */}
                    <Card
                      className={`absolute w-full h-full flex items-center justify-center p-6 backface-hidden border-2 bg-card ${flippedCards.has(index) ? "opacity-100" : "opacity-0"
                        }`}
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderColor: 'var(--border)'
                      }}
                    >
                      <p className="text-base text-center text-foreground leading-relaxed">
                        {card.back}
                      </p>
                    </Card>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={() => setCurrentScreen(3)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px', marginTop: '20px' }}
                data-testid="button-continue-2"
              >
                Test Your Knowledge
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Screen 3: Quiz */}
        {currentScreen === 3 && (
          <div className="animate-in fade-in duration-500" data-testid="screen-quiz">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-3 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Did It Click?</h2>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Answer these 3 questions to unlock your chain of thought templates</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {quizQuestions.map((question, qIndex) => {
                const selectedAnswer = getSelectedAnswer(question.id);
                const showFeedback = selectedAnswer !== undefined;

                return (
                  <div key={question.id} className="space-y-4">
                    <h3 className="mb-8 text-foreground font-medium" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                      Question {qIndex + 1}: {question.question}
                    </h3>

                    <div className="space-y-3">
                      {question.options.map((option) => {
                        const isSelected = selectedAnswer?.selectedAnswer === option.label;
                        const isCorrect = option.label === question.correct;
                        const showCorrect = showFeedback && isCorrect;
                        const showIncorrect = showFeedback && isSelected && !isCorrect;

                        return (
                          <button
                            key={option.label}
                            onClick={() => handleQuizAnswer(question.id, option.label)}
                            disabled={showFeedback}
                            className={`w-full text-left rounded-lg transition-all relative overflow-hidden ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"
                              }`}
                            style={{
                              fontSize: '16px',
                              padding: '18px 20px',
                              lineHeight: '1.6',
                              border: showCorrect
                                ? '2px solid #A8D5B7'
                                : showIncorrect
                                  ? '2px solid #DC2626'
                                  : isSelected
                                    ? '2px solid #072D24'
                                    : showFeedback
                                      ? '2px solid #E6D8B3'
                                      : '2px solid #072D24',
                              background: showCorrect
                                ? '#A8D5B7'
                                : showIncorrect
                                  ? '#FEF2F2'
                                  : isSelected
                                    ? '#FFFFFF'
                                    : showFeedback
                                      ? '#F5EFE0'
                                      : '#FFFFFF',
                              color: showCorrect
                                ? '#072D24'
                                : showIncorrect
                                  ? '#991B1B'
                                  : '#072D24'
                            }}
                            data-testid={`quiz-${question.id}-option-${option.label}`}
                          >
                            <span className="font-bold mr-2">{option.label})</span>
                            {option.text}
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
                          background: selectedAnswer.isCorrect ? '#A8D5B7' : '#FEF2F2',
                          borderLeft: selectedAnswer.isCorrect ? '4px solid #072D24' : '4px solid #DC2626',
                          color: selectedAnswer.isCorrect ? '#072D24' : '#991B1B'
                        }}
                        data-testid={`quiz-${question.id}-feedback`}
                      >
                        <p style={{
                          fontSize: '16px',
                          lineHeight: '1.6',
                          fontWeight: 600,
                          marginBottom: '8px'
                        }}>
                          {selectedAnswer.isCorrect ? "✓ Correct!" : "✗ Not quite."}
                        </p>
                        <p style={{
                          fontSize: '16px',
                          lineHeight: '1.6'
                        }}>
                          {selectedAnswer.isCorrect ? question.correctFeedback : question.incorrectFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto pt-4">
              <Button
                onClick={() => setCurrentScreen(4)}
                disabled={!isQuizComplete()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold px-10 py-5 rounded-lg min-h-[60px] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                style={{ marginTop: '20px' }}
                data-testid="button-next"
              >
                See My Results →
              </Button>
            </div>
          </div>
        )}

        {/* Screen 4: Results + Templates */}
        {currentScreen === 4 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto text-center" data-testid="screen-results">
            <h2 className="font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>
              Nice Work! Here Are Your 3 Chain of Thought Templates
            </h2>

            <div className="bg-card rounded-lg p-8 mb-8 border-2 border-border">
              <p className="font-bold text-foreground mb-2" style={{ fontSize: '24px', lineHeight: '1.3' }} data-testid="quiz-score">
                You got {getQuizScore()}/3 correct! 🎉
              </p>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>
                These templates make AI way more useful for complex work.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {templates.map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <Card key={index} className="p-6 text-left hover-elevate cursor-pointer bg-white border-2 border-border" data-testid={`template-${index}`}>
                    <div className="flex items-start gap-4">
                      <div className="bg-card p-3 rounded-lg border border-border">
                        <IconComponent className="w-6 h-6 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground mb-2" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                          {template.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3" style={{ lineHeight: '1.5' }}>
                          {template.subtitle}
                        </p>
                        <div className="relative">
                          <pre className="bg-[#072d24] text-white p-4 rounded-lg overflow-x-auto text-sm leading-relaxed font-mono mb-3" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {template.code}
                          </pre>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(template.code, `template-${index}`);
                            }}
                            variant="outline"
                            size="sm"
                            data-testid={`button-copy-${index}`}
                          >
                            {copiedStates[`template-${index}`] ? (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Template
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="my-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}></div>

            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-xl font-semibold text-foreground">
                You just learned how to make AI show its work—game changer for complex decisions.
              </p>
              <p className="text-base text-foreground">
                This is 1 of 100+ practical lessons that cut through the AI hype and show you what actually works.
              </p>
              <div className="text-left max-w-md mx-auto space-y-2 text-base text-foreground">
                <p className="font-semibold">What you get:</p>
                <p>✓ 5-minute lessons (no 3-hour courses)</p>
                <p>✓ Copy-paste workflows and templates</p>
                <p>✓ Real automation you can build today</p>
              </div>
              <p className="text-lg font-semibold text-foreground pt-2">
                Ready to master AI without the overwhelm?
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button
                onClick={copyAllTemplates}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-8 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-copy-all"
              >
                {copiedStates["all"] ? (
                  <>
                    <Check className="mr-2 w-5 h-5" />
                    All Templates Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 w-5 h-5" />
                    Copy All Templates
                  </>
                )}
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
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

