import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SplashScreen from "./pages/SplashScreen";
import GeolocationPage from "./pages/GeolocationPage";
import ReservationPage from "./pages/ReservationPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import MenuPage from "./pages/MenuPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantSignup from "./pages/RestaurantSignup";
import RestaurantSuperfansPage from "./pages/RestaurantSuperfansPage";
import ProfilePage from "./pages/ProfilePage";
import PointsPage from "./pages/PointsPage";
import CreatorPage from "./pages/CreatorPage";
import BottomNav from "./components/BottomNav";
import TopControls from "./components/TopControls";

const queryClient = new QueryClient();

const AppShell = () => {
  const location = useLocation();
  const isRestaurant = location.pathname.startsWith("/restaurant");
  const borderClass = isRestaurant ? "border-accent" : "border-primary";

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4 md:p-6">
      <div className={`min-h-[calc(100dvh-1rem)] sm:min-h-[calc(100dvh-2rem)] md:min-h-[calc(100dvh-3rem)] rounded-2xl border-[3px] ${borderClass} shadow-[0_8px_40px_-8px_hsl(var(--night)/0.25)] overflow-hidden transition-colors duration-500 pb-16`}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/splash" element={<SplashScreen />} />
          <Route path="/geolocation" element={<GeolocationPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/restaurant-signup" element={<RestaurantSignup />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/restaurant-superfans" element={<RestaurantSuperfansPage />} />
          <Route path="/points" element={<PointsPage />} />
          <Route path="/creator" element={<CreatorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <BottomNav />
      <TopControls />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
