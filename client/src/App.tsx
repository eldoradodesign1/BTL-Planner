/**
 * Direction visuelle : Aquarelle de contrôle — l’application s’ouvre directement sur le workspace,
 * avec une navigation persistante et une hiérarchie calme adaptée aux outils internes.
 */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthGate } from "./components/AuthGate";
import Home from "./pages/Home";
import { I18nProvider } from "./lib/i18n";

export default function App() {
  return <ErrorBoundary><I18nProvider><TooltipProvider><Toaster position="bottom-right" /><AuthGate><Home /></AuthGate></TooltipProvider></I18nProvider></ErrorBoundary>;
}
