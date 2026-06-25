import React from 'react';
import { Calendar } from 'lucide-react';

const EditCalendar = () => (
  <div className="max-w-3xl">
    <div className="flex items-center gap-3 mb-2">
      <Calendar className="w-6 h-6 text-forest-olive" />
      <h1 className="text-2xl font-bold text-gray-800">Edit Calendar</h1>
    </div>
    <p className="text-gray-500 italic">Coming soon — edit full year calendar here.</p>
  </div>
);

export default EditCalendar;
