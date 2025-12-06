import { useState, useEffect } from "react";
import { Copy, Check, ChevronRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Screen = 1 | 2 | 3 | 4;

interface QuizAnswer {
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

const flashcards = [
  {
    id: 1,
    front: "What is a context window?",
    back: "It's how much conversation history ChatGPT can 'see' at once—like a whiteboard that fills up and starts erasing from the beginning when it runs out of space."
  },
  {
    id: 2,
    front: "What happens when you hit the context window limit?",
    back: "ChatGPT starts 'forgetting' the oldest parts of your conversation to make room for new messages. It's not broken—it's just out of space."
  },
  {
    id: 3,
    front: "What's the #1 way to manage long conversations?",
    back: "Start fresh when switching topics. For really long projects, summarize the conversation and restart with that summary as context."
  },
  {
    id: 4,
    front: "What eats up context the fastest?",
    back: "AI's responses (it's chatty), uploaded files, and long back-and-forth exchanges. Your prompts matter, but ChatGPT's answers take up way more space."
  }
];

const quizQuestions = [
  {
    id: 1,
    question: "You're 40 messages deep into a conversation about a marketing project. ChatGPT suddenly doesn't remember the target audience you mentioned at the beginning. What happened?",
    options: [
      { id: "A", text: "ChatGPT is malfunctioning" },
      { id: "B", text: "You need to upgrade to a paid plan" },
      { id: "C", text: "You hit the context window limit and the oldest messages got pushed out" },
      { id: "D", text: "ChatGPT wasn't paying attention" }
    ],
    correctAnswer: "C",
    feedback: "Exactly. The whiteboard filled up, and the oldest stuff got erased to make room for new messages. Time to start fresh or summarize and restart."
  },
  {
    id: 2,
    question: "You're working on a long document with ChatGPT. What's the smartest way to manage context?",
    options: [
      { id: "A", text: "Keep everything in one conversation no matter what" },
      { id: "B", text: "Every 15-20 messages, summarize and start a new chat with that summary" },
      { id: "C", text: "Just hope ChatGPT remembers everything" },
      { id: "D", text: "Upload the document over and over again" }
    ],
    correctAnswer: "B",
    feedback: "Yep! Summarize the important stuff, start fresh, and paste that summary in. Keeps things clean and ChatGPT stays sharp."
  },
  {
    id: 3,
    question: "Which of these will eat up your context window the fastest?",
    options: [
      { id: "A", text: "Short, direct prompts" },
      { id: "B", text: "Asking ChatGPT to keep responses brief" },
      { id: "C", text: "Long AI responses and uploaded files" },
      { id: "D", text: "Starting new conversations frequently" }
    ],
    correctAnswer: "C",
    feedback: "Right. ChatGPT's long answers and files burn through context like crazy. Keep responses concise when you can, and be strategic about what you upload."
  }
];

const templates = [
  {
    id: 1,
    title: "📄 THE FRESH START PROMPT",
    code: `Hey ChatGPT, I want to start a new conversation about [topic] but keep the context from our last chat. Here's what you need to know:
[Paste summary of important details from previous conversation]
Now, let's continue with [new task/question].`,
    whenToUse: "When you've hit 20-30 messages and need to keep going"
  },
  {
    id: 2,
    title: "📋 THE SUMMARY REQUEST",
    code: `Summarize everything important from our conversation so far. Include:
1. The main goal/project
2. Key decisions we've made
3. Important context about [audience/situation/constraints]
4. Where we are in the process
Keep it under 200 words.`,
    whenToUse: "Before starting fresh, or to check what ChatGPT still remembers"
  },
  {
    id: 3,
    title: "🎯 THE CONTEXT-PACKED OPENER",
    code: `You're a [role]. I need help with [task]. Important context:
- Goal: [what you're trying to achieve]
- Audience: [who this is for]
- Constraints: [limitations, requirements]
- Background: [relevant details]
Let's start with [first step].`,
    whenToUse: "Beginning of any new conversation where context matters"
  },
  {
    id: 4,
    title: "⚡ THE BRIEF RESPONSE REQUEST",
    code: `Got it. For your next response, keep it under 100 words and focus only on [specific thing I need]. We're burning through context and I need to keep this conversation going.`,
    whenToUse: "Mid-conversation when you need ChatGPT to be more concise"
  },
  {
    id: 5,
    title: "✅ THE MEMORY CHECK",
    code: `Quick check: do you still remember [important detail from earlier]? If not, here's a refresher: [brief recap].`,
    whenToUse: "Every 15-20 messages to make sure nothing critical got pushed out"
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

function FlashCard({ card }: { card: { id: number; front: string; back: string } }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className="h-64 cursor-pointer perspective-1000"
      data-testid={`flashcard-${card.id}`}
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
            borderColor: 'var(--border)',
            backgroundColor: '#072D24',
            color: '#FFFFFF'
          }}
        >
          <p className="text-base text-center text-foreground leading-relaxed whitespace-pre-line" style={{ color: '#FFFFFF' }}>
            {card.back}
          </p>
        </Card>
      </div>
    </div>
  );
}

function TemplateCard({ template, copiedTemplate, onCopy }: { template: typeof templates[0]; copiedTemplate: string | null; onCopy: (id: string) => void }) {
  return (
    <div data-testid={`template-${template.id}`} style={{ backgroundColor: '#f5efe0', paddingBottom: '16px', borderRadius: '8px', borderLeft: '4px solid #072D24' }}>
      <div className="rounded-lg" style={{ padding: '16px', paddingBottom: '0px' }}>
        <div className="flex items-center gap-2 font-medium mb-3">
          <h3 className="font-bold text-foreground mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
            {template.title}
          </h3>
        </div>
        <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', backgroundColor: '#072D24', color: '#FFFFFF', padding: '16px', borderRadius: '8px' }}>
          {template.code}
        </pre>
      </div>

      <p className="text-base text-foreground" style={{ paddingLeft: '20px', lineHeight: '1.6' }}>
        <strong className="font-semibold">When to use:</strong> {template.whenToUse}
      </p>
    </div>
  );
}

export default function WhyChatGPTForgets() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentScreen]);

  const handleQuizAnswer = (questionId: number, answer: string) => {
    const question = quizQuestions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = answer === question.correctAnswer;
    const existingAnswerIndex = quizAnswers.findIndex((a) => a.questionId === questionId);

    if (existingAnswerIndex >= 0) {
      const newAnswers = [...quizAnswers];
      newAnswers[existingAnswerIndex] = { questionId, answer, isCorrect };
      setQuizAnswers(newAnswers);
    } else {
      setQuizAnswers([...quizAnswers, { questionId, answer, isCorrect }]);
    }
  };

  const getAnswerForQuestion = (questionId: number) => {
    return quizAnswers.find((a) => a.questionId === questionId);
  };

  const isQuizComplete = quizAnswers.length === quizQuestions.length;
  const answeredCorrectly = quizAnswers.filter((a) => a.isCorrect).length;

  const copyToClipboard = async (text: string, templateId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTemplate(templateId);
      toast({
        title: "Copied!",
        description: "Template copied to clipboard",
      });
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const copyAllTemplates = async () => {
    const allTemplates = templates.map(t => `${t.title}\n\n${t.code}\n\nWhen to use: ${t.whenToUse}\n\n---\n`).join('\n');
    await copyToClipboard(allTemplates, 'all');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ProgressIndicator currentScreen={currentScreen} />

        {/* Screen 1: The Concept */}
        {currentScreen === 1 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto" data-testid="screen-concept">
            <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight" style={{ fontSize: '48px', lineHeight: '1.15' }}>
              Why ChatGPT 'Forgets' (And What To Do About It)
            </h1>

            <div className="max-w-none mb-8">
              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Okay, so you know how sometimes you're having a really productive conversation with ChatGPT, and then suddenly it's like talking to someone with amnesia?
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                You reference something from earlier, and it just... doesn't know what you're talking about.
                It's not glitching. You just hit the <strong className="font-bold">context window limit</strong>.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Think of ChatGPT's memory like a whiteboard. At the start of your conversation, the whiteboard is empty. Every message you send and every response it gives takes up space on that whiteboard.
                Eventually, the whiteboard fills up. And when there's no more room? It starts erasing stuff from the beginning to make space for new stuff.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                <strong className="font-bold">That's the context window.</strong> It's literally how much conversation history ChatGPT can "see" at once.
                For GPT-5, that's roughly 400,000 words depending on which version you're using. Sounds like a lot, right?
                But, as we know, it goes faster than you think...
              </p>

              <h2 className="text-4xl font-bold mt-12 mb-4 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>
                How Context Gets Consumed
              </h2>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Every part of your conversation eats up context:
              </p>

              <ul className="space-y-3 mb-6 text-foreground">
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span><strong className="font-semibold">Your prompts</strong> → Takes up space</span>
                </li>
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span><strong className="font-semibold">ChatGPT's responses</strong> → Takes up even MORE space (AI is chatty)</span>
                </li>
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span><strong className="font-semibold">Any files you upload</strong> → Takes up a TON of space</span>
                </li>
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span><strong className="font-semibold">Your conversation history</strong> → All of it, building up</span>
                </li>
              </ul>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                So if you're doing something like:
              </p>

              <ul className="space-y-3 mb-6 text-foreground">
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span>Editing a long document back and forth</span>
                </li>
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span>Having a multi-hour brainstorming session</span>
                </li>
                <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                  <span className="text-foreground mr-2 font-bold">•</span>
                  <span>Pasting in research and asking for analysis</span>
                </li>
              </ul>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                You're going to hit that limit way faster than you think.
                And when you do? The oldest parts of your conversation just... disappear from ChatGPT's 'memory.'
              </p>

              <h2 className="text-4xl font-bold mt-12 mb-4 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>
                The Fix: Conversation Management
              </h2>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                The good news? Once you know this is happening, it's actually pretty easy to manage.
                Here's the move:
              </p>

              <div className="space-y-6 mt-6 mb-6">
                <div>
                  <h3 className="font-bold mb-2 text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }}>1. Start fresh when you switch topics</h3>
                  <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>Don't try to use one conversation for everything. New project? New chat.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }}>2. Summarize and restart for long projects</h3>
                  <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>If you're 30 messages deep, ask ChatGPT to summarize everything important, copy that summary, and start a new chat with the summary as context.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }}>3. Front-load your context</h3>
                  <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>Put the most important info at the start of each message. Don't bury it in the middle of a long conversation—it might get pushed out.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }}>4. Use shorter responses when possible</h3>
                  <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>If you don't need a 500-word answer, tell ChatGPT to keep it brief. Saves context for what matters.</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2 text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }}>5. Check in periodically</h3>
                  <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>Every 15-20 messages, ask "Do you still remember [important detail]?" If it doesn't, it's time for a fresh start.</p>
                </div>
              </div>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Think of it like this: you wouldn't try to write an entire book in a single text message thread. Same logic applies here.
                Alright, let's make sure this sticks.
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
              <h2 className="font-bold mb-3 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Quick Review - Lock This In</h2>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Flip through these so you've got it down</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flashcards.map((card) => (
                <FlashCard key={card.id} card={card} />
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
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Answer these 3 questions to unlock your context management toolkit</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {quizQuestions.map((question) => {
                const answer = getAnswerForQuestion(question.id);
                const showFeedback = answer !== undefined;

                return (
                  <Card key={question.id} className="p-6 bg-card border-2 border-border" data-testid={`question-${question.id}`} style={{ marginBottom: '24px' }}>
                    <h3 className="mb-8 text-foreground font-medium" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                      Question {question.id}: {question.question}
                    </h3>

                    <div className="space-y-3">
                      {question.options.map((option) => {
                        const isSelected = answer?.answer === option.id;
                        const isCorrect = option.id === question.correctAnswer;
                        const showAsCorrect = showFeedback && isCorrect;
                        const showAsIncorrect = showFeedback && isSelected && !isCorrect;

                        return (
                          <div key={option.id}>
                            <button
                              onClick={() => handleQuizAnswer(question.id, option.id)}
                              disabled={answer !== undefined}
                              className={`w-full text-left rounded-lg transition-all relative overflow-hidden ${answer !== undefined ? "cursor-not-allowed" : "cursor-pointer"
                                }`}
                              style={{
                                fontSize: '16px',
                                padding: '18px 20px',
                                lineHeight: '1.6',
                                border: showAsCorrect
                                  ? '2px solid #A8D5B7'
                                  : showAsIncorrect
                                    ? '2px solid #DC2626'
                                    : isSelected
                                      ? '2px solid #072D24'
                                      : answer !== undefined
                                        ? '2px solid #E6D8B3'
                                        : '2px solid #072D24',
                                background: showAsCorrect
                                  ? '#A8D5B7'
                                  : showAsIncorrect
                                    ? '#FEF2F2'
                                    : isSelected
                                      ? '#FFFFFF'
                                      : answer !== undefined
                                        ? '#F5EFE0'
                                        : '#FFFFFF',
                                color: showAsCorrect
                                  ? '#072D24'
                                  : showAsIncorrect
                                    ? '#991B1B'
                                    : '#072D24'
                              }}
                              data-testid={`answer-${question.id}-${option.id}`}
                            >
                              <span className="font-bold mr-2">{option.id})</span>
                              {option.text}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {showFeedback && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="rounded-lg mt-3"
                        style={{
                          padding: '24px',
                          background: answer.isCorrect ? '#A8D5B7' : '#FEF2F2',
                          borderLeft: answer.isCorrect ? '4px solid #072D24' : '4px solid #DC2626',
                          color: answer.isCorrect ? '#072D24' : '#991B1B',
                          marginTop: '12px'
                        }}
                        data-testid={`feedback-${question.id}`}
                      >
                        <p style={{
                          fontSize: '16px',
                          lineHeight: '1.6',
                          fontWeight: 600,
                          marginBottom: '8px'
                        }}>
                          {answer.isCorrect ? '✓ Correct!' : '✗ Not quite.'}
                        </p>
                        <p style={{
                          fontSize: '16px',
                          lineHeight: '1.6'
                        }}>
                          {question.feedback}
                        </p>
                      </div>
                    )}
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

        {/* Screen 4: Results + Templates */}
        {currentScreen === 4 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto text-center" data-testid="screen-results">
            <h2 className="font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>
              Nice Work! Here Are Your 5 Context Management Templates
            </h2>

            <div className="bg-card rounded-lg p-8 mb-8 border-2 border-border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <p className="font-bold text-foreground" style={{ fontSize: '24px', lineHeight: '1.3' }} data-testid="text-score">
                  You got {answeredCorrectly}/3 correct!
                </p>
                <PartyPopper className="w-6 h-6 text-primary" />
              </div>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>
                Use these to keep your AI conversations sharp, even when they get long.
              </p>
            </div>

            <div className="space-y-6 mb-12 text-left">
              {templates.map((template, index) => (
                <div key={template.id} style={{ marginBottom: index < templates.length - 1 ? '24px' : '0' }}>
                  <TemplateCard
                    template={template}
                    copiedTemplate={copiedTemplate}
                    onCopy={(id) => copyToClipboard(template.code, id)}
                  />
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-border my-8"></div>

            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-xl font-semibold text-foreground">
                Great! You just learned how to keep ChatGPT sharp even in long conversations.
              </p>

              <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                Want 100+ more lessons like this? Practical AI training that:
              </p>

              <div className="text-left max-w-md mx-auto space-y-2 text-base text-foreground">
                <p className="font-semibold">Every lesson includes:</p>
                <p>• Takes 5 minutes, not 5 hours</p>
                <p>• Gives you ready-to-use templates</p>
                <p>• Actually makes AI useful (not overwhelming)</p>
                <p>• No fluff. No boring lectures. Just the stuff that works.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button
                onClick={copyAllTemplates}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-8 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-copy-all"
              >
                {copiedTemplate === 'all' ? (
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

