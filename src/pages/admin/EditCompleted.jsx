import React from 'react';
import { CheckCircle } from 'lucide-react';

const EditCompleted = () => (
  <div className="max-w-3xl">
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="w-6 h-6 text-forest-olive" />
        <h1 className="text-2xl font-bold text-gray-800">Edit Completed Hikes</h1>
      </div>
      <p className="text-gray-700 italic">Coming soon — edit completed hikes here.</p>
    </div>
  </div>
);

export default EditCompleted;
