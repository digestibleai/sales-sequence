import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, FileText, Target, BarChart3, PenTool, Award } from "lucide-react";


interface FlashcardData {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  feedback: string;
}

const flashcards: FlashcardData[] = [
  {
    front: "What do automation tools like Zapier and Make actually do?",
    back: "They connect your apps together and run tasks automatically based on triggers—like 'when this happens, do that.' No coding required."
  },
  {
    front: "How does AI fit into automation?",
    back: "You can add AI (like ChatGPT or Claude) into your workflows to automatically process, analyze, summarize, or generate content—without manual copy-pasting."
  },
  {
    front: "What's the difference between Zapier and Make?",
    back: "Zapier is simpler and more beginner-friendly (fill-in-the-blanks). Make is more powerful with a visual editor and more complex workflows. Both do the same core thing."
  },
  {
    front: "Why is automation easier to learn than people think?",
    back: "It's just 'if this, then that' logic. Both tools have templates and visual interfaces. If you can think through basic cause-and-effect, you can build automations."
  }
];

const quizQuestions: QuizQuestion[] = [
  {
    question: "What's the main benefit of using automation tools with AI?",
    options: [
      "It makes AI faster",
      "Tasks that required manual copy-pasting now happen automatically in the background",
      "You can use AI on your phone",
      "It makes AI cheaper"
    ],
    correct: 1,
    feedback: "Exactly! Instead of you being the robot copying and pasting between tools, automation does it for you. That's the whole point."
  },
  {
    question: "You want to automatically summarize every email from your boss and save it to Notion. What would this workflow look like?",
    options: [
      "When email arrives from boss → AI summarizes it → Saves to Notion",
      "Manually check email → Copy to ChatGPT → Paste to Notion",
      "Email automatically deletes itself",
      "You need to hire a developer to build this"
    ],
    correct: 0,
    feedback: "Yes! That's exactly how automation works. Trigger (email arrives) → Action with AI (summarize) → Final action (save to Notion). Set it once, runs forever."
  },
  {
    question: "How hard is it to learn basic automation with Zapier or Make?",
    options: [
      "You need to learn programming first",
      "It takes months of practice",
      "About as hard as learning Excel—an afternoon to get started, a weekend to get good",
      "Impossible without a computer science degree"
    ],
    correct: 2,
    feedback: "Right! It's way easier than people think. If you can handle 'if this, then that' logic, you can build automations. Both tools have templates to get you started."
  }
];

function Flashcard({ data, index }: { data: FlashcardData; index: number }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(!flipped);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <button
      onClick={handleFlip}
      onKeyDown={handleKeyPress}
      className="relative w-full h-64 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
      style={{ perspective: "1000px" }}
      data-testid={`flashcard-${index}`}
      aria-label={`Flashcard ${index + 1}: ${flipped ? 'showing answer' : 'showing question'}`}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)"
        }}
      >
        <div
          className="absolute w-full h-full p-6 flex items-center justify-center text-center bg-white border-2 border-border rounded-lg shadow-sm hover:-translate-y-0.5 transition-transform duration-300"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <p className="text-base font-normal leading-relaxed">{data.front}</p>
          </div>
        </div>
        <div
          className="absolute w-full h-full p-6 flex items-center justify-center text-center bg-white border-2 border-border rounded-lg shadow-sm"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div>
            <p className="text-base font-normal leading-relaxed">{data.back}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

function QuizOption({
  option,
  index,
  selected,
  correct,
  answered,
  onClick
}: {
  option: string;
  index: number;
  selected: boolean;
  correct: boolean;
  answered: boolean;
  onClick: () => void;
}) {
  let bgClass = "bg-white border-2 border-[#333]";
  let hoverClass = "hover:bg-[rgba(7,45,36,0.08)] hover:translate-x-2";

  if (answered) {
    if (correct && selected) {
      bgClass = "bg-green-50 border-green-500 border-2";
      hoverClass = "";
    } else if (!correct && selected) {
      bgClass = "bg-red-50 border-red-500 border-2";
      hoverClass = "";
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={answered}
      className={`w-full text-left px-5 py-[18px] rounded-lg font-medium transition-all duration-200 ${bgClass} ${!answered ? hoverClass : ""} ${answered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      data-testid={`quiz-option-${index}`}
    >
      {option}
    </button>
  );
}

function ProgressIndicator({ currentScreen }: { currentScreen: number }) {
  const steps = [1, 2, 3, 4];

  return (
    <div
      className="flex items-center justify-center max-w-[400px] mx-auto mt-10 mb-12 px-5"
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
              className={`flex items-center justify-center rounded-full transition-all duration-300 ease-in-out
                w-10 h-10 sm:w-14 sm:h-14 text-lg sm:text-2xl
                ${isCompleted ? 'bg-[#072D24] text-white font-bold' : ''}
                ${isActive ? 'bg-[#A8D5B7] text-[#072D24] border-2 border-[#072D24] font-bold' : ''}
                ${isUpcoming ? 'bg-white text-[#6A7CA7] border-2 border-[#E6D8B3] font-medium' : ''}
              `}
              style={{
                fontFamily: 'Poppins'
              }}
              data-testid={`progress-step-${step}`}
            >
              {isCompleted ? '✓' : step}
            </div>

            {/* Connector Line (don't render after last step) */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-10 sm:w-[60px] transition-all duration-300 ease-in-out
                  ${step < currentScreen ? 'bg-[#A8D5B7]' : 'bg-[#E6D8B3]'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Screen1({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-8" data-testid="screen-1">
      <h1 className="text-[48px] font-bold text-foreground leading-[1.15]">
        Automation Tools: Making AI Actually Work For You
      </h1>

      <div className="space-y-6 text-base leading-relaxed">
        <p>
          Alright, let's be honest about how most people use AI right now:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Something happens (email arrives, form submitted, message received)</li>
          <li>You manually copy the info</li>
          <li>You open ChatGPT</li>
          <li>You paste it in with a prompt</li>
          <li>You wait for a response</li>
          <li>You copy that response</li>
          <li>You paste it somewhere else</li>
        </ol>
        <p className="font-semibold">You're the robot in this scenario. And that's... not ideal.</p>

        <p>Here's what should happen instead:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Something happens</li>
          <li>Everything else happens automatically</li>
          <li>You get notified when it's done</li>
        </ol>
        <p>That's what automation tools do. And they're way simpler than you think.</p>

        <div className="border-b-2 border-dashed border-border my-8 pb-8">
          <h2 className="text-4xl font-bold mb-4 text-foreground">What Are Zapier and Make?</h2>
          <p>
            Think of them as connectors between your apps.
            <strong> Zapier</strong> and <strong>Make</strong> let you build 'workflows' that do stuff automatically:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>When someone fills out your form → AI summarizes it → Sends you a Slack message</li>
            <li>When you get an email → AI categorizes it → Adds it to the right project in Notion</li>
            <li>When you save an article → AI creates a summary → Saves it to your reading list</li>
          </ul>
          <p className="mt-3">
            No coding required. It's basically visual flowcharts: "When this happens, do that."
            And here's the game-changer: <strong>both tools integrate with AI.</strong>
          </p>
          <p className="mt-3">
            You can drop ChatGPT, Claude, or other AI tools right into the middle of your workflows. So instead of you manually using AI, your systems use AI automatically.
          </p>
        </div>

        <div className="border-b-2 border-dashed border-border my-8 pb-8">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Why This Matters</h2>
          <p>
            Most people think AI is impressive because it can write or analyze things.
            Cool. But you know what's actually impressive?
          </p>
          <p className="font-semibold text-xl my-3">
            AI doing those things automatically, in the background, across all your tools, without you touching anything.
          </p>
          <p>
            That's when AI stops being a toy and starts being infrastructure.
          </p>
          <p className="mt-3">Examples:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your customer support form → Auto-categorizes issues → Routes to the right team → Drafts a response</li>
            <li>Your meeting notes → Auto-summarizes → Creates action items → Adds them to your task manager</li>
            <li>Your content calendar → Auto-generates first drafts → Saves them in Google Docs → Notifies your team</li>
          </ul>
          <p className="mt-3 font-semibold">
            You set it up once. It runs forever.
          </p>
        </div>

        <div className="border-b-2 border-dashed border-border my-8 pb-8">
          <h2 className="text-4xl font-bold mb-4 text-foreground">'But Isn't This Hard To Learn?'</h2>
          <p>
            Here's the secret nobody tells you: <strong>it's easier than people make it out to be.</strong>
          </p>
          <p className="mt-3">
            Seriously. If you can think through "if this, then that" logic, you can build automations.
          </p>
          <p className="mt-3">
            <strong>Zapier</strong> is basically fill-in-the-blanks:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Trigger: "When this happens..."</li>
            <li>Action: "Do this..."</li>
            <li>Done.</li>
          </ul>
          <p className="mt-3">
            <strong>Make</strong> gives you more control with a visual editor where you drag and drop modules. Slightly more complex, but also way more powerful once you get the hang of it.
          </p>
          <p className="mt-3">
            Both have templates for common workflows. You literally just click "Use this template," connect your apps, and it works.
          </p>
          <p className="mt-3">
            The learning curve is like an afternoon, maybe a weekend if you want to get fancy.
            Compare that to the hours you're wasting doing repetitive tasks manually, and it's a no-brainer.
          </p>
        </div>

        <div className="border-b-2 border-dashed border-border my-8 pb-8">
          <h2 className="text-4xl font-bold mb-4 text-foreground">The Actual Future of Work</h2>
          <p>Here's where this is going:</p>
          <p className="mt-3">Right now, AI is a tool you use.</p>
          <p className="font-semibold">Soon, AI will be infrastructure that runs in the background of everything you do.</p>
          <p className="mt-3">
            The people who learn automation now are the ones who'll be working 10x smarter than everyone else in a year.
            Not because they're doing more work. Because they've automated the boring stuff and only focus on the things that actually matter.
          </p>
          <p className="mt-3">
            You don't need to become an automation expert. You just need to understand the basics and build a few workflows.
            Let's make sure this clicks.
          </p>
        </div>
      </div>

      <div className="pt-6">
        <Button
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold px-10 py-5 rounded-lg min-h-[60px]"
          data-testid="button-next"
        >
          Continue to Practice →
        </Button>
      </div>
    </div>
  );
}

function Screen2({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-8" data-testid="screen-2">
      <div>
        <h1 className="text-[48px] font-bold text-foreground leading-[1.15] mb-3">
          Quick Review: Lock This In
        </h1>
        <p className="text-xl text-muted-foreground">Flip these to make sure you've got it</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {flashcards.map((card, index) => (
          <Flashcard key={index} data={card} index={index} />
        ))}
      </div>

      <div className="pt-4">
        <Button
          onClick={onNext}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold px-10 py-5 rounded-lg min-h-[60px]"
          data-testid="button-next"
        >
          Test Your Knowledge →
        </Button>
      </div>
    </div>
  );
}

function Screen3({ onNext }: { onNext: (score: number) => void }) {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [showFeedback, setShowFeedback] = useState<boolean[]>([false, false, false]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (answers[questionIndex] !== null) return;

    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);

    const newFeedback = [...showFeedback];
    newFeedback[questionIndex] = true;
    setShowFeedback(newFeedback);
  };

  const allAnswered = answers.every(a => a !== null);
  const score = answers.reduce((sum: number, answer, index) => {
    return sum + (answer === quizQuestions[index].correct ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-8" data-testid="screen-3">
      <div>
        <h1 className="text-[48px] font-bold text-foreground leading-[1.15] mb-3">
          Quick Check: Did It Click?
        </h1>
        <p className="text-xl text-muted-foreground">
          Answer these 3 questions to unlock your automation starter pack
        </p>
      </div>

      <div className="space-y-8">
        {quizQuestions.map((quiz, qIndex) => (
          <div key={qIndex} className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">
              Question {qIndex + 1}: {quiz.question}
            </h3>
            <div className="space-y-3">
              {quiz.options.map((option, oIndex) => (
                <QuizOption
                  key={oIndex}
                  option={option}
                  index={oIndex}
                  selected={answers[qIndex] === oIndex}
                  correct={oIndex === quiz.correct}
                  answered={answers[qIndex] !== null}
                  onClick={() => handleAnswer(qIndex, oIndex)}
                />
              ))}
            </div>
            {showFeedback[qIndex] && (
              <div
                className={`p-5 rounded-lg ${answers[qIndex] === quiz.correct
                  ? "bg-[#A8D5B7] border-l-4 border-l-[#072D24]"
                  : "bg-[#FEF2F2] border-l-4 border-l-[#DC2626]"
                  }`}
                role="alert"
                aria-live="polite"
                data-testid={`feedback-${qIndex}`}
              >
                <p className={`font-bold mb-2 ${answers[qIndex] === quiz.correct
                  ? "text-[#072D24]"
                  : "text-[#DC2626]"
                  }`}>
                  {answers[qIndex] === quiz.correct ? "✓ Correct!" : "✗ Not quite."}
                </p>
                <p className={`${answers[qIndex] === quiz.correct
                  ? "text-[#072D24]"
                  : "text-[#991B1B]"
                  }`}>
                  {quiz.feedback}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          onClick={() => onNext(score)}
          disabled={!allAnswered}
          className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold px-10 py-5 rounded-lg min-h-[60px] disabled:bg-muted-foreground/40 disabled:cursor-not-allowed disabled:hover:bg-muted-foreground/40"
          data-testid="button-next"
        >
          See My Results →
        </Button>
      </div>
    </div>
  );
}

function Screen4({ score }: { score: number }) {
  const automations = [
    {
      icon: Mail,
      title: "AUTO-SUMMARIZE IMPORTANT EMAILS",
      description: "When you receive an email from specific people (boss, key clients, etc.), AI summarizes it and sends you a Slack/Teams message with the TLDR.",
      tools: "Gmail/Outlook + OpenAI/Claude + Slack/Teams",
      why: "You see what matters without reading every email word-for-word.",
      workflow: [
        "Trigger: New email from [specific sender]",
        "Action: Send email to AI with prompt \"Summarize this in 3 bullet points\"",
        "Action: Send AI summary to Slack/Teams"
      ]
    },
    {
      icon: FileText,
      title: "AUTO-CREATE MEETING NOTES",
      description: "After a meeting, automatically take your calendar event description or recording transcript, have AI create structured notes, and save them to Notion/Google Docs.",
      tools: "Google Calendar/Zoom + OpenAI/Claude + Notion/Google Docs",
      why: "Meeting notes happen automatically. No more \"I'll write that up later\" (and then never doing it).",
      workflow: [
        "Trigger: Meeting ends in calendar",
        "Action: Send meeting details/transcript to AI with prompt \"Create structured meeting notes with action items\"",
        "Action: Save formatted notes to Notion/Docs"
      ]
    },
    {
      icon: Target,
      title: "AUTO-TRIAGE CUSTOMER SUPPORT",
      description: "When someone submits a support request, AI categorizes it (urgent/normal/low priority), tags it by topic, and routes it to the right team.",
      tools: "Form/Email + OpenAI/Claude + Project management tool (Asana/ClickUp/Trello)",
      why: "Support requests get handled faster because they're already sorted and assigned.",
      workflow: [
        "Trigger: New form submission",
        "Action: Send to AI with prompt \"Categorize this support request by urgency and topic\"",
        "Action: Create task in project management tool with AI's categorization",
        "Action: Assign to appropriate team based on category"
      ]
    },
    {
      icon: BarChart3,
      title: "AUTO-ANALYZE FORM RESPONSES",
      description: "When someone fills out a survey/form, AI analyzes the response, extracts key insights, and adds them to a spreadsheet with tags.",
      tools: "Google Forms/Typeform + OpenAI/Claude + Google Sheets/Airtable",
      why: "Get insights from form submissions instantly instead of manually reading through responses.",
      workflow: [
        "Trigger: New form submission",
        "Action: Send response to AI with prompt \"Extract key insights and sentiment from this response\"",
        "Action: Add analysis to spreadsheet with auto-generated tags"
      ]
    },
    {
      icon: PenTool,
      title: "AUTO-DRAFT SOCIAL POSTS",
      description: "When you save an article/blog post, AI creates 3 social media posts for different platforms and saves them to your content calendar.",
      tools: "RSS/Pocket + OpenAI/Claude + Google Sheets/Notion",
      why: "Content repurposing happens automatically. Never stare at a blank screen wondering what to post.",
      workflow: [
        "Trigger: New article saved",
        "Action: Send article to AI with prompt \"Create 3 social posts: one for Twitter, one for LinkedIn, one for Instagram\"",
        "Action: Save all 3 posts to content calendar"
      ]
    }
  ];

  return (
    <div className="space-y-8" data-testid="screen-4">
      <div className="text-center">
        <h1 className="text-[48px] font-bold text-foreground leading-[1.15] mb-3">
          Nice Work! Here Are 5 Automations You Can Build Today
        </h1>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Award className="w-8 h-8 text-primary" />
          <p className="text-2xl font-semibold text-primary" data-testid="quiz-score">
            You got {score}/3 correct!
          </p>
        </div>
        <p className="text-xl text-muted-foreground">
          Real automations you can build in under 30 minutes each.
        </p>
      </div>

      <div className="space-y-6">
        {automations.map((auto, index) => {
          const IconComponent = auto.icon;
          return (
            <Card key={index} className="bg-[#F5EFE0] p-6 border-2 border-[#E6D8B3]" data-testid={`automation-${index}`}>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                  <IconComponent className="w-8 h-8 text-primary" />
                  {auto.title}
                </h3>
                <div className="space-y-2 text-base text-foreground">
                  <p>
                    <strong className="text-foreground">What it does:</strong> {auto.description}
                  </p>
                  <p>
                    <strong className="text-foreground">Tools needed:</strong> {auto.tools}
                  </p>
                  <p>
                    <strong className="text-foreground">Why it's useful:</strong> {auto.why}
                  </p>
                  <div>
                    <strong>Workflow:</strong>
                    <ul className="list-disc pl-6 mt-1 space-y-1">
                      {auto.workflow.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="pt-8 space-y-6">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="text-xl font-semibold text-foreground">
            You just learned how to make AI work for you—automatically.
          </p>
          <p className="text-base text-foreground">
            This is 1 of 100+ no-fluff lessons designed to make AI actually useful (not overwhelming).
          </p>
          <div className="text-left max-w-md mx-auto space-y-2 text-base text-foreground">
            <p className="font-semibold">What you get:</p>
            <p>✓ 5-minute lessons (no 3-hour courses)</p>
            <p>✓ Copy-paste workflows and templates</p>
            <p>✓ Real automation you can build today</p>
          </div>
          <p className="text-lg font-semibold text-foreground pt-2">
            Stop being the robot. Let AI handle the repetitive stuff.
          </p>
        </div>

        <div className="text-center">
          <Button
            onClick={() => window.open('https://www.digestibly.ai/offers/rXwTSUjT/checkout', '_blank', 'noopener,noreferrer')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold px-10 py-5 rounded-lg min-h-[60px]"
            data-testid="button-cta"
            aria-label="Start free trial (opens in new tab)"
          >
            Start Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AutomationTools() {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [quizScore, setQuizScore] = useState(0);

  const handleNext = (score?: number) => {
    if (score !== undefined) {
      setQuizScore(score);
    }
    setCurrentScreen(currentScreen + 1);
  };

  // Auto-scroll to top when screen changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentScreen]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <ProgressIndicator currentScreen={currentScreen} />

        {currentScreen === 1 && <Screen1 onNext={handleNext} />}
        {currentScreen === 2 && <Screen2 onNext={handleNext} />}
        {currentScreen === 3 && <Screen3 onNext={handleNext} />}
        {currentScreen === 4 && <Screen4 score={quizScore} />}
      </div>
    </div>
  );
}

