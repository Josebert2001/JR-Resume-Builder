import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import FontLoader from "./components/FontLoader";
import Index from "./pages/Index";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeTemplatesPage from "./pages/ResumeTemplatesPage";
import ResumeUploadPage from "./pages/ResumeUploadPage";
import { TermsOfService } from "./pages/TermsOfService";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
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
                  <Route path="/upload-resume" element={<ResumeUploadPage />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
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
