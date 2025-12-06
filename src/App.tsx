import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdvancedResearch from "@/pages/advanced-research";
import AutomationTools from "@/pages/automation-tools";
import ChainOfThought from "@/pages/chain-of-thought";
import ModelContextProtocol from "@/pages/model-context";
import NotFound from "@/pages/not-found";
import Projects from "@/pages/projects";
import WhyAIIsntGoogle from "@/pages/why-ai-isnt-google";
import WhyChatGPTForgets from "./pages/why-chatgpt-forgets";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <HashRouter>
        <Routes>
          <Route path="/advanced-research" element={<AdvancedResearch />} />
          <Route path="/automation-tools" element={<AutomationTools />} />
          <Route path="/chain-of-thought" element={<ChainOfThought />} />
          <Route path="/model-context-protocol" element={<ModelContextProtocol />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/why-ai-isnt-google" element={<WhyAIIsntGoogle />} />
          <Route path="/why-chatgpt-forgets" element={<WhyChatGPTForgets />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  );
}

export default App;
