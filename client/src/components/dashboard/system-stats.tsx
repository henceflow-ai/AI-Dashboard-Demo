import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Phone, CalendarPlus, Percent } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";

interface SystemStatsProps {
  metrics: DashboardMetrics;
}

export function SystemStats({ metrics }: SystemStatsProps) {
  const stats = [
    {
      title: "Calls Completed Today",
      subtitle: "AI outreach calls",
      value: metrics.callsToday,
      icon: Phone,
      color: "primary",
    },
    {
      title: "Meetings Scheduled",
      subtitle: "Today's bookings",
      value: metrics.meetingsScheduled,
      icon: CalendarPlus,
      color: "accent",
    },
    {
      title: "Show Rate",
      subtitle: "Attended / Booked",
      value: metrics.showRate,
      icon: Percent,
      color: "warning",
    },
  ];

  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  };

  // Parse show rate percentage for progress bar
  const showRateValue = parseFloat(metrics.showRate.replace('%', ''));

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" data-testid="system-stats">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white" data-testid="stats-title">
          Key System Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="flex items-center justify-between" data-testid={`stat-item-${index}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`} data-testid={`stat-icon-${index}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white" data-testid={`stat-title-${index}`}>
                    {stat.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400" data-testid={`stat-subtitle-${index}`}>
                    {stat.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white" data-testid={`stat-value-${index}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
        
        {/* Progress Bar for Show Rate */}
        <div className="pt-2" data-testid="show-rate-progress">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
            <span>This Month's Performance</span>
            <span data-testid="show-rate-percentage">{metrics.showRate}</span>
          </div>
          <Progress 
            value={showRateValue} 
            className="h-2"
            data-testid="show-rate-progress-bar"
          />
        </div>
      </CardContent>
    </Card>
  );
}
