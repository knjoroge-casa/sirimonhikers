import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditCompletedHikeModal = ({ currentCompletedHike, setIsEditingCompletedHike, setCurrentCompletedHike, saveCompletedHike }) => {
  const [editData, setEditData] = useState({ ...currentCompletedHike });
  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be less than 5MB');
        return;
      }
      setPhotoFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Edit Completed Hike</h3>
          <button onClick={() => { setIsEditingCompletedHike(false); setCurrentCompletedHike(null); }} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hike Name</label>
            <input
              type="text"
              value={editData.name || ''}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={editData.date || ''}
              onChange={(e) => setEditData({ ...editData, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Elevation</label>
            <input
              type="text"
              value={editData.elevation || ''}
              onChange={(e) => setEditData({ ...editData, elevation: e.target.value })}
              placeholder="800m"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Participants</label>
            <input
              type="number"
              value={editData.participants || ''}
              onChange={(e) => setEditData({ ...editData, participants: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Actual Cost (KES)</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 py-2 bg-gray-100 text-gray-600 font-semibold text-sm border-r border-gray-300">KES</span>
              <input
                type="number"
                value={editData.actual_cost || ''}
                onChange={(e) => setEditData({ ...editData, actual_cost: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="0"
                className="w-full px-4 py-2 border-0 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Actual Distance (km)</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 py-2 bg-gray-100 text-gray-600 font-semibold text-sm border-r border-gray-300">km</span>
              <input
                type="number"
                step="0.1"
                value={editData.actual_distance || ''}
                onChange={(e) => setEditData({ ...editData, actual_distance: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="0"
                className="w-full px-4 py-2 border-0 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Actual Elevation (m)</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 py-2 bg-gray-100 text-gray-600 font-semibold text-sm border-r border-gray-300">m</span>
              <input
                type="number"
                value={editData.actual_elevation || ''}
                onChange={(e) => setEditData({ ...editData, actual_elevation: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="0"
                className="w-full px-4 py-2 border-0 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Write-up</label>
            <textarea
              value={editData.write_up || ''}
              onChange={(e) => setEditData({ ...editData, write_up: e.target.value })}
              rows="6"
              placeholder="Share your experience from this hike..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Group Photo (Max 5MB)</label>
            {editData.group_photo_url && (
              <div className="mb-2">
                <img src={editData.group_photo_url} alt="Current group photo" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {photoFile && <p className="text-sm text-gray-600 mt-1">New photo selected: {photoFile.name}</p>}
          </div>
        </div>

        <button
          onClick={() => saveCompletedHike(editData, photoFile)}
          className="w-full mt-4 py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
          style={{ backgroundColor: '#6B8E23' }}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditCompletedHikeModal;
