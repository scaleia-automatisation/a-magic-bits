import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import OnboardingModal from "@/components/OnboardingModal";
import Index from "./pages/Index.tsx";
import AuthPage from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import MyGenerations from "./pages/MyGenerations.tsx";
import NotFound from "./pages/NotFound.tsx";
import Pricing from "./pages/Pricing.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfUse from "./pages/TermsOfUse.tsx";
import DataDeletion from "./pages/DataDeletion.tsx";
import DataDeletionReminder from "./pages/DataDeletionReminder.tsx";
import DataDeletionConfirmation from "./pages/DataDeletionConfirmation.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <OnboardingModal />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generations" element={<MyGenerations />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              <Route path="/data-deletion-reminder" element={<DataDeletionReminder />} />
              <Route path="/data-deletion-confirmation" element={<DataDeletionConfirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
