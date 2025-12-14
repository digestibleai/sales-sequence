import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdvancedResearch from "@/pages/advanced-research";
import AutomationTools from "@/pages/automation-tools";
import ChainOfThought from "@/pages/chain-of-thought";
import ModelContextProtocol from "@/pages/model-context";
import Projects from "@/pages/projects";
import WhyAIIsntGoogle from "@/pages/why-ai-isnt-google";
import WhyChatGPTForgets from "./pages/why-chatgpt-forgets";
import { PreCheckoutOnboarding } from "./pages/pre-checkout-onboarding";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Routes>
        <Route path="/advanced-research" element={<AdvancedResearch />} />
        <Route path="/automation-tools" element={<AutomationTools />} />
        <Route path="/chain-of-thought" element={<ChainOfThought />} />
        <Route path="/model-context-protocol" element={<ModelContextProtocol />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/why-ai-isnt-google" element={<WhyAIIsntGoogle />} />
        <Route path="/why-chatgpt-forgets" element={<WhyChatGPTForgets />} />
        <Route path="/pre-checkout-onboarding" element={<PreCheckoutOnboarding />} /> // special route for the pre-checkout onboarding
        <Route path="*" element={<WhyAIIsntGoogle />} />
      </Routes>
    </TooltipProvider>
  );
}

export default App;
