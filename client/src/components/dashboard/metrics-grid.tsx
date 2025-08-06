import { Card, CardContent } from "@/components/ui/card";
import { Users, Phone, Calendar, DollarSign, ArrowUp, ArrowDown } from "lucide-react";
import type { DashboardMetrics } from "@shared/schema";

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const metricsData = [
    {
      title: "Total Leads in Pipeline",
      value: metrics.totalLeads.toLocaleString(),
      change: "+12.3% from last month",
      changeType: "positive" as const,
      icon: Users,
      color: "primary",
    },
    {
      title: "Contacted Leads",
      value: metrics.contactedLeads.toLocaleString(),
      change: "+8.7% from last month",
      changeType: "positive" as const,
      icon: Phone,
      color: "warning",
    },
    {
      title: "Meetings Booked",
      value: metrics.meetingsBooked.toLocaleString(),
      change: "+15.2% from last month",
      changeType: "positive" as const,
      icon: Calendar,
      color: "accent",
    },
    {
      title: "Potential Deals",
      value: metrics.potentialDeals,
      change: "-2.1% from last month",
      changeType: "negative" as const,
      icon: DollarSign,
      color: "danger",
    },
  ];

  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    accent: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
    danger: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  };

  const changeColorClasses = {
    positive: "text-emerald-600 dark:text-emerald-400",
    negative: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="metrics-grid">
      {metricsData.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" data-testid={`metric-card-${index}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium" data-testid={`metric-title-${index}`}>
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2" data-testid={`metric-value-${index}`}>
                    {metric.value}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${changeColorClasses[metric.changeType]}`} data-testid={`metric-change-${index}`}>
                    {metric.changeType === "positive" ? (
                      <ArrowUp className="inline h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="inline h-3 w-3 mr-1" />
                    )}
                    {metric.change}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[metric.color]}`} data-testid={`metric-icon-${index}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
