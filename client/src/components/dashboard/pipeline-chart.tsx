import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DashboardMetrics } from "@shared/schema";

interface PipelineChartProps {
  metrics: DashboardMetrics;
}

export function PipelineChart({ metrics }: PipelineChartProps) {
  return (
    <Card className="lg:col-span-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700" data-testid="pipeline-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white" data-testid="chart-title">
            Lead Pipeline Performance
          </CardTitle>
          <Select defaultValue="30days" data-testid="chart-timeframe-select">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80" data-testid="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.pipelineData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  color: "hsl(var(--card-foreground))"
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalLeads"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                name="Total Leads"
                data-testid="line-total-leads"
              />
              <Line
                type="monotone"
                dataKey="contacted"
                stroke="hsl(24, 74%, 58%)"
                strokeWidth={2}
                dot={{ fill: "hsl(24, 74%, 58%)", strokeWidth: 2, r: 4 }}
                name="Contacted"
                data-testid="line-contacted"
              />
              <Line
                type="monotone"
                dataKey="meetingsBooked"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={2}
                dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
                name="Meetings Booked"
                data-testid="line-meetings-booked"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
