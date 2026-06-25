import React from 'react';
import { CheckCircle } from 'lucide-react';

const EditCompleted = () => (
  <div className="max-w-3xl">
    <div className="flex items-center gap-3 mb-2">
      <CheckCircle className="w-6 h-6 text-forest-olive" />
      <h1 className="text-2xl font-bold text-gray-800">Edit Completed Hikes</h1>
    </div>
    <p className="text-gray-500 italic">Coming soon — edit completed hikes here.</p>
  </div>
);

export default EditCompleted;
