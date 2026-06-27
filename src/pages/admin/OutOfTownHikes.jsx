import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Map, Plus, Pencil, Trash2, Save, ChevronDown, ChevronUp } from 'lucide-react';

const DIFFICULTY_OPTIONS = ['Friendly', 'Moderate', "Let's Challenge Ourselves"];

const EMPTY_HIKE = {
  name: '',
  start_date: '',
  end_date: '',
  location: '',
  rough_cost: '',
  difficulty: 'Friendly',
  description: '',
  max_capacity: '',
  confirmation_deadline: '',
  status: 'open',
  show_on_dashboard: true,
};

const STATUS_STYLES = {
  open: 'bg-green-500',
  closed: 'bg-gray-400',
  completed: 'bg-blue-500',
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

const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Deadline passed';
  if (diff === 0) return 'Deadline today';
  return `${diff} day${diff === 1 ? '' : 's'} left`;
};

const HikeForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...initial });

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    if (!form.name.trim()) { alert('Name is required'); return; }
    if (!form.start_date) { alert('Start date is required'); return; }
    if (!form.end_date) { alert('End date is required'); return; }
    if (!form.max_capacity) { alert('Max capacity is required'); return; }
    if (!form.confirmation_deadline) { alert('Confirmation deadline is required'); return; }
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={set('name')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. Maasai Mara Getaway"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Start Date *</label>
          <input
            type="date"
            value={form.start_date}
            onChange={set('start_date')}
            className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">End Date *</label>
          <input
            type="date"
            value={form.end_date}
            onChange={set('end_date')}
            className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Location</label>
        <input
          type="text"
          value={form.location}
          onChange={set('location')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. Amboseli National Park"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Rough Cost</label>
        <input
          type="text"
          value={form.rough_cost}
          onChange={set('rough_cost')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. KES 10,000 per person"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Difficulty</label>
        <select
          value={form.difficulty}
          onChange={set('difficulty')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
        >
          {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          rows="3"
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="What's this getaway about?"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Max Capacity *</label>
          <input
            type="number"
            min="1"
            value={form.max_capacity}
            onChange={set('max_capacity')}
            className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
            placeholder="e.g. 20"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Confirmation Deadline *</label>
          <input
            type="date"
            value={form.confirmation_deadline}
            onChange={set('confirmation_deadline')}
            className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Status</label>
        <select
          value={form.status}
          onChange={set('status')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="show_on_dashboard"
          checked={form.show_on_dashboard !== false}
          onChange={e => setForm(prev => ({ ...prev, show_on_dashboard: e.target.checked }))}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="show_on_dashboard" className="text-sm text-gray-700">Show on Dashboard</label>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={handleSave}
          className="flex-1 py-2.5 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#6B8E23' }}
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-2xl font-semibold text-gray-700 glass hover:bg-white/40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const OutOfTownHikes = () => {
  const {
    outOfTownHikes,
    outOfTownConfirmations,
    saveOutOfTownHike,
    deleteOutOfTownHike,
    deleteOutOfTownConfirmation,
  } = useOutletContext();

  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const getConfirmationCount = (hikeId) =>
    outOfTownConfirmations.filter(c => c.hike_id === hikeId).length;

  const handleSave = async (hike) => {
    const ok = await saveOutOfTownHike(hike);
    if (ok) setEditingId(null);
  };

  return (
    <div className="max-w-3xl space-y-4">
      {/* Header */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Out of Town Hikes</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage multi-day getaway hikes</p>
          </div>
          {editingId !== 'new' && (
            <button
              onClick={() => setEditingId('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white hover:opacity-90 text-sm flex-shrink-0"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Plus className="w-4 h-4" />
              Add Out of Town Hike
            </button>
          )}
        </div>
      </div>

      {/* New hike form */}
      {editingId === 'new' && (
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">New Out of Town Hike</h2>
          <HikeForm
            initial={EMPTY_HIKE}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Empty state */}
      {outOfTownHikes.length === 0 && editingId !== 'new' && (
        <div className="glass rounded-3xl p-6 text-center">
          <Map className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 italic">No out of town hikes added yet.</p>
        </div>
      )}

      {/* Hike cards */}
      {outOfTownHikes.map(hike => {
        const confirmCount = getConfirmationCount(hike.id);
        const daysLeft = getDaysUntilDeadline(hike.confirmation_deadline);
        const confirmations = outOfTownConfirmations.filter(c => c.hike_id === hike.id);
        const isExpanded = expandedId === hike.id;

        return (
          <div key={hike.id} className="glass rounded-3xl p-6">
            {editingId === hike.id ? (
              <>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Editing</h2>
                <HikeForm
                  initial={hike}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-gray-800">{hike.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold text-white flex-shrink-0 ${STATUS_STYLES[hike.status] || 'bg-gray-400'}`}>
                        {hike.status.charAt(0).toUpperCase() + hike.status.slice(1)}
                      </span>
                    </div>
                    {(hike.start_date || hike.end_date) && (
                      <p className="text-sm text-gray-600">{formatDateRange(hike.start_date, hike.end_date)}</p>
                    )}
                    {hike.location && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Location:</span> {hike.location}
                      </p>
                    )}
                    {hike.rough_cost && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Cost:</span> {hike.rough_cost}
                      </p>
                    )}
                    {hike.difficulty && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Difficulty:</span> {hike.difficulty}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Capacity:</span> {confirmCount} / {hike.max_capacity} confirmed
                    </p>
                    {daysLeft && (
                      <p className={`text-xs font-semibold ${daysLeft === 'Deadline passed' ? 'text-red-500' : 'text-gray-500'}`}>
                        Deadline: {daysLeft}
                      </p>
                    )}
                    {hike.status === 'open' && (
                      <p className="text-xs text-gray-400">
                        {hike.show_on_dashboard ? '✓ Showing on dashboard' : '✗ Hidden from dashboard'}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditingId(hike.id)}
                      className="p-2 glass rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteOutOfTownHike(hike.id)}
                      className="p-2 glass rounded-xl text-red-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Confirmations toggle */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : hike.id)}
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  View Confirmations ({confirmCount})
                </button>

                {isExpanded && (
                  <div className="mt-3 border-t border-white/30 pt-3 space-y-2">
                    {confirmations.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No confirmations yet.</p>
                    ) : (
                      confirmations.map(conf => (
                        <div key={conf.id} className="flex items-center justify-between gap-4 py-1">
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-sm font-semibold text-gray-800">{conf.name}</p>
                            <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
                              {conf.phone && <span>{conf.phone}</span>}
                              {conf.dietary && <span>Dietary: {conf.dietary}</span>}
                              {conf.confirmed_at && (
                                <span>
                                  {new Date(conf.confirmed_at).toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'short', year: 'numeric',
                                  })}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteOutOfTownConfirmation(conf.id)}
                            className="p-1.5 glass rounded-xl text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                            title="Remove confirmation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OutOfTownHikes;
