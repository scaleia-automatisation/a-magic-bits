import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import OnboardingModal from "@/components/OnboardingModal";
import Index from "./pages/Index.tsx";
import Landing from "./pages/Landing.tsx";
import Features from "./pages/Features.tsx";
import UseCases from "./pages/UseCases.tsx";
import Contact from "./pages/Contact.tsx";
import About from "./pages/About.tsx";
import AuthPage from "./pages/Auth.tsx";
import ResetPasswordPage from "./pages/ResetPassword.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import MyGenerations from "./pages/MyGenerations.tsx";
import NotFound from "./pages/NotFound.tsx";
import Pricing from "./pages/Pricing.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfUse from "./pages/TermsOfUse.tsx";
import DataDeletion from "./pages/DataDeletion.tsx";
import DataDeletionReminder from "./pages/DataDeletionReminder.tsx";
import DataDeletionConfirmation from "./pages/DataDeletionConfirmation.tsx";
import Partners from "./pages/Partners.tsx";
import ReferralPage from "./pages/Referral.tsx";

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
              <Route path="/" element={<Landing />} />
              <Route path="/app" element={<Index />} />
              <Route path="/fonctionnalites" element={<Features />} />
              <Route path="/cas-dusage" element={<UseCases />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/generations" element={<MyGenerations />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/data-deletion" element={<DataDeletion />} />
              <Route path="/data-deletion-reminder" element={<DataDeletionReminder />} />
              <Route path="/data-deletion-confirmation" element={<DataDeletionConfirmation />} />
              <Route path="/partenaires" element={<Partners />} />
              <Route path="/partenariat" element={<Partners />} />
              <Route path="/parrainage" element={<ReferralPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
