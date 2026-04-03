import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import FontLoader from "./components/FontLoader";
import { ResumeProvider } from "./context/ResumeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Index = lazy(() => import("./pages/Index"));
const ResumeBuilder = lazy(() => import("./pages/ResumeBuilder"));
const ResumeTemplatesPage = lazy(() => import("./pages/ResumeTemplatesPage"));
const ResumeUploadPage = lazy(() => import("./pages/ResumeUploadPage"));
const TermsOfService = lazy(() =>
  import("./pages/TermsOfService").then((m) => ({ default: m.TermsOfService }))
);
const PrivacyPolicy = lazy(() =>
  import("./pages/PrivacyPolicy").then((m) => ({ default: m.PrivacyPolicy }))
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <ResumeProvider>
          <TooltipProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <FontLoader />
              <div className="min-h-screen bg-background">
                <Suspense fallback={null}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/resume-builder" element={<ResumeBuilder />} />
                    <Route path="/templates" element={<ResumeTemplatesPage />} />
                    <Route path="/upload-resume" element={<ResumeUploadPage />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
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
