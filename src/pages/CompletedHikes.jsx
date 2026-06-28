import React, { useState } from 'react';
import { ChevronRight, Edit } from 'lucide-react';

const CompletedHikesPage = ({ completedHikes, isAdminAuthenticated, navigate, setCurrentCompletedHike, setIsEditingCompletedHike }) => {
  const [expandedHike, setExpandedHike] = useState(null);

  const toggleExpand = (hikeId) => {
    setExpandedHike(expandedHike === hikeId ? null : hikeId);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-0">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-white/90 hover:text-white font-semibold flex items-center"
        >
          ← Back to Home
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Completed Hikes</h1>
      <p className="text-gray-600 mb-6">
        {completedHikes.length} hike{completedHikes.length !== 1 ? 's' : ''} completed
      </p>

      {completedHikes.length === 0 ? (
        <div className="glass rounded-3xl p-6 text-center">
          <p className="text-gray-600">No completed hikes yet. Check back after your first adventure!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedHikes.map(hike => {
            const isExpanded = expandedHike === hike.id;
            const formattedDate = new Date(hike.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div key={hike.id} className="glass rounded-3xl overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleExpand(hike.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    {hike.group_photo_url && (
                      <img src={hike.group_photo_url} alt={hike.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{hike.name}</h3>
                      <p className="text-blue-600 font-semibold">{formattedDate}</p>
                      {hike.participants > 0 && (
                        <p className="text-sm text-gray-600 mt-1">{hike.participants} participants</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Completed
                      </span>
                      {isAdminAuthenticated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentCompletedHike(hike);
                            setIsEditingCompletedHike(true);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-200">
                    {hike.group_photo_url && (
                      <div className="mt-4 mb-4">
                        <img src={hike.group_photo_url} alt="Group photo" className="w-full h-64 object-cover rounded-lg" />
                      </div>
                    )}

                    {hike.write_up && (
                      <div className="mt-4 bg-blue-50 p-4 rounded-2xl">
                        <h4 className="font-semibold text-gray-800 mb-2">Our Experience</h4>
                        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.write_up}</p>
                      </div>
                    )}

                    {hike.intro && (
                      <div className="mt-4">
                        <p className="text-gray-700 italic" style={{ whiteSpace: 'pre-wrap' }}>{hike.intro}</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">What to Expect</h4>
                      <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.what_to_expect}</p>
                    </div>

                    <div className="mt-4 glass-dark p-4 rounded-2xl">
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Difficulty</span>
                          <p className="text-gray-600">{hike.difficulty}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Distance</span>
                          <p className="text-gray-600 text-xs text-gray-400">Estimated</p>
                          <p className="text-gray-600">{hike.distance}</p>
                          {hike.actual_distance && (
                            <>
                              <p className="text-xs text-green-600 mt-1">Actual</p>
                              <p className="text-green-700 font-semibold">{Number(hike.actual_distance).toLocaleString()} km</p>
                            </>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Duration</span>
                          <p className="text-gray-600">{hike.duration}</p>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Elevation</span>
                          <p className="text-xs text-gray-400">Estimated</p>
                          <p className="text-gray-600">{hike.elevation}</p>
                          {hike.actual_elevation && (
                            <>
                              <p className="text-xs text-green-600 mt-1">Actual</p>
                              <p className="text-green-700 font-semibold">{Number(hike.actual_elevation).toLocaleString()} m</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {hike.weather && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Weather</h4>
                        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.weather}</p>
                      </div>
                    )}

                    <div className="mt-4 glass-dark p-4 rounded-2xl">
                      <h4 className="font-semibold text-gray-800 mb-2">Details</h4>
                      <p className="text-gray-700"><span className="font-semibold">Location:</span> {hike.location}</p>
                      <p className="text-gray-700 mt-1"><span className="font-semibold">Meeting Point:</span> {hike.meeting_point}</p>
                      <div className="mt-1">
                        <span className="font-semibold text-gray-700">Cost</span>
                        <p className="text-xs text-gray-400">Estimated</p>
                        <p className="text-gray-700">{hike.cost}</p>
                        {hike.actual_cost && (
                          <>
                            <p className="text-xs text-green-600 mt-1">Actual</p>
                            <p className="text-green-700 font-semibold">KES {Number(hike.actual_cost).toLocaleString()}</p>
                          </>
                        )}
                      </div>
                      {hike.participants > 0 && (
                        <p className="text-gray-700 mt-1"><span className="font-semibold">Participants:</span> {hike.participants}</p>
                      )}
                    </div>

                    {hike.post_hike_manenos && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Post Hike Manenos</h4>
                        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.post_hike_manenos}</p>
                      </div>
                    )}

                    {hike.last_words && (
                      <div className="mt-4 glass-dark p-4 rounded-2xl border-l-4 border-forest-olive">
                        <h4 className="font-semibold text-gray-800 mb-2">Last Words</h4>
                        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.last_words}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompletedHikesPage;
