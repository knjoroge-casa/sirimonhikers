import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Info, ChevronRight, Download, Edit, Lock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditHikeForm from '../components/EditHikeForm';
import EditItemsForm from '../components/EditItemsForm';
import useCountdown from '../hooks/useCountdown';

const HikeDetailsPage = ({
  upcomingHike, setUpcomingHike,
  isAdminAuthenticated,
  isEditing, setIsEditing,
  isEditingItems, setIsEditingItems,
  hikeCalendar,
  customItems,
  registrations,
  handleRegister,
  saveCustomItems,
  saveAsPDF,
  downloadSingleEvent,
  toggleCheckIn,
  itemLabels,
  navigate,
  saveUpcomingHike,
  markHikeAsCompleted,
}) => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const allItems = { ...itemLabels, ...customItems };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextCalendarHike = !upcomingHike
    ? (hikeCalendar || []).find(h => new Date(h.date) >= today)
    : null;
  const countdown = useCountdown(nextCalendarHike?.date || null, nextCalendarHike?.time);

  const handleSubmit = () => {
    if (formData.name && formData.phone) {
      handleRegister(formData.name, formData.phone);
      setFormData({ name: '', phone: '' });
    } else {
      alert('Please fill in all fields');
    }
  };

  if (!upcomingHike) {
    if (nextCalendarHike) {
      const calFormattedDate = (() => {
        const s = new Date(nextCalendarHike.date + 'T00:00:00');
        if (nextCalendarHike.is_out_of_town && nextCalendarHike.end_date) {
          const e = new Date(nextCalendarHike.end_date + 'T00:00:00');
          const short = { day: 'numeric', month: 'short' };
          const full = { day: 'numeric', month: 'short', year: 'numeric' };
          if (s.getFullYear() === e.getFullYear()) {
            return `${s.toLocaleDateString('en-GB', short)} – ${e.toLocaleDateString('en-GB', full)}`;
          }
          return `${s.toLocaleDateString('en-GB', full)} – ${e.toLocaleDateString('en-GB', full)}`;
        }
        return s.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      })();

      return (
        <div className="max-w-2xl mx-auto pb-24 md:pb-0">
          <div className="glass rounded-3xl p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#6B8E23' }}>Next Hike</p>
                <h2 className="text-2xl font-bold text-gray-800">{nextCalendarHike.hike}</h2>
                {nextCalendarHike.is_out_of_town && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#6B8E23' }}>
                    Out of Town
                  </span>
                )}
                <p className="text-gray-600 mt-1">{calFormattedDate}</p>
              </div>
              <div className="text-right">
                <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: '#f5f7ee' }}>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B8E23' }}>Countdown</p>
                  <p className="text-2xl font-bold font-mono" style={{ color: '#4a6015' }}>{countdown}</p>
                </div>
              </div>
            </div>
            {nextCalendarHike.prerequisites && (
              <p className="text-gray-600 text-sm mb-4">{nextCalendarHike.prerequisites}</p>
            )}
            <div className="rounded-2xl px-4 py-3 text-center" style={{ backgroundColor: '#f5f7ee' }}>
              <p className="text-sm font-semibold mb-3" style={{ color: '#4a6015' }}>Full hike details coming soon</p>
              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    const newHike = {
                      name: nextCalendarHike.hike,
                      date: nextCalendarHike.date,
                      time: '',
                      location: '',
                      intro: '',
                      whatToExpect: nextCalendarHike.prerequisites,
                      difficulty: '',
                      duration: '',
                      distance: '',
                      elevation: '',
                      weather: '',
                      meetingPoint: '',
                      cost: '',
                      postHikeManenos: '',
                      lastWords: '',
                      whatToBring: {}
                    };
                    setUpcomingHike(newHike);
                    setIsEditing(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm"
                >
                  Add Full Details
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto pb-24 md:pb-0">
        <div className="hidden md:block mb-4">
          <Link to="/" className="text-white/90 hover:text-white font-semibold flex items-center">
            ← Back to Dashboard
          </Link>
        </div>
        <div className="glass rounded-3xl p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Upcoming Hike Details Yet</h2>
          <p className="text-gray-600 mb-6">Add details for the next hike.</p>
          {isAdminAuthenticated && (
            <button
              onClick={() => {
                const nextHike = hikeCalendar.find(h => new Date(h.date) >= today);
                const newHike = {
                  name: nextHike?.hike || '',
                  date: nextHike?.date || '',
                  time: '',
                  location: '',
                  intro: '',
                  whatToExpect: nextHike?.prerequisites || '',
                  difficulty: '',
                  duration: '',
                  distance: '',
                  elevation: '',
                  weather: '',
                  meetingPoint: '',
                  cost: '',
                  postHikeManenos: '',
                  lastWords: '',
                  whatToBring: {}
                };
                setUpcomingHike(newHike);
                setIsEditing(true);
              }}
              className="px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90"
              style={{ backgroundColor: '#6B8E23' }}
            >
              + Add Upcoming Hike
            </button>
          )}
        </div>
      </div>
    );
  }

  const formattedDate = (() => {
    const s = new Date(upcomingHike.date + 'T00:00:00');
    const e = upcomingHike.end_date ? new Date(upcomingHike.end_date + 'T00:00:00') : null;
    if (!e) return s.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const full = { day: 'numeric', month: 'short', year: 'numeric' };
    const dayMonth = { day: 'numeric', month: 'short' };
    if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
      return `${s.getDate()} – ${e.toLocaleDateString('en-GB', full)}`;
    }
    if (s.getFullYear() === e.getFullYear()) {
      return `${s.toLocaleDateString('en-GB', dayMonth)} – ${e.toLocaleDateString('en-GB', full)}`;
    }
    return `${s.toLocaleDateString('en-GB', full)} – ${e.toLocaleDateString('en-GB', full)}`;
  })();

  const selectedItems = Object.keys(allItems)
    .filter(key => upcomingHike.whatToBring[key])
    .map(key => allItems[key]);

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-0">
      {isEditingItems && (
        <EditItemsForm
          customItems={customItems}
          setIsEditingItems={setIsEditingItems}
          saveCustomItems={saveCustomItems}
          itemLabels={itemLabels}
        />
      )}
      <div className="hidden md:block mb-4">
        <button
          onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-white/90 hover:text-white font-semibold flex items-center"
        >
          ← Back to Dashboard
        </button>
      </div>
      {isEditing ? (
        <EditHikeForm
          upcomingHike={upcomingHike}
          setIsEditing={setIsEditing}
          saveUpcomingHike={saveUpcomingHike}
          setIsEditingItems={setIsEditingItems}
          markHikeAsCompleted={markHikeAsCompleted}
          itemLabels={itemLabels}
          customItems={customItems}
        />
      ) : (
        <>
          <div className="glass rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{upcomingHike.name}</h1>
              <div className="flex gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {upcomingHike.difficulty}
                </span>
                {isAdminAuthenticated ? (
                  <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-700" title="Edit">
                    <Edit className="w-5 h-5" />
                  </button>
                ) : (
                  <Link to="/admin" className="text-gray-600 hover:text-gray-700" title="Admin">
                    <Lock className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <span>{formattedDate} at {upcomingHike.time}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <span><strong>Meeting Point:</strong> {upcomingHike.meetingPoint}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                <span><strong>Location:</strong> {upcomingHike.location}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Clock className="w-5 h-5 mr-3 text-blue-600" />
                <span>{upcomingHike.duration} • {upcomingHike.distance}</span>
              </div>
            </div>

            {upcomingHike.intro && (
              <div className="mb-6">
                <p className="text-gray-700 italic" style={{ whiteSpace: 'pre-wrap' }}>
                  {upcomingHike.intro}
                </p>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">What to Expect</h3>
              <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                {upcomingHike.whatToExpect}
              </p>
            </div>

            <div className="mb-6 glass-dark p-4 rounded-2xl">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700">Difficulty:</span>
                  <p className="text-gray-600">{upcomingHike.difficulty}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Distance:</span>
                  <p className="text-gray-600">{upcomingHike.distance}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Duration:</span>
                  <p className="text-gray-600">{upcomingHike.duration}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Elevation:</span>
                  <p className="text-gray-600">{upcomingHike.elevation}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Weather</h3>
              <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                {upcomingHike.weather}
              </p>
            </div>

            <div className="glass-dark p-4 rounded-2xl mb-6">
              <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Estimated Cost
              </h3>
              <p className="text-xs text-gray-500 italic mb-2">
                Final cost shared on the day. Covers access fees, guides, logistics, lunch, and all the invisible work that makes this feel effortless.
              </p>
              <p className="text-gray-700 font-semibold">{upcomingHike.cost}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">What to Bring:</h3>
              <ul className="space-y-2">
                {selectedItems.map((item, idx) => (
                  <li key={idx} className="flex items-start text-gray-700">
                    <span className="text-blue-600 mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Post Hike Manenos</h3>
              <p className="text-gray-700">{upcomingHike.postHikeManenos}</p>
            </div>

            <div className="mb-6 glass-dark p-4 rounded-2xl border-l-4 border-forest-olive">
              <h3 className="font-semibold text-gray-800 mb-2">Last Words</h3>
              <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                {upcomingHike.lastWords}
              </p>
            </div>

            {isAdminAuthenticated && (
              <button
                onClick={saveAsPDF}
                className="w-full mb-4 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Save as PDF
              </button>
            )}

            <button
              onClick={() => downloadSingleEvent(upcomingHike)}
              className="w-full mb-4 py-2 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Download className="w-5 h-5 mr-2" />
              Add to My Calendar
            </button>

            {upcomingHike.registrationClosed ? (
              <div className="glass rounded-3xl p-6 mb-6 text-center">
                <h3 className="font-semibold text-gray-800 text-lg mb-2">Registration Closed</h3>
                <p className="text-gray-600">The bus is probably full, and other short stories!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 text-lg mb-3">Are you coming? Register here!</h3>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90"
                  style={{ backgroundColor: '#6B8E23' }}
                >
                  Register Now
                </button>
              </div>
            )}
          </div>

          {isAdminAuthenticated && (
            <div className="glass rounded-3xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">Registered Hikers</h3>
                  <p className="text-sm text-gray-500">
                    {registrations.length} registered • {registrations.filter(r => r.checked_in).length} checked in
                  </p>
                </div>
              </div>
              {registrations.length === 0 ? (
                <p className="text-gray-400 italic text-sm">No registrations yet</p>
              ) : (
                <div className="space-y-2">
                  {registrations.map((reg) => (
                    <div key={reg.id} className="flex items-center justify-between glass-dark p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={reg.checked_in || false}
                          onChange={() => toggleCheckIn(reg.id, reg.checked_in)}
                          className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{reg.name}</p>
                          <p className="text-xs text-gray-500">{reg.phone}</p>
                        </div>
                      </div>
                      {reg.checked_in && reg.checked_in_at && (
                        <span className="text-xs text-green-600 font-semibold">
                          ✓ {new Date(reg.checked_in_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Africa/Nairobi'
                          })}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => { navigate('/fullcalendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="w-full glass text-trail-brown py-3 rounded-2xl hover:bg-gray-200 transition flex items-center justify-center"
          >
            View Full Year Calendar
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </>
      )}
    </div>
  );
};

export default HikeDetailsPage;
