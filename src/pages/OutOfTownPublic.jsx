import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const DIFFICULTY_COLORS = {
  'Friendly': 'bg-green-100 text-green-800',
  'Moderate': 'bg-yellow-100 text-yellow-800',
  "Let's Challenge Ourselves": 'bg-orange-100 text-orange-800',
};

const formatDateRange = (start, end) => {
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

const isDeadlinePassed = (deadline) => {
  if (!deadline) return false;
  return new Date(deadline + 'T00:00:00') < new Date();
};

const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Passed';
  if (diff === 0) return 'Today';
  return `${diff} day${diff === 1 ? '' : 's'}`;
};

const ConfirmationForm = ({ hike, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ name: '', phone: '', dietary: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim()) { alert('Name is required'); return; }
    if (!form.phone.trim()) { alert('Phone number is required'); return; }
    setSubmitting(true);
    const ok = await onSubmit({
      out_of_town_hike_id: hike.id,
      name: form.name.trim(),
      phone: form.phone.trim(),
      dietary: form.dietary.trim() || null,
    });
    if (ok) {
      alert(`Thanks! You're confirmed for ${hike.name}. Deposit details will be shared shortly.`);
      setForm({ name: '', phone: '', dietary: '' });
      onCancel();
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-4 space-y-3 border-t border-white/30 pt-4">
      <h3 className="font-semibold text-gray-800">Confirm Your Spot</h3>
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
      <input
        type="text"
        placeholder="Dietary requirements (optional — Vegetarian, allergies, etc.)"
        value={form.dietary}
        onChange={e => setForm(prev => ({ ...prev, dietary: e.target.value }))}
        className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none text-gray-800"
      />
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 py-3 rounded-2xl font-semibold text-white hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: '#6B8E23' }}
        >
          {submitting ? 'Confirming...' : "Confirm My Spot"}
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-2xl font-semibold text-gray-700 glass hover:bg-white/40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const OutOfTownPublic = ({ outOfTownHikes, outOfTownConfirmations, saveOutOfTownConfirmation }) => {
  const [confirmingId, setConfirmingId] = useState(null);

  const openHikes = (outOfTownHikes || []).filter(h => h.status === 'open');

  const getConfirmationCount = (hikeId) =>
    (outOfTownConfirmations || []).filter(c => c.out_of_town_hike_id === hikeId).length;

  return (
    <div className="max-w-2xl mx-auto pb-24 md:pb-0">
      <div className="glass rounded-3xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Out of Town Hikes</h1>
        <p className="text-sm text-gray-500">Multi-day getaways with the Sirimon crew</p>
      </div>

      {openHikes.length === 0 ? (
        <div className="glass rounded-3xl p-6 text-center">
          <p className="text-gray-500 italic">No out of town hikes open for confirmation right now.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {openHikes.map(hike => {
            const confirmCount = getConfirmationCount(hike.id);
            const capacity = parseInt(hike.max_capacity) || 0;
            const isFull = capacity > 0 && confirmCount >= capacity;
            const deadlinePassed = isDeadlinePassed(hike.confirmation_deadline);
            const daysLeft = getDaysUntilDeadline(hike.confirmation_deadline);
            const fillPercent = capacity > 0 ? Math.min(100, Math.round((confirmCount / capacity) * 100)) : 0;
            const isConfirming = confirmingId === hike.id;

            return (
              <div key={hike.id} className="glass rounded-3xl p-6">
                {/* Name + badge */}
                <div className="flex items-start gap-3 flex-wrap mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{hike.name}</h2>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white flex-shrink-0 mt-1"
                    style={{ backgroundColor: '#6B8E23' }}
                  >
                    Out of Town
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  {(hike.start_date || hike.end_date) && (
                    <p className="text-gray-700 font-semibold">
                      {formatDateRange(hike.start_date, hike.end_date)}
                    </p>
                  )}
                  {hike.location && (
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: '#6B8E23' }} />
                      {hike.location}
                    </div>
                  )}
                  {hike.difficulty && (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${DIFFICULTY_COLORS[hike.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                      {hike.difficulty}
                    </span>
                  )}
                </div>

                {/* Description */}
                {hike.description && (
                  <p className="text-gray-700 mb-4 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                    {hike.description}
                  </p>
                )}

                {/* Cost */}
                {hike.rough_cost && (
                  <div className="glass-dark rounded-2xl p-4 mb-4">
                    <p className="font-semibold text-gray-800">{hike.rough_cost}</p>
                    <p className="text-xs text-gray-500 italic mt-1">
                      Final cost shared once trip is confirmed
                    </p>
                  </div>
                )}

                {/* Deadline */}
                {hike.confirmation_deadline && (
                  <p className={`text-sm font-semibold mb-4 ${deadlinePassed ? 'text-red-500' : 'text-gray-600'}`}>
                    {deadlinePassed
                      ? 'Confirmations closed'
                      : `Confirmations close in ${daysLeft}`}
                  </p>
                )}

                {/* Spots + progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{confirmCount} of {capacity} spots confirmed</span>
                    <span>{fillPercent}% filled</span>
                  </div>
                  <div className="w-full bg-white/30 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${fillPercent}%`,
                        backgroundColor: isFull ? '#ef4444' : '#6B8E23',
                      }}
                    />
                  </div>
                </div>

                {/* CTA */}
                {hike.confirmations_open === false ? (
                  <div className="w-full py-3 rounded-2xl font-semibold text-center text-gray-500 glass-dark">
                    Confirmations Paused
                  </div>
                ) : isFull ? (
                  <div className="w-full py-3 rounded-2xl font-semibold text-center text-gray-500 glass-dark">
                    Trip is Full
                  </div>
                ) : deadlinePassed ? (
                  <div className="w-full py-3 rounded-2xl font-semibold text-center text-gray-500 glass-dark">
                    Deadline Passed
                  </div>
                ) : isConfirming ? (
                  <ConfirmationForm
                    hike={hike}
                    onSubmit={saveOutOfTownConfirmation}
                    onCancel={() => setConfirmingId(null)}
                  />
                ) : (
                  <button
                    onClick={() => setConfirmingId(hike.id)}
                    className="w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90"
                    style={{ backgroundColor: '#6B8E23' }}
                  >
                    Confirm I'm Coming
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OutOfTownPublic;
