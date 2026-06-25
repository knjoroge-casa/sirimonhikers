import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ADMIN_PASSWORD = "hiking2026";

const AdminLogin = ({ isAdminAuthenticated, setIsAdminAuthenticated }) => {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const adminNavigate = useNavigate();

  const handleSubmit = () => {
    if (pwd === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
    } else {
      setError(true);
      setPwd('');
    }
  };

  if (isAdminAuthenticated) {
    const navLinks = [
      { label: 'Dashboard', to: '/' },
      { label: 'Hike Details', to: '/nexthike' },
      { label: 'Calendar', to: '/fullcalendar' },
      { label: 'Completed Hikes', to: '/completedhikes' },
    ];
    const comingSoon = [
      { title: 'Hike Curating Companies', desc: 'Coming soon — manage companies that curate our hikes' },
      { title: 'Guides Directory', desc: 'Coming soon — directory of our hiking guides' },
      { title: 'Resources Directory', desc: 'Coming soon — bus drivers, hotels, restaurants, etc.' },
      { title: 'Hikers Contact List', desc: 'Coming soon — master contact list of all hikers' },
    ];
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-white drop-shadow-2xl mb-1">Admin Panel</h1>
            <p className="text-white/80 text-sm font-medium tracking-wide">Manage Sirimon Hikers</p>
          </div>

          <div className="glass rounded-3xl p-6 mb-4">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Edit Public Pages</h2>
            <div className="grid grid-cols-2 gap-3">
              {navLinks.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="py-3 rounded-2xl font-semibold text-white text-center text-sm transition hover:opacity-90"
                  style={{ backgroundColor: '#6B8E23' }}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {comingSoon.map(({ title, desc }) => (
            <div key={title} className="glass rounded-3xl p-6 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-gray-700 mb-1">{title}</h2>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button
                  disabled
                  className="ml-4 px-4 py-2 rounded-2xl text-sm font-semibold text-gray-400 bg-gray-100 cursor-not-allowed shrink-0"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}

          <div className="text-center mt-6 pb-8">
            <button
              onClick={() => { setIsAdminAuthenticated(false); adminNavigate('/'); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: '#6B8E23' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
        <p className="text-lg font-semibold text-gray-700 mb-6">
          If the trail led you here, you know what to do
        </p>
        <input
          type="password"
          placeholder="Password"
          value={pwd}
          onChange={(e) => { setPwd(e.target.value); setError(false); }}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
          className="w-full px-4 py-3 glass rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-green-600 mb-3 text-gray-800"
        />
        {error && (
          <p className="text-red-600 text-sm mb-3 font-medium">Incorrect password</p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-2xl font-semibold text-white transition"
          style={{ backgroundColor: '#6B8E23' }}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
