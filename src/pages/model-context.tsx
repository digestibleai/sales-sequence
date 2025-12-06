import { useState, useEffect } from "react";
import { ChevronRight, Download, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Screen = 1 | 2 | 3 | 4;

interface FlashcardData {
  id: number;
  front: string;
  back: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correct: string;
  feedback: string;
}

const flashcards: FlashcardData[] = [
  {
    id: 1,
    front: "What is Model Context Protocol (MCP)?",
    back: "An open standard that lets Claude connect directly to your data sources and tools—no more copying and pasting. Claude can read files, access databases, connect to APIs, etc.",
  },
  {
    id: 2,
    front: "What's the main benefit of using MCP?",
    back: "Claude works with your actual, live data instead of copied snapshots. You can ask questions about current information, work with larger datasets, and build real workflows.",
  },
  {
    id: 3,
    front: "Do you need to be a developer to use MCP?",
    back: "Nope. There are pre-built MCP servers for common tools. Setup is usually just installing the server and adding a few lines to a config file—takes 10-15 minutes.",
  },
  {
    id: 4,
    front: "What's the difference between using Claude normally vs. with MCP?",
    back: "Normal: You copy data → paste into Claude → copy response. MCP: Claude directly accesses your data sources and can read/write without you being the middleman.",
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "You want Claude to analyze all your project files without manually copying them. What does MCP let you do?",
    options: [
      { label: "A", text: "Nothing, you still have to copy-paste everything" },
      { label: "B", text: "Connect Claude directly to your file system so it can read files on demand" },
      { label: "C", text: "Email your files to Anthropic" },
      { label: "D", text: "Use ChatGPT instead" },
    ],
    correct: "B",
    feedback: "MCP gives Claude direct access to your files. You can literally say 'read all files in this folder' and it does it.",
  },
  {
    id: 2,
    question: "What's the biggest advantage of MCP compared to copy-pasting data into Claude?",
    options: [
      { label: "A", text: "It makes Claude respond faster" },
      { label: "B", text: "Claude works with live, current data and can handle much larger datasets" },
      { label: "C", text: "It's free (copy-pasting costs money)" },
      { label: "D", text: "You can use more AI models" },
    ],
    correct: "B",
    feedback: "With MCP, Claude always works with the latest version of your data and isn't limited by how much you can paste into a chat window.",
  },
  {
    id: 3,
    question: "How hard is it to set up your first MCP connection?",
    options: [
      { label: "A", text: "You need to learn programming first" },
      { label: "B", text: "It requires hiring a developer" },
      { label: "C", text: "About 10-15 minutes using pre-built servers and simple config" },
      { label: "D", text: "Impossible for non-technical users" },
    ],
    correct: "C",
    feedback: "There are pre-built MCP servers for common tools. Setup is straightforward—download, configure, done. First one takes 10-15 minutes.",
  },
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

function FlashCard({ card, index }: { card: FlashcardData; index: number }) {
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
          <p className="text-base text-center text-foreground leading-relaxed">
            {card.back}
          </p>
        </Card>
      </div>
    </div>
  );
}

function handleExportPDF() {
  const printContent = document.getElementById("mcp-setup-guides");
  if (!printContent) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MCP Setup Guides</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap');
          
          body {
            font-family: 'Poppins', sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            color: #333;
          }
          h1 {
            color: #072d24;
            margin-bottom: 30px;
            font-size: 32px;
            font-weight: 700;
          }
          h2 {
            color: #072d24;
            font-size: 24px;
            font-weight: 700;
            margin-top: 30px;
            margin-bottom: 15px;
            page-break-after: avoid;
          }
          h3 {
            color: #072d24;
            font-size: 18px;
            font-weight: 700;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          .guide {
            border: 2px solid #333;
            border-radius: 8px;
            padding: 24px;
            margin-bottom: 24px;
            page-break-inside: avoid;
          }
          .section {
            margin-bottom: 16px;
          }
          .section-title {
            font-weight: 700;
            color: #072d24;
            margin-bottom: 8px;
          }
          .section-content {
            color: #666;
            line-height: 1.6;
          }
          ul, ol {
            margin-left: 20px;
            color: #666;
            line-height: 1.8;
          }
          code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 13px;
            border: 1px solid #ddd;
          }
          .getting-started {
            background: #f9f9f9;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 24px;
            margin-top: 30px;
          }
          @media print {
            body { padding: 20px; }
            .guide { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

export default function ModelContext() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentScreen]);

  const handleQuizAnswer = (questionId: number, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionId]: answer });
    setShowFeedback({ ...showFeedback, [questionId]: true });
  };

  const isQuizComplete = Object.keys(quizAnswers).length === quizQuestions.length;
  const correctAnswers = quizQuestions.filter((q) => quizAnswers[q.id] === q.correct).length;

  const handleRestart = () => {
    setCurrentScreen(1);
    setQuizAnswers({});
    setShowFeedback({});
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ProgressIndicator currentScreen={currentScreen} />

        {/* Screen 1: The Concept */}
        {currentScreen === 1 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto" data-testid="screen-concept">
            <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight" style={{ fontSize: '48px', lineHeight: '1.15' }}>
              Model Context Protocol: Giving Claude Direct Access
            </h1>

            <div className="max-w-none mb-8">
              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Okay, let's talk about how you probably use Claude right now.
                You have some information—could be files on your computer, stuff in Notion, a database, whatever. You want Claude to work with it.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                So you:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mb-6 text-foreground">
                <li className="text-base" style={{ lineHeight: '1.6' }}>Open the file or tool</li>
                <li className="text-base" style={{ lineHeight: '1.6' }}>Copy the content</li>
                <li className="text-base" style={{ lineHeight: '1.6' }}>Go to Claude</li>
                <li className="text-base" style={{ lineHeight: '1.6' }}>Paste it in</li>
                <li className="text-base" style={{ lineHeight: '1.6' }}>Get a response</li>
                <li className="text-base" style={{ lineHeight: '1.6' }}>Maybe copy that response somewhere else</li>
              </ol>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                You're the middleman. And that gets old really fast.
                <br />
                <strong>MCP changes that entirely.</strong>
              </p>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>What Is Model Context Protocol?</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  In the simplest terms: <strong>MCP lets Claude connect directly to your stuff.</strong>
                  <br />
                  Your files. Your databases. Your tools. Your APIs.
                  <br />
                  Instead of you being the messenger between Claude and your data, Claude just... accesses it. Directly.
                </p>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Think of it like this:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-6 text-foreground">
                  <li className="text-base" style={{ lineHeight: '1.6' }}><strong>Before MCP:</strong> You're a waiter bringing food from the kitchen to Claude's table.</li>
                  <li className="text-base" style={{ lineHeight: '1.6' }}><strong>With MCP:</strong> Claude can walk into the kitchen and grab what it needs.</li>
                </ul>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Anthropic created MCP as an open standard—meaning anyone can build connections (called "servers") between Claude and basically any data source or tool.
                  And here's the cool part: <strong>you don't need to be a developer to use it.</strong>
                </p>
              </div>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Why This Actually Matters</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Most people think "okay, so it saves me some copying and pasting. Big deal."
                  <br />
                  But it's way bigger than that.
                </p>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  When Claude has direct access to your data:
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <strong className="text-foreground">1. You can ask it questions about live data</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      "What are my top 5 expenses this month?" → Claude checks your actual spreadsheet, not a copy from last week.
                    </span>
                  </div>

                  <div>
                    <strong className="text-foreground">2. You can work with way more information</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      No more "this file is too big to paste." Claude can read entire folder structures, databases, whatever.
                    </span>
                  </div>

                  <div>
                    <strong className="text-foreground">3. You can build actual workflows</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      Claude can read from one place, process it, and write to another—all without you touching anything.
                    </span>
                  </div>

                  <div>
                    <strong className="text-foreground">4. Your context stays current</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      No more outdated copy-pasted data. Claude always works with the latest version.
                    </span>
                  </div>
                </div>

                <p className="text-base text-foreground mb-6 font-semibold" style={{ lineHeight: '1.6' }}>
                  This is the difference between using AI as a chatbot and using AI as actual infrastructure.
                </p>
              </div>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>How Anyone Can Set This Up</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Here's what stops most people: they think MCP is some complicated developer thing.
                  <br />
                  It's not. Here's how it actually works:
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <strong className="text-foreground">Step 1: Grab the MCP server you want</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      There are pre-built servers for common tools (Google Drive, Notion, file systems, databases, etc.). Claude has pre-built connectors for these you can just <em>turn on</em>.
                    </span>
                  </div>

                  <div>
                    <strong className="text-foreground">Step 2: Configure it in Claude Desktop</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      You tell Claude "hey, I want you to be able to access [this thing]." Usually just a few lines in a config file. Then you need to authenticate as normal.
                    </span>
                  </div>

                  <div>
                    <strong className="text-foreground">Step 3: That's it. Use it.</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      Now when you talk to Claude, it can directly access that data source.
                    </span>
                  </div>
                </div>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  The whole setup? Like 10-15 minutes for your first one. After that, each new connection takes maybe 5 minutes.
                </p>
              </div>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Real Examples</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <strong className="text-foreground">Connect to your file system:</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      "Claude, read all the markdown files in my Projects folder and create a summary of active projects."
                      <br />
                      → Claude actually reads your files directly.
                    </span>
                  </div>

                  <div>
                    <strong className="text-foreground">Connect to Google Drive:</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      "Claude, what are the main action items from our Q4 planning doc?"
                      <br />
                      → Claude opens the doc, reads it, tells you.
                    </span>
                  </div>

                  <div>
                    <strong className="text-foreground">Connect to Slack:</strong>
                    <br />
                    <span className="text-muted-foreground" style={{ fontSize: '16px' }}>
                      "Claude, summarize this week's conversations in the #product channel."
                      <br />
                      → Claude reads your Slack history, summarizes it.
                    </span>
                  </div>
                </div>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  No copying. No pasting. Claude just works with your actual data.
                </p>

                <p className="text-base text-foreground mb-6 font-semibold" style={{ lineHeight: '1.6' }}>
                  This is where AI stops being a toy you play with and starts being infrastructure you build on.
                  <br />
                  Let's make sure this clicks.
                </p>
              </div>
            </div>

            <Button
              onClick={() => setCurrentScreen(2)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
              style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
              data-testid="button-continue-1"
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
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Flip through these so it sticks</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {flashcards.map((card, index) => (
                <FlashCard key={card.id} card={card} index={index} />
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
              <h2 className="font-bold mb-3 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>Quick Check: Did It Click?</h2>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Answer these 3 questions to unlock your MCP setup guide</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {quizQuestions.map((question, idx) => (
                <div key={question.id} className="space-y-4">
                  <h3 className="mb-8 text-foreground font-medium" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                    Question {idx + 1}: {question.question}
                  </h3>

                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const isSelected = quizAnswers[question.id] === option.label;
                      const isCorrect = option.label === question.correct;
                      const showResult = showFeedback[question.id];

                      return (
                        <button
                          key={option.label}
                          onClick={() => handleQuizAnswer(question.id, option.label)}
                          disabled={showFeedback[question.id]}
                          className={`w-full text-left rounded-lg transition-all relative overflow-hidden ${showFeedback[question.id] ? "cursor-not-allowed" : "cursor-pointer"
                            }`}
                          style={{
                            fontSize: '16px',
                            padding: '18px 20px',
                            lineHeight: '1.6',
                            border: showResult && isCorrect
                              ? '2px solid #A8D5B7'
                              : showResult && isSelected && !isCorrect
                                ? '2px solid #DC2626'
                                : isSelected
                                  ? '2px solid #072D24'
                                  : showFeedback[question.id]
                                    ? '2px solid #E6D8B3'
                                    : '2px solid #072D24',
                            background: showResult && isCorrect
                              ? '#A8D5B7'
                              : showResult && isSelected && !isCorrect
                                ? '#FEF2F2'
                                : isSelected
                                  ? '#FFFFFF'
                                  : showFeedback[question.id]
                                    ? '#F5EFE0'
                                    : '#FFFFFF',
                            color: showResult && isCorrect
                              ? '#072D24'
                              : showResult && isSelected && !isCorrect
                                ? '#991B1B'
                                : '#072D24'
                          }}
                          data-testid={`quiz-${question.id}-option-${option.label}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-bold min-w-[24px]">{option.label})</span>
                            <span className="flex-1">{option.text}</span>
                            {showResult && isCorrect && (
                              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback[question.id] && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="rounded-lg mb-6"
                      style={{
                        padding: '24px',
                        background: quizAnswers[question.id] === question.correct ? '#A8D5B7' : '#FEF2F2',
                        borderLeft: quizAnswers[question.id] === question.correct ? '4px solid #072D24' : '4px solid #DC2626',
                        color: quizAnswers[question.id] === question.correct ? '#072D24' : '#991B1B'
                      }}
                      data-testid={`quiz-${question.id}-feedback`}
                    >
                      <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        fontWeight: 600,
                        marginBottom: '8px'
                      }}>
                        {quizAnswers[question.id] === question.correct ? "✓ Correct!" : "✗ Not quite."}
                      </p>
                      <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6'
                      }}>
                        {question.feedback}
                      </p>
                    </div>
                  )}

                  {idx < quizQuestions.length - 1 && (
                    <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border)', paddingTop: '16px' }}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto pt-4">
              <Button
                onClick={() => setCurrentScreen(4)}
                disabled={!isQuizComplete}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold px-10 py-5 rounded-lg min-h-[60px] disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
                style={{ marginTop: '20px' }}
                data-testid="button-next"
              >
                See My Results →
              </Button>
            </div>
          </div>
        )}

        {/* Screen 4: Results */}
        {currentScreen === 4 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto text-center" data-testid="screen-results">
            <h2 className="font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>
              Nice Work! Here Are 5 Practical MCP Setups
            </h2>

            <div className="bg-card rounded-lg p-8 mb-8 border-2 border-border">
              <p className="font-bold text-foreground mb-2" style={{ fontSize: '24px', lineHeight: '1.3' }} data-testid="quiz-score">
                You got {correctAnswers}/3 correct! 🎉
              </p>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>
                Real MCP connections you can set up today. Each takes 10-20 minutes max.
              </p>
            </div>

            <div className="mb-4">
              <Button
                onClick={handleExportPDF}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-8 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-export-pdf"
              >
                <Download className="mr-2 w-5 h-5" />
                Export as PDF
              </Button>
            </div>

            <div id="mcp-setup-guides" className="space-y-6 mb-8 text-left">
              <Card className="p-6 bg-[#F5EFE0] border-2" style={{ borderColor: '#E6D8B3', borderLeft: '4px solid #072D24' }}>
                <h3 className="font-bold text-foreground mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
                  GOOGLE DRIVE CONNECTION
                </h3>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>What it does:</strong>
                  <p className="text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>Claude can read, search, and analyze your Google Drive files.</p>
                </div>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Use cases:</strong>
                  <ul className="list-disc pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>"What are the action items from our team meeting docs?"</li>
                    <li>"Find all documents about Q4 planning"</li>
                    <li>"Summarize our customer feedback spreadsheet"</li>
                  </ul>
                </div>

                <div>
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Setup:</strong>
                  <ol className="list-decimal pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>Toggle on Google Drive MCP server (Connector)</li>
                    <li>Authenticate with your Google account</li>
                    <li>Configure access permissions</li>
                  </ol>
                </div>
              </Card>

              <Card className="p-6 bg-[#F5EFE0] border-2" style={{ borderColor: '#E6D8B3', borderLeft: '4px solid #072D24' }}>
                <h3 className="font-bold text-foreground mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
                  SLACK INTEGRATION
                </h3>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>What it does:</strong>
                  <p className="text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>Claude can read Slack channels and DMs (with permissions).</p>
                </div>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Use cases:</strong>
                  <ul className="list-disc pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>"Summarize this week's #product conversations"</li>
                    <li>"What questions came up in #support that we haven't answered?"</li>
                    <li>"Find all decisions made in our planning channel"</li>
                  </ul>
                </div>

                <div>
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Setup:</strong>
                  <ol className="list-decimal pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>Toggle Slack MCP server (Connector)</li>
                    <li>Create a Slack app with read permissions</li>
                    <li>Connect it to Claude</li>
                  </ol>
                </div>
              </Card>

              <Card className="p-6 bg-[#F5EFE0] border-2" style={{ borderColor: '#E6D8B3', borderLeft: '4px solid #072D24' }}>
                <h3 className="font-bold text-foreground mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
                  FILE SYSTEM ACCESS
                </h3>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>What it does:</strong>
                  <p className="text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>Claude can read and write files on your computer.</p>
                </div>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Use cases:</strong>
                  <ul className="list-disc pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>"Read all markdown files in my Projects folder"</li>
                    <li>"Create a summary of all code files in this directory"</li>
                    <li>"Analyze my research notes and extract key themes"</li>
                  </ul>
                </div>

                <div>
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Setup:</strong>
                  <ol className="list-decimal pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>Install file system MCP server</li>
                    <li>Configure allowed directories</li>
                    <li>Set read/write permissions</li>
                  </ol>
                </div>
              </Card>

              <Card className="p-6 bg-[#F5EFE0] border-2" style={{ borderColor: '#E6D8B3', borderLeft: '4px solid #072D24' }}>
                <h3 className="font-bold text-foreground mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
                  DATABASE CONNECTION
                </h3>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>What it does:</strong>
                  <p className="text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>Claude can query databases (Postgres, MySQL, SQLite, etc.)</p>
                </div>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Use cases:</strong>
                  <ul className="list-disc pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>"What are my top 10 customers by revenue?"</li>
                    <li>"Show me all orders from last month"</li>
                    <li>"Find patterns in our sales data"</li>
                  </ul>
                </div>

                <div>
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Setup:</strong>
                  <ol className="list-decimal pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>Install database MCP server</li>
                    <li>Configure connection string</li>
                    <li>Set query permissions</li>
                  </ol>
                </div>
              </Card>

              <Card className="p-6 bg-[#F5EFE0] border-2" style={{ borderColor: '#E6D8B3', borderLeft: '4px solid #072D24' }}>
                <h3 className="font-bold text-foreground mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
                  WEB SCRAPING / API ACCESS
                </h3>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>What it does:</strong>
                  <p className="text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>Claude can fetch data from websites or APIs on demand.</p>
                </div>

                <div className="mb-4">
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Use cases:</strong>
                  <ul className="list-disc pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>"Check the current price on this product page"</li>
                    <li>"Pull the latest data from [API]"</li>
                    <li>"Monitor this website for changes"</li>
                  </ul>
                </div>

                <div>
                  <strong className="font-bold text-foreground" style={{ fontSize: '16px' }}>Setup:</strong>
                  <ol className="list-decimal pl-6 space-y-1 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    <li>Install fetch/HTTP MCP server</li>
                    <li>Configure allowed domains (security)</li>
                    <li>Set rate limits</li>
                  </ol>
                </div>
              </Card>
            </div>

            <div className="bg-card rounded-lg p-6 mb-8 border-2 border-border">
              <strong className="font-bold text-foreground block mb-3" style={{ fontSize: '18px' }}>Getting Started:</strong>
              <p className="text-foreground mb-3" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                Setting up MCP connections is straightforward:
              </p>
              <ol className="list-decimal pl-6 space-y-1 mb-4 text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                <li>Install the MCP server for your tool</li>
                <li>Add it to your Claude Desktop config</li>
                <li>Restart Claude Desktop</li>
                <li>Start using it</li>
              </ol>
              <p className="text-foreground" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                Most MCP servers can be enabled directly in Claude Desktop's settings. Check Claude's documentation for the latest setup instructions.
              </p>
            </div>

            <div className="border-t-2 border-dashed border-border my-8"></div>

            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-xl font-semibold text-foreground">
                You just learned how to give Claude direct access to your data—game changer for real workflows.
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

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-8">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-8 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-restart-lesson"
              >
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

