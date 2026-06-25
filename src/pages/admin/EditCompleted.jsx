import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Edit2, Mountain } from 'lucide-react';
import EditCompletedHikeModal from '../../components/EditCompletedHikeModal';

const EditCompleted = () => {
  const { completedHikes, saveCompletedHike } = useOutletContext();
  const [currentHike, setCurrentHike] = useState(null);

  const handleSave = async (editData, photoFile) => {
    await saveCompletedHike(editData, photoFile);
    setCurrentHike(null);
  };

  return (
    <div className="max-w-3xl">
      <div className="glass rounded-3xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Edit Completed Hikes</h1>

        {!completedHikes?.length ? (
          <p className="text-gray-500 italic mt-4">No completed hikes on record yet.</p>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">
              {completedHikes.length} hike{completedHikes.length !== 1 ? 's' : ''} on record
            </p>
            <div className="space-y-3">
              {completedHikes.map((hike) => (
                <div
                  key={hike.id}
                  className="glass-dark rounded-2xl p-4 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Mountain className="w-4 h-4 text-forest-olive flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{hike.name}</p>
                      {hike.date && (
                        <p className="text-xs text-gray-500">
                          {new Date(hike.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentHike(hike)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-700 glass rounded-xl hover:bg-white/40 transition-colors flex-shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {currentHike && (
        <EditCompletedHikeModal
          currentCompletedHike={currentHike}
          setIsEditingCompletedHike={() => setCurrentHike(null)}
          setCurrentCompletedHike={setCurrentHike}
          saveCompletedHike={handleSave}
        />
      )}
    </div>
  );
};

export default EditCompleted;
