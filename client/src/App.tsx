import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Sidebar } from "@/components/dashboard/sidebar";
import AnalyticsOverview from "@/pages/analytics-overview";
import LeadInsights from "@/pages/lead-insights";
import PipelineStages from "@/pages/pipeline-stages";
import AirtableTest from "@/pages/airtable-test";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AnalyticsOverview} />
      <Route path="/leads" component={LeadInsights} />
      <Route path="/test-airtable" component={AirtableTest} />
      {/* Placeholder routes for future pages */}
      <Route path="/pipeline" component={PipelineStages} />
      <Route path="/meetings" component={NotFound} />
      <Route path="/campaigns" component={NotFound} />
      <Route path="/assistant" component={NotFound} />
      <Route path="/automation" component={NotFound} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
        <TooltipProvider>
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900" data-testid="app-container">
            <Sidebar />
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
