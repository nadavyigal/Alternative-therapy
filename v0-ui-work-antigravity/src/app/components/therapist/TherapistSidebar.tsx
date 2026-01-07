import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Cable, User, Settings, Shield } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

export function TherapistSidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'סקירה', icon: LayoutDashboard },
    { path: '/leads', label: 'פניות', icon: Users },
    { path: '/admin-services', label: 'שירותים', icon: FileText },
    { path: '/integrations', label: 'חיבורים', icon: Cable },
    { path: '/profile', label: 'פרופיל', icon: User },
    { path: '/settings', label: 'הגדרות', icon: Settings },
  ];

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-4 p-4 rounded-[2rem] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl">
        {/* Logo / Brand Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path ||
              (item.path === '/admin-services' && location.pathname.startsWith('/admin-services'));

            return (
              <div key={item.path} className="group relative flex items-center justify-end">
                {/* Tooltip Label (Visible on hover) */}
                <span className={cn(
                  "absolute right-14 whitespace-nowrap bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600 shadow-sm opacity-0 transition-opacity duration-200 pointer-events-none transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                )}>
                  {item.label}
                </span>

                <Link to={item.path}>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30 scale-105"
                      : "text-slate-500 hover:bg-white/50 hover:text-primary hover:scale-105"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
