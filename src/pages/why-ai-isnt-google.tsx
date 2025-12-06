import { useState, useEffect } from "react";
import { ChevronRight, CheckCircle2, XCircle, PartyPopper, User, FileText, Target, Mail, Calendar, Pencil, Search, Lightbulb, BarChart3, PenTool, ListTodo, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Screen = 1 | 2 | 3 | 4;

interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

const QUIZ_QUESTIONS = [
  {
    question: "Alright, which one of these is actually going to get you something useful?",
    options: [
      "Write a blog post about AI",
      "You're a content strategist for B2B companies. Write a 500-word blog post about how AI improves team productivity. Include 3 actionable tips and keep the tone professional but accessible.",
      "Blog post on AI productivity",
      "Write about AI for work"
    ],
    correctIndex: 1,
    correctFeedback: "Exactly! You gave AI a role, a task, and actual context. That's the whole framework right there.",
    wrongFeedback: "Not quite. Look for the option that includes all three parts: who AI should be (role), what it should do (task), and why it matters (context)."
  },
  {
    question: "You need AI to help you draft an email to a difficult client. What's the most important thing to include in your prompt?",
    options: [
      "How long the email should be",
      "The context of your relationship and what happened",
      "Whether to use bullet points or paragraphs",
      "What the subject line should be"
    ],
    correctIndex: 1,
    correctFeedback: "Yep! Without context, AI is just guessing. Tell it what's going on, and it'll actually give you something useful.",
    wrongFeedback: "Not quite. While formatting matters, AI needs the relationship context and situation details to write something actually helpful."
  },
  {
    question: "When should you actually use the R-T-C Framework?",
    options: [
      "Only when you're doing something complicated",
      "Only for work stuff",
      "Literally every time you use AI",
      "Only when your first attempt didn't work"
    ],
    correctIndex: 2,
    correctFeedback: "Make it a habit. Even simple prompts get way better when you give AI role, task, and context. Every. Single. Time.",
    wrongFeedback: "Not quite. The R-T-C Framework works for everything—simple or complex. Using it every single time becomes second nature and gets you better results consistently."
  }
];

const PRODUCTIVITY_PROMPTS = [
  {
    title: "EMAIL DRAFTING",
    icon: Mail,
    prompt: `You're an executive assistant with killer communication skills. Draft an email to [recipient] about [topic]. Keep it under [X] words, use a [tone] tone, and focus on [key point]. Make it sound like a real human wrote it, not a robot.`
  },
  {
    title: "MEETING PREP",
    icon: Calendar,
    prompt: `You're a strategic consultant prepping me for a meeting. I'm meeting with [person/company] to discuss [topic]. Give me: 1) 3 sharp questions I should ask, 2) objections they'll probably raise, and 3) one solid opening line to break the ice.`
  },
  {
    title: "CONTENT REPURPOSING",
    icon: Pencil,
    prompt: `You're a content strategist. Take this [content type] and turn it into a [new format] for [platform]. Keep the core message but adapt it for [audience]. Here's the original:
[Paste content]`
  },
  {
    title: "RESEARCH SYNTHESIS",
    icon: Search,
    prompt: `You're a research analyst. I've got [number] sources about [topic]. Synthesize them into: 1) the main themes, 2) any patterns or contradictions, and 3) three things I can actually do with this info.
[Paste sources]`
  },
  {
    title: "BRAINSTORMING",
    icon: Lightbulb,
    prompt: `You're a creative director who's really good at this. Generate 10 ideas for [project/problem]. For each one: describe it in one sentence, explain why it might work, and flag potential issues. Focus on [constraint/goal].`
  },
  {
    title: "DATA EXPLANATION",
    icon: BarChart3,
    prompt: `You're a data analyst who's great at explaining complex stuff to regular people. Take this [data/concept] and break it down so a [audience] would get it. Use analogies if they help.
[Paste data]`
  },
  {
    title: "WRITING FEEDBACK",
    icon: PenTool,
    prompt: `You're an editor at a top-tier publication. Review this [content] and tell me: 1) what's working, 2) three specific ways to make it better, and 3) one sentence that could be way stronger (then rewrite it for me).
[Paste content]`
  },
  {
    title: "TASK BREAKDOWN",
    icon: ListTodo,
    prompt: `You're a project manager who's incredible at breaking big things into small things. Take this goal and turn it into: 1) 5-7 concrete tasks, 2) rough time estimates for each, and 3) what order makes sense based on dependencies.
[Paste goal]`
  },
  {
    title: "PRESENTATION PREP",
    icon: MessageSquare,
    prompt: `You're a communications coach. I'm presenting [topic] to [audience]. Help me: 1) structure a 10-minute talk, 2) identify the one key message to hammer home, and 3) write an opening hook that'll get their attention.`
  },
  {
    title: "PROCESS IMPROVEMENT",
    icon: RefreshCw,
    prompt: `You're an operations consultant. Look at this process and tell me: 1) where the bottlenecks are, 2) three ways to make it faster or easier, and 3) what could go wrong with each improvement.
[Paste process description]`
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
      {steps.map((step, index) => {
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

            {/* Connector Line */}
            {index < steps.length - 1 && (
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
  );
}

function FlashCard({ card, index }: { card: { front: string; back: string }; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="h-64 cursor-pointer perspective-1000"
      data-testid={`flashcard-${index}`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-[600ms] ease-in-out transform-style-3d ${isFlipped ? "rotate-y-180" : ""
          }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <Card
          className={`absolute w-full h-full flex items-center justify-center p-6 backface-hidden border-2 bg-card ${isFlipped ? "opacity-0" : "opacity-100"
            }`}
          style={{ backfaceVisibility: "hidden", borderColor: 'var(--border)' }}
        >
          <p className="text-base font-medium text-center text-foreground">
            {card.front}
          </p>
        </Card>

        {/* Back */}
        <Card
          className={`absolute w-full h-full flex items-center justify-center p-6 backface-hidden border-2 bg-card ${isFlipped ? "opacity-100" : "opacity-0"
            }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderColor: 'var(--border)'
          }}
        >
          <p className="text-base text-center text-foreground leading-relaxed whitespace-pre-line">
            {card.back}
          </p>
        </Card>
      </div>
    </div>
  );
}

function CodeBlock({ title, code, icon: Icon }: { title: string; code: string; icon: typeof Mail }) {
  return (
    <div className="relative">
      <div className="bg-[#072d24] text-white rounded-lg p-6 pr-14">
        <div className="flex items-center gap-2 font-medium mb-3">
          <Icon className="w-5 h-5" />
          <span>{title}</span>
        </div>
        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

export default function WhyAIIsntGoogle() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [score, setScore] = useState(0);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentScreen]);

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const isCorrect = QUIZ_QUESTIONS[questionIndex].correctIndex === answerIndex;

    const existingAnswerIndex = quizAnswers.findIndex(
      (a) => a.questionIndex === questionIndex
    );

    if (existingAnswerIndex >= 0) {
      const newAnswers = [...quizAnswers];
      newAnswers[existingAnswerIndex] = {
        questionIndex,
        selectedAnswer: QUIZ_QUESTIONS[questionIndex].options[answerIndex],
        isCorrect,
      };
      setQuizAnswers(newAnswers);
      setScore(newAnswers.filter((a) => a.isCorrect).length);
    } else {
      const newAnswers = [
        ...quizAnswers,
        {
          questionIndex,
          selectedAnswer: QUIZ_QUESTIONS[questionIndex].options[answerIndex],
          isCorrect,
        },
      ];
      setQuizAnswers(newAnswers);
      setScore(newAnswers.filter((a) => a.isCorrect).length);
    }
  };

  const getAnswerForQuestion = (questionIndex: number) => {
    return quizAnswers.find((a) => a.questionIndex === questionIndex);
  };

  const isQuizComplete = quizAnswers.length === QUIZ_QUESTIONS.length;

  const flashcards = [
    {
      front: "What's the actual difference between using AI and using Google?",
      back: "Google finds information that already exists. AI creates new solutions based on the specific context you give it. Totally different tools."
    },
    {
      front: "What are the 3 parts of the R-T-C Framework?",
      back: "Role – who should AI be?\nTask – what should it do?\nContext – what details matter?"
    },
    {
      front: "Why does AI keep giving you generic, boring answers?",
      back: "Because you're probably prompting it like Google—short and vague. AI needs role, task, and context to actually be useful."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ProgressIndicator currentScreen={currentScreen} />

        {/* Screen 1: The Concept */}
        {currentScreen === 1 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto" data-testid="screen-concept">
            <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight" style={{ fontSize: '48px', lineHeight: '1.15' }}>
              Why AI Isn't Google (And What To Do About It)
            </h1>

            <div className="max-w-none mb-8">
              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Here's what most people don't understand:
              </p>

              <div className="space-y-3 mb-6 text-foreground">
                <p className="text-base" style={{ lineHeight: '1.6' }}>
                  <strong>Google</strong> is a librarian → You ask, it points to books
                </p>
                <p className="text-base" style={{ lineHeight: '1.6' }}>
                  <strong>AI</strong> is a collaborator → You give context, it creates with you
                </p>
              </div>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                The problem? We've spent 20+ years Googling things with short, keyword-based questions.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                AI needs something different. You can give it actual tasks—but only if you tell it what you need, who it should be, and why it matters. It comes down to three simple things:
              </p>

              <div className="flex justify-center mb-8">
                <Card className="p-8 bg-card border-2 border-border max-w-[600px] w-full" style={{ padding: '24px' }}>
                  <h2 className="text-2xl font-bold mb-6 text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }}>The R-T-C Framework:</h2>
                  <div className="space-y-3 text-base">
                    <div className="flex items-center gap-2 text-foreground">
                      <User className="w-5 h-5 text-primary flex-shrink-0" />
                      <p><strong>ROLE:</strong> Who should AI be?</p>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                      <p><strong>TASK:</strong> What should AI do?</p>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Target className="w-5 h-5 text-primary flex-shrink-0" />
                      <p><strong>CONTEXT:</strong> What details matter?</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-base font-semibold text-foreground">Example:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-base text-foreground">
                    <XCircle className="text-destructive" style={{ color: '#DC2626' }} />
                    <p>Google-style: "Marketing email template"</p>
                  </div>
                  <div className="flex items-center gap-2 text-base text-foreground">
                    <CheckCircle2 style={{ width: '48px', color: '#072D24' }} />
                    <p>AI-style: "You're a marketing director at a SaaS company. Write a re-engagement email for customers who haven't logged in for 30 days. Keep it under 100 words, friendly tone, focus on value they're missing."</p>
                  </div>
                </div>
              </div>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                See the difference?
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                The second one tells AI exactly who to be, what to create, and all the little details that make it actually useful. The first one? That's just... keywords.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                And honestly, once you start thinking this way, AI goes from "kinda helpful sometimes" to "wait, this is actually saving me hours."
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Alright, let's practice this so it sticks.
              </p>
            </div>

            <Button
              onClick={() => setCurrentScreen(2)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
              style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
              data-testid="button-continue-to-practice"
            >
              Continue to Practice
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Screen 2: Flashcards */}
        {currentScreen === 2 && (
          <div className="animate-in fade-in duration-500" data-testid="screen-flashcards">
            <div className="text-center mb-12">
              <h2 className="font-bold mb-3 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Quick Review - Lock It In</h2>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Flip through these to make sure it clicks</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {flashcards.map((card, index) => (
                <div key={index} style={{ marginBottom: index < flashcards.length - 1 ? '24px' : '0' }}>
                  <FlashCard card={card} index={index} />
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                onClick={() => setCurrentScreen(3)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px', marginTop: '20px' }}
                data-testid="button-test-knowledge"
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
              <h2 className="font-bold mb-3 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Quick Check - Did It Click?</h2>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Answer these 3 questions to unlock your prompt library</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {QUIZ_QUESTIONS.map((question, qIndex) => {
                const answer = getAnswerForQuestion(qIndex);

                return (
                  <Card key={qIndex} className="p-6 bg-card border-2 border-border" style={{ marginBottom: '24px' }}>
                    <h3 className="mb-8 text-foreground font-medium" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                      Question {qIndex + 1}: {question.question}
                    </h3>

                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => {
                        const isSelected = answer?.selectedAnswer === option;
                        const isCorrect = question.correctIndex === oIndex;
                        const showFeedback = isSelected && answer;

                        return (
                          <div key={oIndex}>
                            <button
                              onClick={() => handleQuizAnswer(qIndex, oIndex)}
                              disabled={answer !== undefined}
                              className={`w-full text-left rounded-lg transition-all relative overflow-hidden ${answer !== undefined ? "cursor-not-allowed" : "cursor-pointer"
                                }`}
                              style={{
                                fontSize: '16px',
                                padding: '18px 20px',
                                lineHeight: '1.6',
                                border: showFeedback && isCorrect
                                  ? '2px solid #A8D5B7'
                                  : showFeedback && isSelected && !isCorrect
                                    ? '2px solid #DC2626'
                                    : isSelected
                                      ? '2px solid #072D24'
                                      : answer !== undefined
                                        ? '2px solid #E6D8B3'
                                        : '2px solid #072D24',
                                background: showFeedback && isCorrect
                                  ? '#A8D5B7'
                                  : showFeedback && isSelected && !isCorrect
                                    ? '#FEF2F2'
                                    : isSelected
                                      ? '#FFFFFF'
                                      : answer !== undefined
                                        ? '#F5EFE0'
                                        : '#FFFFFF',
                                color: showFeedback && isCorrect
                                  ? '#072D24'
                                  : showFeedback && isSelected && !isCorrect
                                    ? '#991B1B'
                                    : '#072D24'
                              }}
                              data-testid={`button-quiz-q${qIndex}-a${oIndex}`}
                            >
                              <div className="flex items-start gap-3">
                                <span className="font-bold flex-shrink-0">{String.fromCharCode(65 + oIndex)})</span>
                                <span className="flex-1">{option}</span>
                                {isSelected && (
                                  isCorrect ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                                  ) : (
                                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                  )
                                )}
                              </div>
                            </button>

                            {showFeedback && (
                              <div
                                role="alert"
                                aria-live="polite"
                                className="rounded-lg mt-3"
                                style={{
                                  padding: '24px',
                                  background: isCorrect ? '#A8D5B7' : '#FEF2F2',
                                  borderLeft: isCorrect ? '4px solid #072D24' : '4px solid #DC2626',
                                  color: isCorrect ? '#072D24' : '#991B1B',
                                  marginTop: '12px'
                                }}
                              >
                                <p style={{
                                  fontSize: '16px',
                                  lineHeight: '1.6',
                                  fontWeight: 600,
                                  marginBottom: '8px'
                                }}>
                                  {isCorrect ? '✓ Correct!' : '✗ Not quite.'}
                                </p>
                                <p style={{
                                  fontSize: '16px',
                                  lineHeight: '1.6'
                                }}>
                                  {isCorrect ? question.correctFeedback : question.wrongFeedback}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="max-w-3xl mx-auto pt-4">
              <Button
                onClick={() => setCurrentScreen(4)}
                disabled={!isQuizComplete}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold px-10 py-5 rounded-lg min-h-[60px] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                style={{ marginTop: '20px' }}
                data-testid="button-see-results"
              >
                {isQuizComplete ? (
                  <>
                    See My Results →
                  </>
                ) : (
                  'Answer all questions to continue'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Screen 4: Results */}
        {currentScreen === 4 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto text-center" data-testid="screen-results">
            <h2 className="font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>
              Nice Work! Here Are Your 10 Productivity Prompts
            </h2>

            <div className="bg-card rounded-lg p-8 mb-8 border-2 border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="font-bold text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }} data-testid="text-score">
                  You got {score}/3 correct!
                </p>
                <PartyPopper className="w-6 h-6 text-primary" />
              </div>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>
                These are copy-paste ready. Just customize the parts in [brackets].
              </p>
            </div>

            <div className="space-y-6 mb-12 text-left">
              {PRODUCTIVITY_PROMPTS.map((prompt, index) => (
                <div key={index} style={{ color: 'white', marginBottom: index < PRODUCTIVITY_PROMPTS.length - 1 ? '24px' : '0', backgroundColor: '#072D24' }}>
                  <CodeBlock
                    title={prompt.title}
                    icon={prompt.icon}
                    code={prompt.prompt}
                  />
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-border my-8"></div>

            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-xl font-semibold text-foreground">
                Enjoyed this bite-sized lesson?
              </p>

              <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                We've got 100+ more just like this—practical, no-BS AI training that actually sticks and doesn't make learning a snoozefest.
              </p>

              <div className="text-left max-w-md mx-auto space-y-2 text-base text-foreground">
                <p className="font-semibold">Every lesson includes:</p>
                <p>• Real-world examples you can use today</p>
                <p>• Copy-paste prompts and templates</p>
                <p>• Interactive quizzes to lock it in</p>
                <p>• Zero fluff, all substance</p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
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
    </div >
  );
}

