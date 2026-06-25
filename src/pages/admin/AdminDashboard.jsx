import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Mountain, Calendar, Edit3, CheckCircle } from 'lucide-react';

const StatCard = ({ label, value, note }) => (
  <div className="glass-dark rounded-2xl p-4 text-center">
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mt-1">{label}</p>
    {note && <p className="text-xs text-gray-400 mt-1">{note}</p>}
  </div>
);

const ShortcutButton = ({ to, icon: Icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 glass-dark rounded-2xl text-sm font-semibold text-gray-700 hover:bg-white/40 transition-colors"
  >
    <Icon className="w-5 h-5 text-forest-olive flex-shrink-0" />
    {label}
  </Link>
);

const AdminDashboard = () => {
  const { completedHikes } = useOutletContext();

  return (
    <div className="max-w-3xl md:flex-1 md:flex md:flex-col md:justify-between">
      <div className="glass rounded-3xl p-6 mb-6 md:mb-0">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Sirimon Hikers Admin</h1>
        <p className="text-gray-700 leading-relaxed">
          This panel lets you manage all aspects of the Sirimon Hikers community — from publishing hike
          details and updating the calendar, to maintaining directories of our guides, curating
          companies, and resources. Use the menu on the left to get started.
        </p>
      </div>

      <div className="glass rounded-3xl p-6 mb-6 md:mb-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            label="Completed Hikes"
            value={completedHikes?.length ?? 0}
            note={completedHikes?.length > 0 ? 'and counting.' : 'None yet.'}
          />
          <StatCard label="Hikers Contacts" value="—" note="Coming soon" />
          <StatCard label="Guides" value="—" note="Coming soon" />
          <StatCard label="Companies" value="—" note="Coming soon" />
        </div>
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ShortcutButton to="/admin/edit-hike" icon={Mountain} label="Add or Edit Upcoming Hike" />
          <ShortcutButton to="/admin/edit-calendar" icon={Calendar} label="Update Calendar" />
          <ShortcutButton to="/admin/edit-dashboard" icon={Edit3} label="Edit Dashboard Notices" />
          <ShortcutButton to="/admin/edit-completed" icon={CheckCircle} label="Edit Completed Hikes" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
