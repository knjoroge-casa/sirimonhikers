import React, { useState } from 'react';
import { MapPin, ChevronRight, Edit, X, Save } from 'lucide-react';
import useCountdown from '../hooks/useCountdown';
import CarouselStats from '../components/CarouselStats';

const DashboardPage = ({
  hikeCalendar,
  upcomingHike,
  completedHikes,
  dashboardIntro,
  noticeBoard,
  isAdminAuthenticated,
  isEditingIntro, setIsEditingIntro,
  setUpcomingHike,
  navigate,
  setIsEditing,
  saveDashboardIntro,
  saveNotice,
  deleteNotice,
  outOfTownHikes,
  outOfTownConfirmations,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextCalendarHike = hikeCalendar.find(h => new Date(h.date) >= today);
  const countdownTarget = upcomingHike?.date || nextCalendarHike?.date || null;
  const countdown = useCountdown(countdownTarget, upcomingHike?.time || nextCalendarHike?.time);

  const totalHikes = completedHikes.length;
  const totalKm = completedHikes.reduce((sum, h) => sum + (parseFloat(h.actual_distance) || 0), 0);
  const totalElevation = completedHikes.reduce((sum, h) => sum + (parseFloat(h.actual_elevation) || 0), 0);

  const [introText, setIntroText] = useState(dashboardIntro);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeBody, setNewNoticeBody] = useState('');
  const [showAddNotice, setShowAddNotice] = useState(false);

  const handleSaveIntro = () => saveDashboardIntro(introText);

  const ootFormatDateRange = (start, end) => {
    if (!start) return '';
    const s = new Date(start + 'T00:00:00');
    const e = end ? new Date(end + 'T00:00:00') : null;
    const short = { day: 'numeric', month: 'short' };
    const full = { day: 'numeric', month: 'short', year: 'numeric' };
    if (!e) return s.toLocaleDateString('en-GB', full);
    if (s.getFullYear() === e.getFullYear()) {
      return `${s.toLocaleDateString('en-GB', short)} – ${e.toLocaleDateString('en-GB', full)}`;
    }
    return `${s.toLocaleDateString('en-GB', full)} – ${e.toLocaleDateString('en-GB', full)}`;
  };

  const ootGetDaysUntilDeadline = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Passed';
    if (diff === 0) return 'Today';
    return `${diff} day${diff === 1 ? '' : 's'}`;
  };

  const ootGetConfirmationCount = (hikeId) =>
    (outOfTownConfirmations || []).filter(c => c.out_of_town_hike_id === hikeId).length;

  const DIFFICULTY_COLORS = {
    'Friendly': 'bg-green-100 text-green-800',
    'Moderate': 'bg-yellow-100 text-yellow-800',
    "Let's Challenge Ourselves": 'bg-orange-100 text-orange-800',
  };

  const nextOotHike = (outOfTownHikes || [])
    .filter(h => h.status === 'open' && h.show_on_dashboard && h.start_date && new Date(h.start_date + 'T00:00:00') >= today)
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0] || null;

  const handleAddNotice = async () => {
    if (!newNoticeTitle.trim() || !newNoticeBody.trim()) {
      alert('Please fill in both title and body');
      return;
    }
    await saveNotice(newNoticeTitle.trim(), newNoticeBody.trim());
    setNewNoticeTitle('');
    setNewNoticeBody('');
    setShowAddNotice(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* ── INTRO SECTION ── */}
      <div className="glass rounded-3xl p-6 mb-6 relative">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-700 uppercase tracking-widest text-sm">Welcome</h2>
          {isAdminAuthenticated && !isEditingIntro && (
            <button onClick={() => { setIsEditingIntro(true); }} className="text-gray-400 hover:text-blue-600">
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingIntro ? (
          <div>
            <textarea
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              rows="4"
              placeholder="Write a welcome message for the group..."
              className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />
            <div className="flex gap-2">
              <button onClick={handleSaveIntro} className="flex items-center px-4 py-2 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: '#6B8E23' }}>
                <Save className="w-4 h-4 mr-1" /> Save
              </button>
              <button onClick={() => { setIsEditingIntro(false); setIntroText(dashboardIntro); }} className="flex items-center px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold text-sm">
                <X className="w-4 h-4 mr-1" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
            {dashboardIntro || (isAdminAuthenticated ? <span className="text-gray-400 italic">No intro yet. Click the pencil to add one.</span> : null)}
          </p>
        )}
      </div>

      {/* ── NEXT HIKE CARD ── */}
      {upcomingHike ? (
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Next Hike</p>
              <h2 className="text-2xl font-bold text-gray-800">{upcomingHike.name}</h2>
              <p className="text-gray-600 mt-1">
                {new Date(upcomingHike.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {upcomingHike.time && ` · ${upcomingHike.time}`}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 rounded-2xl px-4 py-3">
                <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">Countdown</p>
                <p className="text-2xl font-bold text-blue-700 font-mono">{countdown}</p>
              </div>
            </div>
          </div>
          {upcomingHike.location && (
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              {upcomingHike.location}
            </div>
          )}
          <div className="flex gap-3 text-sm mb-4">
            {upcomingHike.difficulty && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">{upcomingHike.difficulty}</span>
            )}
            {upcomingHike.distance && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{upcomingHike.distance}</span>
            )}
            {upcomingHike.duration && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{upcomingHike.duration}</span>
            )}
          </div>
          <button
            onClick={() => { navigate('/nexthike'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="w-full py-3 rounded-2xl font-semibold text-white flex items-center justify-center"
            style={{ backgroundColor: '#6B8E23' }}
          >
            Hike Details <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      ) : nextCalendarHike ? (
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#6B8E23' }}>Save the Date</p>
              <h2 className="text-2xl font-bold text-gray-800">{nextCalendarHike.hike}</h2>
              <p className="text-gray-600 mt-1">
                {new Date(nextCalendarHike.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
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
                  navigate('/nexthike');
                  setIsEditing(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm"
              >
                Add Full Details
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl p-6 mb-6 text-center">
          <p className="text-gray-500 italic mb-4">No upcoming hikes scheduled yet. Check back soon!</p>
          {isAdminAuthenticated && (
            <button
              onClick={() => {
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                const nextHike = hikeCalendar.find(h => new Date(h.date) >= todayDate);
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
                navigate('/nexthike');
                setIsEditing(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              + Add Upcoming Hike
            </button>
          )}
        </div>
      )}

      {/* ── OUT OF TOWN HIKE CARD ── */}
      {nextOotHike && (() => {
        const confirmCount = ootGetConfirmationCount(nextOotHike.id);
        const capacity = parseInt(nextOotHike.max_capacity) || 0;
        const fillPercent = capacity > 0 ? Math.min(100, Math.round((confirmCount / capacity) * 100)) : 0;
        const isFull = capacity > 0 && confirmCount >= capacity;
        const daysLeft = ootGetDaysUntilDeadline(nextOotHike.confirmation_deadline);
        const deadlinePassed = daysLeft === 'Passed';
        return (
          <div className="glass rounded-3xl p-6 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6B8E23' }}>
              Out of Town Hike
            </p>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{nextOotHike.name}</h2>
            {(nextOotHike.start_date || nextOotHike.end_date) && (
              <p className="text-gray-600 mb-2">{ootFormatDateRange(nextOotHike.start_date, nextOotHike.end_date)}</p>
            )}
            {nextOotHike.location && (
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#6B8E23' }} />
                {nextOotHike.location}
              </div>
            )}
            {nextOotHike.difficulty && (
              <div className="mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${DIFFICULTY_COLORS[nextOotHike.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                  {nextOotHike.difficulty}
                </span>
              </div>
            )}
            {nextOotHike.confirmation_deadline && (
              <p className={`text-sm font-semibold mb-3 ${deadlinePassed ? 'text-red-500' : 'text-gray-600'}`}>
                {deadlinePassed ? 'Confirmations closed' : `Confirmations close in ${daysLeft}`}
              </p>
            )}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{confirmCount} of {capacity} spots confirmed</span>
                <span>{fillPercent}%</span>
              </div>
              <div className="w-full bg-white/30 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${fillPercent}%`, backgroundColor: isFull ? '#ef4444' : '#6B8E23' }}
                />
              </div>
            </div>
            <button
              onClick={() => { navigate('/outoftown'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full py-3 rounded-2xl font-semibold text-white flex items-center justify-center hover:opacity-90"
              style={{ backgroundColor: '#6B8E23' }}
            >
              Confirm Your Spot <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        );
      })()}

      {/* ── DAMAGE REPORT ── */}
      <div className="glass rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">The Damage Report</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">Sirimon Hikers · 2026</p>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{totalHikes}</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">Hikes</p>
            <p className="text-xs text-gray-400 mt-1">
              {totalHikes === 0 ? 'The adventure awaits.' : totalHikes === 1 ? 'And counting.' : 'and counting.'}
            </p>
          </div>
          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{totalKm > 0 ? totalKm.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">Kilometres</p>
            <p className="text-xs text-gray-400 mt-1">
              {totalKm === 0 ? 'Boots are ready.' : 'hiked voluntarily. No one forced us.'}
            </p>
          </div>
          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{totalElevation > 0 ? totalElevation.toLocaleString() : '—'}</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">Metres Up</p>
            <p className="text-xs text-gray-400 mt-1">
              {totalElevation === 0 ? 'Sky is the limit.' : `That's Mt. Kenya ${(totalElevation / 5199).toFixed(1)}x. Easy 🤪.`}
            </p>
          </div>
        </div>

        <CarouselStats />
      </div>

      {/* ── NOTICE BOARD ── */}
      {(noticeBoard.length > 0 || isAdminAuthenticated) && (
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Notice Board</h2>
              <p className="text-xs text-gray-500">Updates from the group</p>
            </div>
            {isAdminAuthenticated && (
              <button
                onClick={() => setShowAddNotice(!showAddNotice)}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                {showAddNotice ? 'Cancel' : noticeBoard.length < 3 ? '+ Add' : 'Manage'}
              </button>
            )}
          </div>

          {isAdminAuthenticated && showAddNotice && (
            <div className="mb-4 border border-blue-200 rounded-2xl p-4 bg-blue-50">
              <p className="text-xs text-blue-600 font-semibold mb-3">
                {noticeBoard.length < 3 ? `Add Notice (${noticeBoard.length}/3 used)` : 'Delete a notice below to add a new one'}
              </p>
              {noticeBoard.length < 3 && (
                <>
                  <input
                    type="text"
                    placeholder="Notice title"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 mb-2 text-sm"
                  />
                  <textarea
                    placeholder="Notice body"
                    value={newNoticeBody}
                    onChange={(e) => setNewNoticeBody(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 mb-2 text-sm"
                  />
                  <button
                    onClick={handleAddNotice}
                    className="w-full py-2 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: '#6B8E23' }}
                  >
                    Post Notice
                  </button>
                </>
              )}
            </div>
          )}

          {noticeBoard.length === 0 ? (
            <p className="text-gray-400 italic text-sm">No notices yet.</p>
          ) : (
            <div className="space-y-3">
              {noticeBoard.map((notice) => (
                <div key={notice.id} className="glass-dark rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-sm">{notice.title}</h3>
                    {isAdminAuthenticated && (
                      <button onClick={() => deleteNotice(notice.id)} className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1" style={{ whiteSpace: 'pre-wrap' }}>{notice.body}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── NAV BUTTONS ── */}
      <button
        onClick={() => { navigate('/fullcalendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="w-full glass text-trail-brown py-3 rounded-2xl hover:bg-gray-200 transition flex items-center justify-center mb-4"
      >
        View Full Year Calendar <ChevronRight className="w-5 h-5 ml-2" />
      </button>
      <button
        onClick={() => { navigate('/completedhikes'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="w-full glass text-trail-brown py-3 rounded-2xl hover:bg-gray-200 transition flex items-center justify-center"
      >
        View Completed Hikes <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};

export default DashboardPage;
