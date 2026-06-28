import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Mountain, Map, Calendar, CheckCircle } from 'lucide-react';

const MobileTabBar = ({ outOfTownHikes }) => {
  const location = useLocation();
  const hasOpenOOT = (outOfTownHikes || []).some(h => h.status === 'open');

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/nexthike', icon: Mountain, label: 'Next Hike' },
    ...(hasOpenOOT ? [{ to: '/outoftown', icon: Map, label: 'Out of Town' }] : []),
    { to: '/fullcalendar', icon: Calendar, label: 'Calendar' },
    { to: '/completedhikes', icon: CheckCircle, label: 'Completed' },
  ];

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/20"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className="flex-1 flex items-center justify-center"
              style={{ minHeight: '56px' }}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: active ? '#6B8E23' : '#9ca3af' }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabBar;
