import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Package, Plus, Pencil, Trash2, Save, Phone } from 'lucide-react';

const RESOURCE_TYPES = ['Bus Driver', 'Accommodation', 'Restaurant', 'Transport', 'Other'];

const EMPTY_RESOURCE = { type: 'Bus Driver', name: '', contact: '', notes: '' };

const ResourceForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...initial });

  const handleSave = () => {
    if (!form.type) { alert('Type is required'); return; }
    if (!form.name.trim()) { alert('Name is required'); return; }
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Type *</label>
        <select
          value={form.type}
          onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
        >
          {RESOURCE_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. Wanjiku Transport Co."
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Contact</label>
        <input
          type="text"
          value={form.contact}
          onChange={e => setForm(prev => ({ ...prev, contact: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="Phone, email, or both"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
          rows="3"
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder='e.g. "Order food 1hr in advance", "Used for Mt. Longonot March 2026"'
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

const TypeTag = ({ type }) => (
  <span
    className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold text-white mb-1"
    style={{ backgroundColor: '#6B8E23' }}
  >
    {type}
  </span>
);

const Resources = () => {
  const { hikeResources, saveHikeResource, deleteHikeResource } = useOutletContext();
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);

  const handleSave = async (resource) => {
    const ok = await saveHikeResource(resource);
    if (ok) setEditingId(null);
  };

  const filtered = activeFilter === 'All'
    ? hikeResources
    : hikeResources.filter(r => r.type === activeFilter);

  return (
    <div className="max-w-3xl space-y-4">
      {/* Header */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hike Resources</h1>
            <p className="text-sm text-gray-500 mt-0.5">Bus drivers, hotels, restaurants, and other resources</p>
          </div>
          {editingId !== 'new' && (
            <button
              onClick={() => setEditingId('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white hover:opacity-90 text-sm flex-shrink-0"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {['All', ...RESOURCE_TYPES].map(type => {
            const active = activeFilter === type;
            return (
              <button
                key={type}
                onClick={() => setActiveFilter(type)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
                style={active
                  ? { backgroundColor: '#6B8E23', color: '#fff' }
                  : undefined
                }
                {...(!active && { className: 'px-3 py-1.5 rounded-full text-xs font-semibold transition-colors glass-dark text-gray-600 hover:text-gray-900' })}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* New resource form */}
      {editingId === 'new' && (
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">New Resource</h2>
          <ResourceForm
            initial={EMPTY_RESOURCE}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && editingId !== 'new' && (
        <div className="glass rounded-3xl p-6 text-center">
          <Package className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 italic">
            {activeFilter === 'All' ? 'No resources added yet.' : `No ${activeFilter} resources yet.`}
          </p>
        </div>
      )}

      {/* Resource cards */}
      {filtered.map(resource => (
        <div key={resource.id} className="glass rounded-3xl p-6">
          {editingId === resource.id ? (
            <>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Editing</h2>
              <ResourceForm
                initial={resource}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
              />
            </>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <TypeTag type={resource.type} />
                <h2 className="text-lg font-bold text-gray-800">{resource.name}</h2>
                {resource.contact && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{resource.contact}</span>
                  </div>
                )}
                {resource.notes && (
                  <p className="text-sm text-gray-500 italic">{resource.notes}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditingId(resource.id)}
                  className="p-2 glass rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteHikeResource(resource.id)}
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

export default Resources;
