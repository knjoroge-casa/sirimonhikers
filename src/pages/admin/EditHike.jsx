import React from 'react';
import { Mountain } from 'lucide-react';

const EditHike = () => (
  <div className="max-w-3xl">
    <div className="flex items-center gap-3 mb-2">
      <Mountain className="w-6 h-6 text-forest-olive" />
      <h1 className="text-2xl font-bold text-gray-800">Edit Hike Details</h1>
    </div>
    <p className="text-gray-500 italic">Coming soon — edit upcoming hike details here.</p>
  </div>
);

export default EditHike;
