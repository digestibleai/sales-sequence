import { useState, useEffect } from "react";
import { Check, Copy, ChevronRight, ChevronLeft, TrendingUp, Rocket, PenTool, GraduationCap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Screen = 1 | 2 | 3 | 4;

interface FlashcardData {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: { letter: string; text: string }[];
  correct: string;
  feedback: string;
}

const flashcards: FlashcardData[] = [
  {
    front: "What problem do Projects solve?",
    back: "They organize your AI work into dedicated workspaces with persistent context, so you stop re-explaining yourself and can actually find past conversations.",
  },
  {
    front: "What's the biggest benefit of using Projects?",
    back: "Persistent context. You set up background info once (your role, preferences, project details) and every conversation in that Project automatically has it.",
  },
  {
    front: "What's the difference between ChatGPT Projects and Claude Projects?",
    back: "Both organize work and maintain context. Claude handles more documents and is better for research-heavy work. ChatGPT's are simpler and great for ongoing work with consistent context. Both require paid plans.",
  },
  {
    front: "How many Projects should you create?",
    back: "Start with 3-5 that match your main work areas. Don't overcomplicate it—Projects should make your life easier, not add overhead.",
  },
];

const quizQuestions: QuizQuestion[] = [
  {
    question:
      "You're working on three different client projects, plus some personal learning. How should you organize this with Projects?",
    options: [
      { letter: "A", text: "Put everything in one Project to keep it simple" },
      {
        letter: "B",
        text: "Create a Project for each client, plus one for personal learning",
      },
      { letter: "C", text: "Don't use Projects, just keep separate conversations" },
      {
        letter: "D",
        text: "Create 20 different Projects for maximum organization",
      },
    ],
    correct: "B",
    feedback:
      "The right approach is to match Projects to how you actually work. Each client gets their own workspace with relevant context, and personal stuff stays separate.",
  },
  {
    question:
      "What's the main advantage of adding context to a Project instead of starting fresh every conversation?",
    options: [
      { letter: "A", text: "It makes conversations longer" },
      {
        letter: "B",
        text: "AI automatically has your background, preferences, and project details without you re-explaining",
      },
      { letter: "C", text: "You can use more advanced AI features" },
      { letter: "D", text: "It makes the AI respond faster" },
    ],
    correct: "B",
    feedback:
      "When you set context once, every conversation in that Project automatically has it. No more repeating 'As I mentioned before, I'm a marketing manager at...'",
  },
  {
    question:
      "You're trying to find a marketing strategy conversation from two weeks ago. If you'd been using Projects, how would this be easier?",
    options: [
      { letter: "A", text: "It wouldn't be easier at all" },
      {
        letter: "B",
        text: "All your marketing conversations would be organized in one Marketing Project",
      },
      { letter: "C", text: "The AI would remember it automatically" },
      { letter: "D", text: "Projects automatically name your conversations better" },
    ],
    correct: "B",
    feedback:
      "Instead of scrolling through dozens of random chats, you'd just open your Marketing Project and find it immediately. Organization for the win.",
  },
];

const templates = [
  {
    icon: TrendingUp,
    title: "Marketing Project",
    template: `Project Name: Marketing & Growth
Custom Instructions:
You're a strategic marketing advisor working with [Company Name], a [industry] company targeting [audience].
Context about us:
- Our product/service: [brief description]
- Target audience: [who they are]
- Key value proposition: [what makes you different]
- Marketing channels: [where you focus]
Tone preferences:
- [Conversational/Professional/Bold/etc.]
- Keep responses actionable and specific
- Always consider our brand voice: [describe it]
When I ask for content, campaign ideas, or strategy advice, reference this context automatically.`,
  },
  {
    icon: Rocket,
    title: "Product/Strategy Project",
    template: `Project Name: Product & Strategy
Custom Instructions:
You're a product strategist helping with [Product/Company Name].
Background:
- What we build: [product description]
- Current stage: [early-stage/growth/scaling/etc.]
- Key challenges: [1-2 main problems you're solving]
- Target users: [who uses this]
- Business model: [how you make money]
When discussing features, strategy, or decisions:
- Think long-term, not just quick wins
- Consider both user value and business impact
- Push back on ideas that don't align with our core mission
- Ask clarifying questions when context is missing`,
  },
  {
    icon: PenTool,
    title: "Content Creation Project",
    template: `Project Name: Content & Writing
Custom Instructions:
You're a content strategist and editor for [Company/Personal Brand].
My content style:
- Tone: [conversational/professional/educational/etc.]
- Voice: [describe your writing personality]
- Audience: [who you're writing for]
- Topics I cover: [your main themes]
Content preferences:
- [Length preferences: punchy vs. detailed]
- [Format preferences: lists, stories, how-tos, etc.]
- [Things to avoid: jargon, corporate speak, etc.]
When helping with content, match this style automatically. Push back if something feels off-brand.`,
  },
  {
    icon: GraduationCap,
    title: "Learning & Research Project",
    template: `Project Name: Learning & Development
Custom Instructions:
You're a learning coach helping me develop skills in [areas you're learning].
About my learning style:
- I learn best through: [examples/theory/practice/etc.]
- Current skill level: [beginner/intermediate/advanced]
- Time constraints: [how much time you have]
- Main goals: [what you're trying to achieve]
When teaching or explaining:
- Use analogies and real-world examples
- Break complex topics into digestible pieces
- Check my understanding before moving forward
- Suggest practical exercises or projects`,
  },
  {
    icon: Briefcase,
    title: "Client Work Project",
    template: `Project Name: [Client Name] Project
Custom Instructions:
You're working with me on [Client Name]'s [project type].
Client context:
- Industry: [their industry]
- Their goals: [what they're trying to achieve]
- Timeline: [project timeline]
- Key stakeholders: [who's involved]
- Budget/constraints: [relevant limitations]
Our relationship:
- My role: [how you're supporting them]
- Tone to use: [professional/consultative/collaborative/etc.]
- Deliverables: [what you're producing]
When working on this project, maintain this context and keep recommendations aligned with their goals and constraints.`,
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

function TemplateCard({
  icon: Icon,
  title,
  template,
}: {
  icon: typeof TrendingUp;
  title: string;
  template: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="p-6 bg-[#F5EFE0] border-2" style={{ borderColor: '#E6D8B3', borderLeft: '4px solid #072D24' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6 text-foreground" />
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>
        <Button
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          data-testid={`button-copy-${title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <div className="bg-[#072D24] text-white p-4 rounded-lg font-mono text-sm leading-relaxed overflow-x-auto">
        <pre className="whitespace-pre-wrap" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{template}</pre>
      </div>
    </Card>
  );
}

export default function Projects() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(1);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [showFeedback, setShowFeedback] = useState<{ [key: number]: boolean }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Scroll to top whenever screen changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentScreen]);

  // Auto-calculate score when all questions are answered
  useEffect(() => {
    if (Object.keys(quizAnswers).length === quizQuestions.length) {
      const score = quizQuestions.reduce((acc, q, i) => {
        return quizAnswers[i] === q.correct ? acc + 1 : acc;
      }, 0);
      setQuizScore(score);
    }
  }, [quizAnswers]);

  const handleAnswer = (questionIndex: number, answer: string) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: answer });
    setShowFeedback({ ...showFeedback, [questionIndex]: true });
  };

  const handleCopyAll = () => {
    const allTemplates = templates.map((t) => `${t.title}\n\n${t.template}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(allTemplates);
  };

  const handleRestart = () => {
    setCurrentScreen(1);
    setQuizAnswers({});
    setShowFeedback({});
    setQuizScore(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <ProgressIndicator currentScreen={currentScreen} />

        {/* Screen 1: The Concept */}
        {currentScreen === 1 && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto" data-testid="screen-concept">
            <h1 className="text-5xl font-bold mb-6 text-foreground leading-tight" style={{ fontSize: '48px', lineHeight: '1.15' }} data-testid="heading-main">
              Projects: The AI Feature You Didn't Know You Needed
            </h1>

            <div className="max-w-none mb-8">
              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Okay, real talk: most people use AI like they're having hundreds of random conversations with a really smart stranger.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Every time you start a new chat, AI has zero context. You have to re-explain who you are, what you're working on, all your preferences—every single time.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                And then when you need to reference something from a previous conversation? You're playing archaeologist, digging through your chat history hoping you named it something searchable.
              </p>

              <p className="text-2xl font-bold text-foreground my-8" style={{ lineHeight: '1.3' }}>
                There's a way better way to do this.
              </p>

              <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                Both ChatGPT and Claude have a feature called <strong>Projects</strong>. And once you start using them, you'll wonder how you ever worked without them.
              </p>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>What Projects Actually Are</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Think of Projects like dedicated workspaces for different areas of your work.
                </p>

                <p className="text-base text-foreground mb-4" style={{ lineHeight: '1.6' }}>
                  Instead of having one giant pile of random conversations, you create separate Projects for different things:
                </p>

                <ul className="space-y-3 mb-8 text-foreground">
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Marketing Project</strong> → All your marketing-related AI work lives here</span>
                  </li>
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Product Development Project</strong> → Product strategy, feature planning, user research</span>
                  </li>
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Content Creation Project</strong> → Blog posts, social media, newsletters</span>
                  </li>
                  <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                    <span className="text-foreground mr-2 font-bold">•</span>
                    <span><strong>Personal Learning Project</strong> → Skill development, research, learning new things</span>
                  </li>
                </ul>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Here's what makes them powerful:
                </p>

                <div className="space-y-6 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontSize: '24px', lineHeight: '1.3' }}>1. Persistent Context</h3>
                    <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                      You add background information to the Project once—your role, company details, preferences, whatever—and every conversation in that Project automatically has that context. No more re-explaining yourself.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontSize: '24px', lineHeight: '1.3' }}>2. Custom Instructions</h3>
                    <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                      Tell the AI how to behave in this specific Project. Formal for client work, casual for brainstorming, whatever you need.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontSize: '24px', lineHeight: '1.3' }}>3. Organized History</h3>
                    <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                      All related conversations stay together. Need to reference that strategy conversation from two weeks ago? It's right there in your Strategy Project.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2" style={{ fontSize: '24px', lineHeight: '1.3' }}>4. Knowledge Base</h3>
                    <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                      Upload relevant documents, guidelines, or resources that AI can reference across all conversations in that Project.
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>ChatGPT Projects and Claude Projects</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  They work similarly, but there are some key differences:
                </p>

                <div className="bg-card rounded-lg p-6 mb-6 border-2 border-border">
                  <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
                    ChatGPT Projects (ChatGPT Plus/Team/Enterprise):
                  </h3>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Live in the sidebar under "Projects"</span>
                    </li>
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Let you set custom instructions per Project</span>
                    </li>
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Can include up to 10 files for context</span>
                    </li>
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Great for ongoing work with consistent context</span>
                    </li>
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Available on paid plans only</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card rounded-lg p-6 mb-6 border-2 border-border">
                  <h3 className="text-2xl font-bold text-foreground mb-4" style={{ fontSize: '24px', lineHeight: '1.3' }}>
                    Claude Projects (Claude Pro/Team):
                  </h3>
                  <ul className="space-y-2 text-foreground">
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>More robust knowledge base (can handle way more documents)</span>
                    </li>
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Better at maintaining context across longer conversations</span>
                    </li>
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Lets you add detailed project descriptions and instructions</span>
                    </li>
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Really good for research-heavy work</span>
                    </li>
                    <li className="flex items-start text-base" style={{ lineHeight: '1.6' }}>
                      <span className="text-foreground mr-2">•</span>
                      <span>Also requires paid plan</span>
                    </li>
                  </ul>
                </div>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Both solve the same core problem: keeping your AI work organized and maintaining context without having to re-explain everything constantly.
                </p>
              </div>

              <div className="my-8 pb-8" style={{ borderBottomWidth: '2px', borderBottomStyle: 'dashed', borderColor: 'var(--border)' }}>
                <h2 className="text-4xl font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>How To Actually Use This</h2>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  Here's the simple system:
                </p>

                <div className="space-y-6 mb-6">
                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
                      1
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                        Create Projects for your main work areas
                      </h3>
                      <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                        Don't go crazy—start with 3-5 Projects that match how you actually work.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
                      2
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                        Add persistent context to each Project
                      </h3>
                      <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                        Who you are, what you're working on, how you want AI to respond. Do this once.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
                      3
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                        Use the right Project for the right work
                      </h3>
                      <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                        Marketing task? Use your Marketing Project. Strategy question? Use your Strategy Project.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
                      4
                    </div>
                    <div className="pt-2">
                      <h3 className="text-lg font-bold text-foreground mb-2" style={{ fontSize: '18px', lineHeight: '1.5' }}>
                        Keep related conversations together
                      </h3>
                      <p className="text-base text-foreground" style={{ lineHeight: '1.6' }}>
                        All your product planning stays in the Product Project. All your content work stays in the Content Project.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  That's it. Suddenly, your AI work goes from chaos to organized, and you stop wasting time re-explaining context.
                </p>

                <p className="text-base text-foreground mb-6" style={{ lineHeight: '1.6' }}>
                  The shift is subtle but huge: instead of treating AI like a search engine you keep interrogating, you're treating it like a actual workspace where you build things over time.
                </p>
              </div>

              <p className="text-xl font-semibold text-foreground mb-12" style={{ lineHeight: '1.3' }}>
                Alright, let's make sure this clicks.
              </p>
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
                <FlashCard key={index} card={card} index={index} />
              ))}
            </div>

            <div className="flex gap-4 flex-wrap justify-center" style={{ marginTop: '20px' }}>
              <Button
                onClick={() => setCurrentScreen(1)}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-10 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-back-2"
              >
                <ChevronLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button
                onClick={() => setCurrentScreen(3)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
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
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>Answer these 3 questions to unlock your project setup templates</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {quizQuestions.map((q, qIndex) => (
                <div key={qIndex} className="space-y-4">
                  <h3 className="mb-8 text-foreground font-medium" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                    Question {qIndex + 1}: {q.question}
                  </h3>
                  <div className="space-y-3">
                    {q.options.map((option) => {
                      const isSelected = quizAnswers[qIndex] === option.letter;
                      const isCorrect = option.letter === q.correct;
                      const showResult = showFeedback[qIndex] && isSelected;

                      return (
                        <button
                          key={option.letter}
                          onClick={() => handleAnswer(qIndex, option.letter)}
                          disabled={showFeedback[qIndex]}
                          className={`w-full text-left rounded-lg transition-all relative overflow-hidden ${showFeedback[qIndex] ? "cursor-not-allowed" : "cursor-pointer"
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
                                  : showFeedback[qIndex]
                                    ? '2px solid #E6D8B3'
                                    : '2px solid #072D24',
                            background: showResult && isCorrect
                              ? '#A8D5B7'
                              : showResult && isSelected && !isCorrect
                                ? '#FEF2F2'
                                : isSelected
                                  ? '#FFFFFF'
                                  : showFeedback[qIndex]
                                    ? '#F5EFE0'
                                    : '#FFFFFF',
                            color: showResult && isCorrect
                              ? '#072D24'
                              : showResult && isSelected && !isCorrect
                                ? '#991B1B'
                                : '#072D24'
                          }}
                          data-testid={`quiz-option-${qIndex}-${option.letter}`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="font-bold flex-shrink-0">{option.letter})</span>
                            <span className="flex-1">{option.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {showFeedback[qIndex] && quizAnswers[qIndex] !== undefined && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className="rounded-lg mb-6"
                      style={{
                        padding: '24px',
                        background: quizAnswers[qIndex] === q.correct ? '#A8D5B7' : '#FEF2F2',
                        borderLeft: quizAnswers[qIndex] === q.correct ? '4px solid #072D24' : '4px solid #DC2626',
                        color: quizAnswers[qIndex] === q.correct ? '#072D24' : '#991B1B'
                      }}
                    >
                      <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        fontWeight: 600,
                        marginBottom: '8px'
                      }}>
                        {quizAnswers[qIndex] === q.correct ? "✓ Correct!" : "✗ Not quite."}
                      </p>
                      <p style={{
                        fontSize: '16px',
                        lineHeight: '1.6'
                      }}>
                        {q.feedback}
                      </p>
                    </div>
                  )}
                  {qIndex < quizQuestions.length - 1 && (
                    <div className="border-t-2 border-dashed" style={{ borderColor: 'var(--border)', paddingTop: '16px' }}></div>
                  )}
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto pt-4">
              <div className="flex gap-4 flex-wrap justify-center" style={{ marginTop: '20px' }}>
                <Button
                  onClick={() => {
                    setQuizAnswers({});
                    setShowFeedback({});
                    setQuizScore(null);
                    setCurrentScreen(2);
                  }}
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-10 font-bold"
                  style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                  data-testid="button-back-3"
                >
                  <ChevronLeft className="mr-2 w-5 h-5" />
                  Back
                </Button>
                {quizScore !== null && (
                  <Button
                    onClick={() => setCurrentScreen(4)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-10 font-bold"
                    style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                    data-testid="button-continue-3"
                  >
                    See My Results
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Screen 4: Results & Templates */}
        {currentScreen === 4 && quizScore !== null && (
          <div className="animate-in fade-in duration-500 max-w-3xl mx-auto text-center" data-testid="screen-results">
            <h2 className="font-bold mb-6 text-foreground" style={{ fontSize: '36px', lineHeight: '1.25' }}>
              Nice Work! Here Are Your 5 Project Setup Templates
            </h2>

            <div className="bg-card rounded-lg p-8 mb-8 border-2 border-border">
              <p className="font-bold text-foreground mb-2" style={{ fontSize: '24px', lineHeight: '1.3' }} data-testid="text-quiz-score">
                You got {quizScore}/3 correct! 🎉
              </p>
              <p className="text-base text-muted-foreground" style={{ lineHeight: '1.6' }}>
                Copy these, customize them, and paste into your Project's custom instructions.
              </p>
            </div>

            <div className="mb-12 text-left">
              {templates.map((template, index) => (
                <div key={index} style={{ marginBottom: index < templates.length - 1 ? '32px' : '0' }}>
                  <TemplateCard
                    icon={template.icon}
                    title={template.title}
                    template={template.template}
                  />
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-border my-8"></div>

            <div className="max-w-2xl mx-auto text-center space-y-4">
              <p className="text-xl font-semibold text-foreground">
                You just learned how to organize your AI work—game changer for productivity.
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
                onClick={handleCopyAll}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-8 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-copy-all"
              >
                <Copy className="mr-2 w-5 h-5" />
                Copy All Templates
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

            <div className="text-center" style={{ marginTop: '20px' }}>
              <Button
                onClick={handleRestart}
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary/5 rounded-lg px-8 font-bold"
                style={{ fontSize: '18px', paddingTop: '20px', paddingBottom: '20px' }}
                data-testid="button-restart"
              >
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

