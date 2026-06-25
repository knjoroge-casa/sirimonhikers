import React, { useState } from 'react';

const ADMIN_PASSWORD = "hiking2026";

const AdminLogin = ({ setIsAdminAuthenticated }) => {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (pwd === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
    } else {
      setError(true);
      setPwd('');
    }
  };

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
