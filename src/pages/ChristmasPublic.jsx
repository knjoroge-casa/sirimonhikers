import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';

const PARTY_RED = '#c0392b';
const OLIVE_DEEP = '#4a6015';
const OLIVE_TINT = '#f5f7ee';

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/70 text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4a6015] focus:border-[#4a6015]';

const formatDateLong = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric',
  });
};

const formatDateShort = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
};

const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline + 'T00:00:00') < new Date();
};

const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return 'Today';
  return `${diff} day${diff === 1 ? '' : 's'}`;
};

const RsvpForm = ({ party, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    attending: null,
    guest_count: 0,
    dietary: '',
    bringing: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) { alert('Name is required'); return; }
    if (!form.phone.trim()) { alert('Phone number is required'); return; }
    if (form.attending === null) { alert("Please select whether you're coming"); return; }

    setSubmitting(true);
    const ok = await onSubmit({
      party_id: party.id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      attending: form.attending,
      guest_count: form.attending ? (parseInt(form.guest_count) || 0) : 0,
      dietary: form.attending ? (form.dietary.trim() || null) : null,
      bringing: form.attending ? (form.bringing.trim() || null) : null,
    });
    if (ok) {
      alert('Thanks for your RSVP!');
      setForm({ name: '', phone: '', attending: null, guest_count: 0, dietary: '', bringing: '' });
    }
    setSubmitting(false);
  };

  return (
    <div>
      {/* Yes / No pill cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { value: true, label: "Yes, I'll Be There", emoji: '🎉' },
          { value: false, label: "No, I Can't Make It", emoji: null },
        ].map(({ value, label, emoji }) => {
          const selected = form.attending === value;
          return (
            <button
              key={String(value)}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, attending: value }))}
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl py-4 px-3 font-semibold text-sm"
              style={{
                minHeight: '64px',
                border: `2px solid ${selected ? OLIVE_DEEP : '#d1d5db'}`,
                backgroundColor: selected ? OLIVE_TINT : 'rgba(255,255,255,0.6)',
                color: selected ? OLIVE_DEEP : '#6b7280',
              }}
            >
              {emoji && <span className="text-xl leading-none">{emoji}</span>}
              <span className="text-center leading-tight">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Name */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Your Name *</label>
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          className={INPUT_CLASS}
        />
      </div>

      {/* Phone */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number *</label>
        <input
          type="tel"
          placeholder="07xx xxx xxx"
          value={form.phone}
          onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
          className={INPUT_CLASS}
        />
      </div>

      {/* Yes-only fields — smooth reveal */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: form.attending === true ? '400px' : '0px',
          opacity: form.attending === true ? 1 : 0,
          pointerEvents: form.attending === true ? 'auto' : 'none',
          marginTop: form.attending === true ? '16px' : '0px',
          transition: 'max-height 300ms cubic-bezier(0.4,0,0.2,1), opacity 250ms cubic-bezier(0.4,0,0.2,1), margin-top 300ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              How Many Guests Are You Bringing?
            </label>
            <input
              type="number"
              min="0"
              value={form.guest_count}
              onChange={e => setForm(prev => ({ ...prev, guest_count: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Dietary Requirements{' '}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              placeholder="Vegetarian, allergies, etc."
              value={form.dietary}
              onChange={e => setForm(prev => ({ ...prev, dietary: e.target.value }))}
              rows="2"
              className={INPUT_CLASS}
              style={{ resize: 'none' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              What Are You Bringing?{' '}
              <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="Drinks, snacks, good vibes..."
              value={form.bringing}
              onChange={e => setForm(prev => ({ ...prev, bringing: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3 rounded-2xl font-bold text-white disabled:opacity-60 mt-4"
        style={{ backgroundColor: OLIVE_DEEP }}
      >
        {submitting ? 'Submitting...' : 'Submit RSVP'}
      </button>
    </div>
  );
};

const ChristmasPublic = ({ christmasParties, christmasRsvps, saveChristmasRsvp }) => {
  const currentParty = (christmasParties || []).find(
    p => p.status === 'upcoming' && p.is_visible === true
  );
  const pastParties = (christmasParties || []).filter(p => p.status === 'completed');

  const deadlinePassed = currentParty ? isDeadlinePassed(currentParty.rsvp_deadline) : false;
  const daysLeft = currentParty ? getDaysUntilDeadline(currentParty.rsvp_deadline) : null;

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-0">
      <div className="mb-4">
        <Link to="/" className="text-white/90 hover:text-white font-semibold flex items-center">
          ← Back to Dashboard
        </Link>
      </div>

      {currentParty ? (
        <div className="glass rounded-3xl p-6 mb-6">

          {/* HERO */}
          <div className="flex items-center gap-2 mb-2">
            <Gift className="w-6 h-6 flex-shrink-0" style={{ color: PARTY_RED }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: PARTY_RED }}>
              This Year's Christmas Party
            </p>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <h1 className="text-3xl font-bold text-gray-800">{currentParty.year}</h1>
            <span className="text-2xl" role="img" aria-hidden="true">🎄</span>
          </div>

          {/* WRITE-UP */}
          {currentParty.writeup && (
            <p
              className="text-gray-700 leading-relaxed mb-6"
              style={{ fontSize: '18px', lineHeight: '1.75', whiteSpace: 'pre-wrap' }}
            >
              {currentParty.writeup}
            </p>
          )}

          {/* LOGISTICS GRID */}
          {(currentParty.party_date || currentParty.party_time || currentParty.venue ||
            currentParty.dress_code || currentParty.contribution || currentParty.what_to_bring) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {(currentParty.party_date || currentParty.party_time) && (
                <div className="glass-dark rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                    📅 Date &amp; Time
                  </p>
                  <p className="text-base text-gray-700">
                    {[
                      currentParty.party_date ? formatDateLong(currentParty.party_date) : null,
                      currentParty.party_time,
                    ].filter(Boolean).join(' · ')}
                  </p>
                </div>
              )}
              {currentParty.venue && (
                <div className="glass-dark rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">📍 Venue</p>
                  <p className="text-base text-gray-700">{currentParty.venue}</p>
                </div>
              )}
              {currentParty.dress_code && (
                <div className="glass-dark rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">👗 Dress Code</p>
                  <p className="text-base text-gray-700">{currentParty.dress_code}</p>
                </div>
              )}
              {currentParty.contribution && (
                <div className="glass-dark rounded-2xl p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">💰 Contribution</p>
                  <p className="text-base font-semibold text-gray-800">{currentParty.contribution}</p>
                </div>
              )}
              {currentParty.what_to_bring && (
                <div className="glass-dark rounded-2xl p-4 md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">🎁 What to Bring</p>
                  <p className="text-base text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
                    {currentParty.what_to_bring}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* WHAT YOU NEED TO KNOW */}
          {currentParty.instructions && (
            <div className="glass-dark rounded-2xl p-4 mb-5">
              <p className="text-xl font-bold text-gray-800 mb-2">What You Need to Know</p>
              <p className="text-base text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {currentParty.instructions}
              </p>
            </div>
          )}

          {/* RSVP DEADLINE COUNTDOWN */}
          {currentParty.rsvp_deadline && !deadlinePassed && daysLeft && (
            <div className="rounded-2xl px-4 py-3 mb-5" style={{ backgroundColor: OLIVE_TINT }}>
              <p className="font-mono text-sm font-semibold" style={{ color: OLIVE_DEEP }}>
                {daysLeft === 'Today' ? 'RSVPs Close Today' : `RSVPs Close In ${daysLeft}`}
              </p>
            </div>
          )}

          {/* RSVP SECTION */}
          <div className="border-t border-white/30 pt-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Are You Coming?</h2>
            {deadlinePassed ? (
              <div className="glass-dark rounded-2xl p-4">
                <p className="font-bold mb-1" style={{ color: '#ef4444' }}>RSVPs Are Closed.</p>
                <p className="text-sm text-gray-600">
                  Reach out to your Sirimon Host if you still want to come.
                </p>
              </div>
            ) : (
              <RsvpForm party={currentParty} onSubmit={saveChristmasRsvp} />
            )}
          </div>
        </div>
      ) : (
        /* FUN EMPTY STATE */
        <div className="glass rounded-3xl p-8 text-center mb-6">
          <p className="text-5xl mb-4" role="img" aria-label="Christmas tree">🎄</p>
          <p className="text-3xl font-bold text-gray-800 leading-snug">
            It's not yet Christmas (but it can always be Christmas in your hearts)! Come back later!
          </p>
        </div>
      )}

      {/* PAST PARTIES ARCHIVE */}
      {pastParties.length > 0 && (
        <>
          <div className="glass rounded-3xl p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Past Christmas Parties 🎄</h2>
          </div>
          <div className="space-y-4">
            {pastParties.map(party => (
              <div
                key={party.id}
                className="glass rounded-3xl p-6"
                style={{ borderLeft: `4px solid ${PARTY_RED}` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Gift className="w-4 h-4 flex-shrink-0" style={{ color: PARTY_RED }} />
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: PARTY_RED }}>
                    Christmas Party
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{party.year}</h3>
                {(party.party_date || party.venue) && (
                  <p className="text-sm text-gray-600 mb-3">
                    {[
                      party.party_date ? formatDateShort(party.party_date) : null,
                      party.venue,
                    ].filter(Boolean).join(' · ')}
                  </p>
                )}
                {party.image_url && (
                  <img
                    src={party.image_url}
                    alt={`Christmas ${party.year} group photo`}
                    className="w-full max-h-72 object-contain rounded-2xl mb-3 mx-auto block"
                  />
                )}
                {party.recap && (
                  <p className="text-base text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                    {party.recap}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ChristmasPublic;
