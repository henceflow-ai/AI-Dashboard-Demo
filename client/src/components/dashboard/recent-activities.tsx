import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Phone, Calendar, AlertTriangle, Handshake } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { EnrichedActivity } from "@shared/schema";

export function RecentActivities() {
  const { data: activities, isLoading } = useQuery<EnrichedActivity[]>({
    queryKey: ["/api/dashboard/activities"],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "lead_added":
        return UserPlus;
      case "call":
        return Phone;
      case "meeting":
        return Calendar;
      case "deal_closed":
        return Handshake;
      default:
        return AlertTriangle;
    }
  };

  const getActivityColor = (status: string, type: string) => {
    if (status === "failed") return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
    
    switch (type) {
      case "lead_added":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "call":
        return "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400";
      case "meeting":
        return "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400";
      case "deal_closed":
        return "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400";
      default:
        return "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400";
    }
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case "Lead Generation":
        return "default";
      case "Outreach":
        return "secondary";
      case "Meeting":
        return "outline";
      case "Conversion":
        return "default";
      case "Error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" data-testid="recent-activities-loading">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" data-testid="recent-activities">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white" data-testid="activities-title">
            Recent Activities
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" data-testid="view-all-activities">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity, index) => {
            const Icon = getActivityIcon(activity.type);
            const iconColorClass = getActivityColor(activity.status!, activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-4" data-testid={`activity-item-${index}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${iconColorClass}`} data-testid={`activity-icon-${index}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 dark:text-white" data-testid={`activity-description-${index}`}>
                    {activity.description}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1" data-testid={`activity-time-${index}`}>
                    {activity.timeAgo}
                  </p>
                </div>
                <Badge 
                  variant={getBadgeVariant(activity.category)}
                  className="text-xs"
                  data-testid={`activity-category-${index}`}
                >
                  {activity.category}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
