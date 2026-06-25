import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Edit3, Mountain, Calendar, CheckCircle,
  Building2, Compass, Package, Users, LogOut, Menu, X
} from 'lucide-react';

const NAV_GROUPS = [
  {
    items: [
      { label: 'Dashboard', to: '/admin', icon: Home, exact: true },
    ],
  },
  {
    heading: 'Edit Public Pages',
    items: [
      { label: 'Edit Dashboard', to: '/admin/edit-dashboard', icon: Edit3 },
      { label: 'Edit Hike Details', to: '/admin/edit-hike', icon: Mountain },
      { label: 'Edit Calendar', to: '/admin/edit-calendar', icon: Calendar },
      { label: 'Edit Completed Hikes', to: '/admin/edit-completed', icon: CheckCircle },
    ],
  },
  {
    heading: 'Directories',
    items: [
      { label: 'Hike Curators', to: '/admin/companies', icon: Building2 },
      { label: 'Hike Guides', to: '/admin/guides', icon: Compass },
      { label: 'Hike Resources', to: '/admin/resources', icon: Package },
      { label: 'Hikers Contacts', to: '/admin/hikers', icon: Users },
    ],
  },
];

const AdminLayout = ({ setIsAdminAuthenticated, completedHikes }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 border-b border-white/20">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-0.5">Sirimon Hikers</p>
        <h1 className="text-lg font-bold text-gray-800">Admin Panel</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-2 pt-2 border-t border-white/20' : ''}>
            {group.heading && (
              <p className="px-5 mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                {group.heading}
              </p>
            )}
            {group.items.map(({ label, to, icon: Icon, exact }) => {
              const active = isActive(to, exact);
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={closeSidebar}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-colors
                    ${active
                      ? 'border-l-4 border-forest-olive bg-white/30 text-gray-900 pl-4'
                      : 'border-l-4 border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/20'
                    }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-forest-olive' : 'text-gray-400'}`} />
                  {label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-sm font-medium text-gray-600 hover:text-red-600 transition-colors py-2"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen -mx-4 -my-8">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 flex-shrink-0 glass border-r border-white/20">
        <SidebarContent />
      </aside>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 glass z-40 md:hidden transform transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-4 glass border-b border-white/20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-800 text-sm">Admin Panel</span>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet context={{ completedHikes, setIsAdminAuthenticated }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
