import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdvancedResearch from "@/pages/advanced-research";
import AutomationTools from "@/pages/automation-tools";
import ChainOfThought from "@/pages/chain-of-thought";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdvancedResearch />} />
          <Route path="/automation-tools" element={<AutomationTools />} />
          <Route path="/chain-of-thought" element={<ChainOfThought />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
