import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Leads from "./pages/Leads";
import LeadDetail from "./pages/LeadDetail";
import Conversations from "./pages/Conversations";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import Reports from "./pages/Reports";
import Clientes from "./pages/Clientes";
import TreinamentoIA from "./pages/TreinamentoIA";
import LogsSeguranca from "./pages/LogsSeguranca";
import GerenciarFiltros from "./pages/GerenciarFiltros";
import Estatisticas from "./pages/Estatisticas";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/leads"} component={Leads} />
      <Route path={"/leads/:id"} component={LeadDetail} />
      <Route path={"/conversations"} component={Conversations} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/integrations"} component={Integrations} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/clientes"} component={Clientes} />
      <Route path={"/treinamento-ia"} component={TreinamentoIA} />
      <Route path={"/logs-seguranca"} component={LogsSeguranca} />
      <Route path={"/gerenciar-filtros"} component={GerenciarFiltros} />
      <Route path={"/estatisticas"} component={Estatisticas} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
