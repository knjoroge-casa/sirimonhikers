import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Building2, Plus, Pencil, Trash2, X, Save, User, Phone } from 'lucide-react';

const EMPTY_CURATOR = { name: '', contacts: [{ name: '', phone: '' }], rates: '', notes: '' };

const CuratorForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState({
    ...initial,
    contacts: initial.contacts?.length ? initial.contacts.map(c => ({ ...c })) : [{ name: '', phone: '' }],
  });

  const updateContact = (i, field, value) => {
    setForm(prev => ({
      ...prev,
      contacts: prev.contacts.map((c, idx) => idx === i ? { ...c, [field]: value } : c),
    }));
  };

  const addContact = () => setForm(prev => ({
    ...prev,
    contacts: [...prev.contacts, { name: '', phone: '' }],
  }));

  const removeContact = (i) => setForm(prev => ({
    ...prev,
    contacts: prev.contacts.filter((_, idx) => idx !== i),
  }));

  const handleSave = () => {
    if (!form.name.trim()) { alert('Company name is required'); return; }
    const cleanedContacts = form.contacts.filter(c => c.name.trim() || c.phone.trim());
    onSave({ ...form, contacts: cleanedContacts });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Company Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. Trails & Co."
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Contacts</label>
        <div className="space-y-2">
          {form.contacts.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={c.name}
                onChange={e => updateContact(i, 'name', e.target.value)}
                placeholder="Contact name"
                className="flex-1 px-3 py-2 glass-dark rounded-xl border-0 text-gray-800 text-sm"
              />
              <input
                type="text"
                value={c.phone}
                onChange={e => updateContact(i, 'phone', e.target.value)}
                placeholder="Phone"
                className="flex-1 px-3 py-2 glass-dark rounded-xl border-0 text-gray-800 text-sm"
              />
              {form.contacts.length > 1 && (
                <button onClick={() => removeContact(i)} className="text-red-500 hover:text-red-700 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addContact} className="mt-2 text-sm text-gray-600 hover:text-gray-800 underline">
          + Add contact
        </button>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Rates</label>
        <input
          type="text"
          value={form.rates}
          onChange={e => setForm(prev => ({ ...prev, rates: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. KES 2,000/person"
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

const Companies = () => {
  const { hikeCurators, saveHikeCurator, deleteHikeCurator } = useOutletContext();
  const [editingId, setEditingId] = useState(null);

  const handleSave = async (curator) => {
    const ok = await saveHikeCurator(curator);
    if (ok) setEditingId(null);
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hike Curators</h1>
            <p className="text-sm text-gray-500 mt-0.5">Companies that curate our hikes</p>
          </div>
          {editingId !== 'new' && (
            <button
              onClick={() => setEditingId('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white hover:opacity-90 text-sm flex-shrink-0"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Plus className="w-4 h-4" />
              Add Curator
            </button>
          )}
        </div>
      </div>

      {editingId === 'new' && (
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">New Curator</h2>
          <CuratorForm
            initial={EMPTY_CURATOR}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {hikeCurators.length === 0 && editingId !== 'new' && (
        <div className="glass rounded-3xl p-6 text-center">
          <Building2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 italic">No curators added yet.</p>
        </div>
      )}

      {hikeCurators.map(curator => (
        <div key={curator.id} className="glass rounded-3xl p-6">
          {editingId === curator.id ? (
            <>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Editing</h2>
              <CuratorForm
                initial={curator}
                onSave={handleSave}
                onCancel={() => setEditingId(null)}
              />
            </>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <h2 className="text-lg font-bold text-gray-800">{curator.name}</h2>
                {curator.contacts?.length > 0 && (
                  <div className="space-y-1">
                    {curator.contacts.map((c, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
                        <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{c.name}</span>
                        {c.phone && (
                          <>
                            <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                            <span>{c.phone}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {curator.rates && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Rates:</span> {curator.rates}
                  </p>
                )}
                {curator.notes && (
                  <p className="text-sm text-gray-500 italic">{curator.notes}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditingId(curator.id)}
                  className="p-2 glass rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteHikeCurator(curator.id)}
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

export default Companies;
