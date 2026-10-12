import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift } from 'lucide-react';

const formatDate = (dateString) => {
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
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Your Name *"
        value={form.name}
        onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
        className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none text-gray-800"
      />
      <input
        type="tel"
        placeholder="Phone Number *"
        value={form.phone}
        onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
        className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none text-gray-800"
      />

      <div>
        <p className="text-sm font-semibold text-gray-700 mb-2">Are you coming?</p>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={`attending_${party.id}`}
              checked={form.attending === true}
              onChange={() => setForm(prev => ({ ...prev, attending: true }))}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Yes, I'll be there 🎉</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={`attending_${party.id}`}
              checked={form.attending === false}
              onChange={() => setForm(prev => ({ ...prev, attending: false }))}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">No, I can't make it</span>
          </label>
        </div>
      </div>

      {form.attending === true && (
        <>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              How many guests are you bringing?
            </label>
            <input
              type="number"
              min="0"
              value={form.guest_count}
              onChange={e => setForm(prev => ({ ...prev, guest_count: e.target.value }))}
              className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none text-gray-800"
            />
          </div>
          <textarea
            placeholder="Dietary requirements (optional)"
            value={form.dietary}
            onChange={e => setForm(prev => ({ ...prev, dietary: e.target.value }))}
            rows="2"
            className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none text-gray-800"
          />
          <input
            type="text"
            placeholder="What are you bringing? (optional)"
            value={form.bringing}
            onChange={e => setForm(prev => ({ ...prev, bringing: e.target.value }))}
            className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none text-gray-800"
          />
        </>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90 disabled:opacity-60"
        style={{ backgroundColor: '#6B8E23' }}
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
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-4 h-4 flex-shrink-0" style={{ color: '#C0392B' }} />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#C0392B' }}>
              This Year's Christmas Party
            </p>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{currentParty.year}</h1>

          {currentParty.writeup && (
            <p className="text-gray-700 leading-relaxed mb-5" style={{ whiteSpace: 'pre-wrap' }}>
              {currentParty.writeup}
            </p>
          )}

          <div className="space-y-2 mb-5">
            {(currentParty.party_date || currentParty.party_time) && (
              <p className="text-gray-700 font-semibold">
                {[currentParty.party_date ? formatDate(currentParty.party_date) : null, currentParty.party_time]
                  .filter(Boolean).join(' · ')}
              </p>
            )}
            {currentParty.venue && (
              <p className="text-gray-700">📍 {currentParty.venue}</p>
            )}
            {currentParty.dress_code && (
              <p className="text-gray-700">👗 Dress code: {currentParty.dress_code}</p>
            )}
          </div>

          {currentParty.contribution && (
            <div className="glass-dark rounded-2xl p-4 mb-5">
              <p className="font-semibold text-gray-800">{currentParty.contribution}</p>
            </div>
          )}

          {currentParty.what_to_bring && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">What to Bring</p>
              <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {currentParty.what_to_bring}
              </p>
            </div>
          )}

          {currentParty.instructions && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">What You Need to Know</p>
              <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {currentParty.instructions}
              </p>
            </div>
          )}

          {currentParty.rsvp_deadline && (
            <p className={`text-sm font-semibold mb-5 ${deadlinePassed ? 'text-red-500' : 'text-gray-600'}`}>
              {deadlinePassed
                ? 'RSVPs closed'
                : `RSVP by ${formatDate(currentParty.rsvp_deadline)}${daysLeft ? ` · ${daysLeft} left` : ''}`}
            </p>
          )}

          <div className="border-t border-white/30 pt-5">
            <h2 className="text-lg font-bold text-gray-800 mb-4">RSVP</h2>
            {deadlinePassed ? (
              <p className="text-gray-500 italic">
                RSVPs are closed. Contact your host if you still want to come.
              </p>
            ) : (
              <RsvpForm party={currentParty} onSubmit={saveChristmasRsvp} />
            )}
          </div>
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 text-center mb-6">
          <p className="text-4xl mb-4">🎄</p>
          <p className="text-gray-600 italic leading-relaxed">
            It's not yet Christmas (but it can always be Christmas in your hearts)! Come back later!
          </p>
        </div>
      )}

      {pastParties.length > 0 && (
        <>
          <div className="glass rounded-3xl p-6 mb-4">
            <h2 className="text-xl font-bold text-gray-800">Past Christmas Parties</h2>
          </div>
          <div className="space-y-4">
            {pastParties.map(party => (
              <div key={party.id} className="glass rounded-3xl p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{party.year}</h3>
                {(party.party_date || party.venue) && (
                  <p className="text-sm text-gray-600 mb-3">
                    {[party.party_date ? formatDate(party.party_date) : null, party.venue]
                      .filter(Boolean).join(' · ')}
                  </p>
                )}
                {party.image_url && (
                  <img
                    src={party.image_url}
                    alt={`Christmas ${party.year} group photo`}
                    className="w-full max-h-72 object-contain rounded-2xl mb-3"
                  />
                )}
                {party.recap && (
                  <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
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
