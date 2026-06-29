import React from 'react';
import { Download, Edit } from 'lucide-react';
import EditCalendarForm from '../components/EditCalendarForm';

const formatCalendarDate = (hike) => {
  const s = new Date(hike.date + 'T00:00:00');
  if (!hike.is_out_of_town || !hike.end_date) {
    return s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  const e = new Date(hike.end_date + 'T00:00:00');
  const short = { day: 'numeric', month: 'short' };
  const full = { day: 'numeric', month: 'short', year: 'numeric' };
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.toLocaleDateString('en-GB', short)} – ${e.toLocaleDateString('en-GB', full)}`;
  }
  return `${s.toLocaleDateString('en-GB', full)} – ${e.toLocaleDateString('en-GB', full)}`;
};

const CalendarPage = ({
  isEditingCalendar, setIsEditingCalendar,
  isAdminAuthenticated,
  navigate,
  downloadAllEvents,
  hikeCalendar,
  downloadSingleEvent,
  saveCalendar,
}) => {
  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-0">
      {isEditingCalendar ? (
        <EditCalendarForm
          hikeCalendar={hikeCalendar}
          setIsEditingCalendar={setIsEditingCalendar}
          saveCalendar={saveCalendar}
        />
      ) : (
        <>
          <div className="flex items-center justify-end md:justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="hidden md:flex text-white/90 hover:text-white font-semibold items-center"
            >
              ← Back to Home
            </button>
            <div className="flex gap-2">
              {isAdminAuthenticated && (
                <button
                  onClick={() => setIsEditingCalendar(true)}
                  className="text-blue-600 hover:text-blue-700"
                  title="Edit calendar"
                >
                  <Edit className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={downloadAllEvents}
                className="bg-forest-olive text-white px-4 py-2 rounded-2xl font-semibold hover:brightness-90"
              >
                <Download className="w-5 h-5 mr-2" />
                Download All
              </button>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">2026 Hiking Calendar</h1>
          <div className="space-y-4">
            {hikeCalendar.map(hike => {
              const formattedDate = formatCalendarDate(hike);
              return (
                <div key={hike.id} className="glass rounded-3xl p-5 hover:shadow-2xl transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-gray-800">{hike.hike}</h3>
                        {hike.is_out_of_town && (
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-semibold text-white flex-shrink-0"
                            style={{ backgroundColor: '#6B8E23' }}
                          >
                            Out of Town
                          </span>
                        )}
                      </div>
                      <p className="text-blue-600 font-semibold">{formattedDate}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {hike.month}
                      </span>
                      <button
                        onClick={() => downloadSingleEvent(hike)}
                        className="text-forest-olive hover:text-forest-moss"
                        title="Add to calendar"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 glass-dark p-3 rounded-2xl border-l-4 border-forest-olive">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Details:</span> {hike.prerequisites}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarPage;
