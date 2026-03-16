import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "./pages/SplashScreen";
import GeolocationPage from "./pages/GeolocationPage";
import ReservationPage from "./pages/ReservationPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantSignup from "./pages/RestaurantSignup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
          <div className="min-h-[calc(100dvh-1rem)] sm:min-h-[calc(100dvh-2rem)] md:min-h-[calc(100dvh-3rem)] rounded-2xl border-[3px] border-primary shadow-[0_8px_40px_-8px_hsl(var(--night)/0.25)] overflow-hidden">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/geolocation" element={<GeolocationPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/restaurant-signup" element={<RestaurantSignup />} />
              <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
