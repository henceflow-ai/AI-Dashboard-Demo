import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Filter,
  Calendar,
  Mail,
  Brain,
  Settings,
  User,
  Bot,
} from "lucide-react";

const navigation = [
  { name: "Analytics Overview", href: "/", icon: BarChart3 },
  { name: "Lead Insights", href: "/leads", icon: Users },
  { name: "Pipeline Stages", href: "/pipeline", icon: Filter },
  { name: "Meetings View", href: "/meetings", icon: Calendar },
  { name: "Nurture Campaigns", href: "/campaigns", icon: Mail },
  { name: "AI Assistant", href: "/assistant", icon: Brain },
  { name: "Automation Control Center", href: "/automation", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div
              className="flex items-center flex-shrink-0 px-4 mb-8"
              data-testid="sidebar-logo"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Bot className="text-white h-4 w-4" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    AI Dashboard
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sales Automation
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav
              className="flex-1 px-2 space-y-1"
              data-testid="sidebar-navigation"
            >
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-l-md transition-colors duration-200",
                      isActive
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md",
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile */}
          <div
            className="flex-shrink-0 flex border-t border-slate-200 dark:border-slate-700 p-4"
            data-testid="sidebar-user-profile"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                  <User className="text-slate-600 dark:text-slate-300 h-4 w-4" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Business Admin
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
