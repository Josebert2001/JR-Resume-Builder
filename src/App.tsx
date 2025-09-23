
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import FontLoader from "./components/FontLoader";
import Index from "./pages/Index";
import ResumeBuilder from "./pages/ResumeBuilder";
import ResumeTemplatesPage from "./pages/ResumeTemplatesPage";
import ResumeUploadPage from "./pages/ResumeUploadPage";
import AuthPage from "./pages/AuthPage";
// import NotFound from "./pages/NotFound";
import { ResumeProvider } from "./context/ResumeContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AuthProvider>
          <ResumeProvider>
            <TooltipProvider>
              <Router>
                <FontLoader />
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/resume-builder" element={
                      <ProtectedRoute>
                        <ResumeBuilder />
                      </ProtectedRoute>
                    } />
                    <Route path="/templates" element={<ResumeTemplatesPage />} />
                    <Route path="/upload-resume" element={<ResumeUploadPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
                <Toaster />
              </Router>
            </TooltipProvider>
          </ResumeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
