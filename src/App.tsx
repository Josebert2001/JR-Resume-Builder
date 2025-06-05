
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import FontLoader from "./components/FontLoader";
import Index from "./pages/Index";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeTemplatesPage from "./pages/ResumeTemplatesPage";
import InterviewPreparation from "./pages/InterviewPreparation";
import JobSearchTips from "./pages/JobSearchTips";
import CoverLetterGuide from "./pages/CoverLetterGuide";
import AIAssistance from "./pages/AIAssistance";
import AgenticAssistance from "./pages/AgenticAssistance";
import NotFound from "./pages/NotFound";
import { ResumeProvider } from "./context/ResumeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ResumeProvider>
          <TooltipProvider>
            <Router>
              <FontLoader />
              <div className="min-h-screen bg-background">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/resume-builder" element={<ResumeBuilder />} />
                  <Route path="/templates" element={<ResumeTemplatesPage />} />
                  <Route path="/interview-prep" element={<InterviewPreparation />} />
                  <Route path="/job-search" element={<JobSearchTips />} />
                  <Route path="/cover-letter" element={<CoverLetterGuide />} />
                  <Route path="/ai-assistance" element={<AIAssistance />} />
                  <Route path="/agentic-assistance" element={<AgenticAssistance />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </Router>
          </TooltipProvider>
        </ResumeProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
