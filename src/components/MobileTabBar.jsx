import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Mountain, Map, Calendar, CheckCircle } from 'lucide-react';

const DecoratedTree = ({ className = '', size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* star topper */}
    <polygon points="12,0.5 12.6,2.5 14.8,2.5 13.1,3.8 13.7,5.8 12,4.5 10.3,5.8 10.9,3.8 9.2,2.5 11.4,2.5" />
    {/* top tier */}
    <polygon points="12,5 8,10 16,10" />
    {/* middle tier */}
    <polygon points="12,8.5 5,14 19,14" />
    {/* bottom tier */}
    <polygon points="12,12 3,20 21,20" />
    {/* trunk */}
    <rect x="10.5" y="20" width="3" height="2.5" rx="0.5" />
    {/* baubles */}
    <circle cx="11" cy="9" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="14" cy="9" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="8" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="15" cy="12.5" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="7" cy="17.5" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="17.5" cy="18" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

const MobileTabBar = ({ outOfTownHikes, christmasParties }) => {
  const location = useLocation();
  const hasOpenOOT = (outOfTownHikes || []).some(h => h.status === 'open' && h.show_on_dashboard === true);
  const hasChristmasTab = (christmasParties || []).some(p => p.status === 'upcoming' && p.is_visible === true);

  const tabs = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/nexthike', icon: Mountain, label: 'Next Hike' },
    ...(hasOpenOOT ? [{ to: '/outoftown', icon: Map, label: 'Out of Town' }] : []),
    { to: '/fullcalendar', icon: Calendar, label: 'Calendar' },
    { to: '/completedhikes', icon: CheckCircle, label: 'Completed' },
    ...(hasChristmasTab ? [{ to: '/christmas', icon: DecoratedTree, label: 'Christmas' }] : []),
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
              style={{ minHeight: '70px' }}
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
