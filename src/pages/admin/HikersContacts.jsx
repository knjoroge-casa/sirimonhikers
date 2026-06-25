import React from 'react';
import { Users } from 'lucide-react';

const HikersContacts = () => (
  <div className="max-w-3xl">
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-6 h-6 text-forest-olive" />
        <h1 className="text-2xl font-bold text-gray-800">Hikers Contact List</h1>
      </div>
      <p className="text-gray-700 italic">Coming soon — manage hikers contact list here.</p>
    </div>
  </div>
);

export default HikersContacts;
