import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditCalendarForm = ({ hikeCalendar, setIsEditingCalendar, saveCalendar }) => {
  const [calendarData, setCalendarData] = useState([...hikeCalendar]);

  const handleUpdateHike = (index, field, value) => {
    const updated = [...calendarData];
    updated[index] = { ...updated[index], [field]: value };
    setCalendarData(updated);
  };

  const handleAddHike = () => {
    setCalendarData([...calendarData, {
      id: calendarData.length + 1,
      month: "",
      hike: "",
      date: "",
      prerequisites: ""
    }]);
  };

  const handleRemoveHike = (index) => {
    setCalendarData(calendarData.filter((_, i) => i !== index));
  };

  return (
    <div className="glass rounded-3xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Edit Calendar</h2>
        <button onClick={() => setIsEditingCalendar(false)} className="text-gray-600 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {calendarData.map((hike, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-700">Hike {index + 1}</h3>
              <button onClick={() => handleRemoveHike(index)} className="text-red-600 hover:text-red-700" title="Remove hike">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Month"
                value={hike.month}
                onChange={(e) => handleUpdateHike(index, 'month', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <input
                type="date"
                value={hike.date}
                onChange={(e) => handleUpdateHike(index, 'date', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Hike name"
              value={hike.hike}
              onChange={(e) => handleUpdateHike(index, 'hike', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <textarea
              placeholder="Prerequisites"
              value={hike.prerequisites}
              onChange={(e) => handleUpdateHike(index, 'prerequisites', e.target.value)}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        ))}
      </div>
      <button onClick={handleAddHike} className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
        + Add Hike
      </button>
      <button
        onClick={() => saveCalendar(calendarData)}
        className="w-full mt-4 py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
        style={{ backgroundColor: '#6B8E23' }}
      >
        <Save className="w-5 h-5 mr-2" />
        Save Calendar
      </button>
    </div>
  );
};

export default EditCalendarForm;
