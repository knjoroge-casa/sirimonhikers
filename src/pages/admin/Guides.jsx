import React from 'react';
import { Compass } from 'lucide-react';

const Guides = () => (
  <div className="max-w-3xl">
    <div className="flex items-center gap-3 mb-2">
      <Compass className="w-6 h-6 text-forest-olive" />
      <h1 className="text-2xl font-bold text-gray-800">Guides Directory</h1>
    </div>
    <p className="text-gray-500 italic">Coming soon — manage guides directory here.</p>
  </div>
);

export default Guides;
