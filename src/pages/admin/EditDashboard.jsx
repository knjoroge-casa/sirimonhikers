import React from 'react';
import { Edit3 } from 'lucide-react';

const EditDashboard = () => (
  <div className="max-w-3xl">
    <div className="flex items-center gap-3 mb-2">
      <Edit3 className="w-6 h-6 text-forest-olive" />
      <h1 className="text-2xl font-bold text-gray-800">Edit Dashboard</h1>
    </div>
    <p className="text-gray-500 italic">Coming soon — edit dashboard intro and notices here.</p>
  </div>
);

export default EditDashboard;
