
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ResumeTemplatesPage from "./pages/ResumeTemplatesPage";
import CoverLetterGuide from "./pages/CoverLetterGuide";
import JobSearchTips from "./pages/JobSearchTips";
import InterviewPreparation from "./pages/InterviewPreparation";
import FontLoader from "./components/FontLoader";
import { ResumeProvider } from "@/context/ResumeContext";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <FontLoader />
            <Toaster />
            <Sonner position="top-right" />
            <BrowserRouter>
              <Routes>
                {/* Index page already has its own ResumeProvider in the component */}
                <Route path="/" element={<Index />} />
                <Route path="/templates" element={<ResumeTemplatesPage />} />
                <Route path="/cover-letter-guide" element={<CoverLetterGuide />} />
                <Route path="/job-search-tips" element={<JobSearchTips />} />
                <Route path="/interview-preparation" element={<InterviewPreparation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </React.StrictMode>
    </ErrorBoundary>
  );
};

export default App;
