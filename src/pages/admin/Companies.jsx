import React from 'react';
import { Building2 } from 'lucide-react';

const Companies = () => (
  <div className="max-w-3xl">
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="w-6 h-6 text-forest-olive" />
        <h1 className="text-2xl font-bold text-gray-800">Hike Curating Companies</h1>
      </div>
      <p className="text-gray-700 italic">Coming soon — manage hike curating companies here.</p>
    </div>
  </div>
);

export default Companies;
