import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Compass, Plus, Pencil, Trash2, X, Save, Phone } from 'lucide-react';

const EMPTY_GUIDE = { name: '', phone: '', area: [''], rates: '', notes: '' };

const GuideForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState({
    ...initial,
    area: initial.area?.length ? [...initial.area] : [''],
  });

  const updateArea = (i, value) => {
    setForm(prev => ({
      ...prev,
      area: prev.area.map((a, idx) => idx === i ? value : a),
    }));
  };

  const addArea = () => setForm(prev => ({ ...prev, area: [...prev.area, ''] }));

  const removeArea = (i) => setForm(prev => ({
    ...prev,
    area: prev.area.filter((_, idx) => idx !== i),
  }));

  const handleSave = () => {
    if (!form.name.trim()) { alert('Guide name is required'); return; }
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. James Mwangi"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Phone</label>
        <input
          type="text"
          value={form.phone}
          onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. 0712 345 678"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Areas</label>
        <div className="space-y-2">
          {form.area.map((a, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={a}
                onChange={e => updateArea(i, e.target.value)}
                placeholder="e.g. Mt. Kenya"
                className="flex-1 px-3 py-2 glass-dark rounded-xl border-0 text-gray-800 text-sm"
              />
              {form.area.length > 1 && (
                <button onClick={() => removeArea(i)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addArea} className="mt-2 text-sm text-gray-600 hover:text-gray-800 underline">
          + Add area
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Rates</label>
        <input
          type="text"
          value={form.rates}
          onChange={e => setForm(prev => ({ ...prev, rates: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. KES 3,000/day"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
          rows="3"
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="Any additional notes..."
        />
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

const AreaTags = ({ area }) => {
  const areas = Array.isArray(area) ? area.filter(a => a && a.trim()) : [];
  if (!areas.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {areas.map((a, i) => (
        <span
          key={i}
          className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: '#6B8E23' }}
        >
          {a}
        </span>
      ))}
    </div>
  );
};

const Guides = () => {
  const { hikeGuides, saveHikeGuide, deleteHikeGuide } = useOutletContext();
  const [editingId, setEditingId] = useState(null);

  const handleSave = async (guide) => {
    const ok = await saveHikeGuide(guide);
    if (ok) setEditingId(null);
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hike Guides</h1>
            <p className="text-sm text-gray-500 mt-0.5">Directory of our hiking guides</p>
          </div>
          {editingId !== 'new' && (
            <button
              onClick={() => setEditingId('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white hover:opacity-90 text-sm flex-shrink-0"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Plus className="w-4 h-4" />
              Add Guide
            </button>
          )}
        </div>
      </div>

      {editingId === 'new' && (
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">New Guide</h2>
          <GuideForm
            initial={EMPTY_GUIDE}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {hikeGuides.length === 0 && editingId !== 'new' && (
        <div className="glass rounded-3xl p-6 text-center">
          <Compass className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 italic">No guides added yet.</p>
        </div>
      )}

      {hikeGuides.map(guide => (
        <div key={guide.id} className="glass rounded-3xl p-6">
          {editingId === guide.id ? (
            <>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Editing</h2>
              <GuideForm
                initial={guide}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
              />
            </>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <h2 className="text-lg font-bold text-gray-800">{guide.name}</h2>
                {guide.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{guide.phone}</span>
                  </div>
                )}
                <AreaTags area={guide.area} />
                {guide.rates && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Rates:</span> {guide.rates}
                  </p>
                )}
                {guide.notes && (
                  <p className="text-sm text-gray-500 italic">{guide.notes}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditingId(guide.id)}
                  className="p-2 glass rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteHikeGuide(guide.id)}
                  className="p-2 glass rounded-xl text-red-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Guides;
