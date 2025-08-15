import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { PipelineChart } from "@/components/dashboard/pipeline-chart";
import { SystemStats } from "@/components/dashboard/system-stats";
import { RecentActivities } from "@/components/dashboard/recent-activities";
import type { DashboardMetrics } from "@shared/schema";

export default function AnalyticsOverview() {
  const { theme, toggleTheme } = useTheme();
  
  const { data: metrics, isLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading || !metrics) {
    return (
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="lg:hidden p-2" data-testid="mobile-menu-button">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Monitor your AI automation performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
                data-testid="theme-toggle"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <div className="flex items-center space-x-2" data-testid="system-status">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">AI System Active</span>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl h-32 border border-slate-200 dark:border-slate-700" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl h-96 border border-slate-200 dark:border-slate-700" />
              <div className="bg-white dark:bg-slate-800 rounded-xl h-96 border border-slate-200 dark:border-slate-700" />
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl h-64 border border-slate-200 dark:border-slate-700" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto" data-testid="analytics-overview">
      {/* Top header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700" data-testid="dashboard-header">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="lg:hidden p-2" data-testid="mobile-menu-button">
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-4 lg:ml-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white" data-testid="page-title">
                Analytics Overview
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400" data-testid="page-subtitle">
                Monitor your AI automation performance
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
              data-testid="theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {/* Status Indicator */}
            <div className="flex items-center space-x-2" data-testid="system-status">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">AI System Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="px-4 py-6 sm:px-6 lg:px-8" data-testid="dashboard-content">
        {/* Key Metrics Cards */}
        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Pipeline Chart */}
          <PipelineChart metrics={metrics} />

          {/* Key System Stats */}
          <SystemStats metrics={metrics} />
        </div>

        {/* Recent Activities */}
        <RecentActivities />
      </main>
    </div>
  );
}
