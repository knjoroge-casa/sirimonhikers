import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditHikeForm = ({ upcomingHike, setIsEditing, saveUpcomingHike, setIsEditingItems, markHikeAsCompleted, itemLabels, customItems }) => {
  const [editData, setEditData] = useState({ ...upcomingHike });
  const allItems = { ...itemLabels, ...customItems };

  const handleCheckboxChange = (item) => {
    setEditData({
      ...editData,
      whatToBring: {
        ...editData.whatToBring,
        [item]: !editData.whatToBring[item]
      }
    });
  };

  return (
    <div className="glass rounded-3xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Edit Upcoming Hike</h2>
        <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:text-gray-800">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Hike Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={editData.date}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              className="w-full px-4 py-2 glass rounded-2xl border-0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
            <input
              type="text"
              value={editData.time}
              onChange={(e) => setEditData({ ...editData, time: e.target.value })}
              placeholder="7:00 AM"
              className="w-full px-4 py-2 glass rounded-2xl border-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            End Date <span className="font-normal text-gray-400">(optional – for multi-day hikes)</span>
          </label>
          <input
            type="date"
            value={editData.end_date || ''}
            onChange={(e) => setEditData({ ...editData, end_date: e.target.value || null })}
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Hike Location</label>
          <input
            type="text"
            value={editData.location}
            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Meeting Point</label>
          <input
            type="text"
            value={editData.meetingPoint}
            onChange={(e) => setEditData({ ...editData, meetingPoint: e.target.value })}
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Introduction</label>
          <textarea
            value={editData.intro}
            onChange={(e) => setEditData({ ...editData, intro: e.target.value })}
            rows="2"
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">What to Expect</label>
          <textarea
            value={editData.whatToExpect}
            onChange={(e) => setEditData({ ...editData, whatToExpect: e.target.value })}
            rows="3"
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty</label>
            <select
              value={editData.difficulty}
              onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
              className="w-full px-4 py-2 glass rounded-2xl border-0"
            >
              <option>Friendly</option>
              <option>Moderate</option>
              <option>Let's Challenge Ourselves</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Distance</label>
            <input
              type="text"
              value={editData.distance}
              onChange={(e) => setEditData({ ...editData, distance: e.target.value })}
              placeholder="12 km"
              className="w-full px-4 py-2 glass rounded-2xl border-0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              value={editData.duration}
              onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
              placeholder="4-5 hours"
              className="w-full px-4 py-2 glass rounded-2xl border-0"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Elevation</label>
            <input
              type="text"
              value={editData.elevation}
              onChange={(e) => setEditData({ ...editData, elevation: e.target.value })}
              placeholder="800m"
              className="w-full px-4 py-2 glass rounded-2xl border-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Weather</label>
          <textarea
            value={editData.weather}
            onChange={(e) => setEditData({ ...editData, weather: e.target.value })}
            rows="2"
            placeholder="Expected weather conditions"
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Cost</label>
          <p className="text-xs text-gray-500 italic mb-2">
            Final cost shared on the day. Covers access fees, guides, logistics, lunch, and all the invisible work that makes this feel effortless.
          </p>
          <input
            type="text"
            value={editData.cost}
            onChange={(e) => setEditData({ ...editData, cost: e.target.value })}
            placeholder="KES 500"
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Post Hike Manenos</label>
          <textarea
            value={editData.postHikeManenos}
            onChange={(e) => setEditData({ ...editData, postHikeManenos: e.target.value })}
            rows="2"
            placeholder="What happens after the hike?"
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Last Words</label>
          <textarea
            value={editData.lastWords}
            onChange={(e) => setEditData({ ...editData, lastWords: e.target.value })}
            rows="2"
            placeholder="Final tips or encouragement"
            className="w-full px-4 py-2 glass rounded-2xl border-0"
          />
        </div>

        <div className="flex items-center gap-3 p-4 glass-dark rounded-2xl">
          <input
            type="checkbox"
            id="registration-closed"
            checked={editData.registrationClosed || false}
            onChange={(e) => setEditData({ ...editData, registrationClosed: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
          />
          <label htmlFor="registration-closed" className="font-semibold text-gray-800 cursor-pointer">
            Close Registration (The bus is full, and other short stories!)
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">What to Bring</label>
          <div className="grid grid-cols-2 gap-3">
            {Object.keys(allItems).map(item => (
              <label key={item} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editData.whatToBring[item] || false}
                  onChange={() => handleCheckboxChange(item)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">{allItems[item]}</span>
              </label>
            ))}
          </div>
          <button
            onClick={() => setIsEditingItems(true)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline"
          >
            + Manage Item List
          </button>
        </div>

        <button
          onClick={() => saveUpcomingHike(editData)}
          className="w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
          style={{ backgroundColor: '#6B8E23' }}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>

        {(() => {
          const hikeDate = new Date(editData.date + 'T00:00:00');
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dayAfterHike = new Date(hikeDate);
          dayAfterHike.setDate(dayAfterHike.getDate() + 1);

          if (today >= dayAfterHike) {
            return (
              <button
                onClick={markHikeAsCompleted}
                className="w-full mt-4 py-3 rounded-2xl font-semibold text-white bg-green-600 hover:bg-green-700 flex items-center justify-center"
              >
                ✓ Mark as Completed
              </button>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default EditHikeForm;
