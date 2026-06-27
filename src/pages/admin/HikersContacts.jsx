import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Plus, Pencil, Trash2, Save, Phone, Mail, Search } from 'lucide-react';

const EMPTY_CONTACT = { name: '', phone: '', email: '', birthday: '', notes: '' };

const getHikeCount = (phone, registrations) => {
  if (!phone || !registrations) return 0;
  const contactDigits = phone.replace(/\D/g, '');
  const last6 = contactDigits.slice(-6);
  if (last6.length < 6) return 0;
  return registrations.filter(reg => {
    const regDigits = (reg.phone || '').replace(/\D/g, '');
    return regDigits.slice(-6) === last6;
  }).length;
};

const ContactForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...initial });

  const handleSave = () => {
    if (!form.name.trim()) { alert('Name is required'); return; }
    if (!form.phone.trim()) { alert('Phone is required'); return; }
    onSave(form);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
            placeholder="e.g. Jane Njoroge"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Phone *</label>
          <input
            type="text"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
            placeholder="e.g. 0712 345 678"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. jane@email.com"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Birthday (optional)</label>
        <input
          type="date"
          value={form.birthday || ''}
          onChange={e => setForm(prev => ({ ...prev, birthday: e.target.value }))}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Notes</label>
        <textarea
          value={form.notes}
          onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
          rows="2"
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

const HikersContacts = () => {
  const { hikersContacts, allRegistrations, saveHikerContact, deleteHikerContact } = useOutletContext();
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');

  const handleSave = async (contact) => {
    const ok = await saveHikerContact(contact);
    if (ok) setEditingId(null);
  };

  const filtered = hikersContacts.filter(c => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const phoneMatch = c.phone?.replace(/\D/g, '').includes(search.replace(/\D/g, ''));
    return nameMatch || phoneMatch;
  });

  return (
    <div className="max-w-3xl space-y-4">
      {/* Header */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hikers Contact List</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Master list of all hikers
              {hikersContacts.length > 0 && (
                <span className="ml-2 text-gray-400">· {hikersContacts.length} in directory</span>
              )}
            </p>
          </div>
          {editingId !== 'new' && (
            <button
              onClick={() => setEditingId('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white hover:opacity-90 text-sm flex-shrink-0"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Plus className="w-4 h-4" />
              Add Hiker
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 glass-dark rounded-2xl border-0 text-gray-800 text-sm"
          />
        </div>
      </div>

      {/* New contact form */}
      {editingId === 'new' && (
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">New Contact</h2>
          <ContactForm
            initial={EMPTY_CONTACT}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && editingId !== 'new' && (
        <div className="glass rounded-3xl p-6 text-center">
          <Users className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 italic">
            {search.trim() ? 'No hikers match your search.' : 'No contacts added yet.'}
          </p>
        </div>
      )}

      {/* Contact cards */}
      {filtered.map(contact => {
        const hikeCount = getHikeCount(contact.phone, allRegistrations);
        return (
          <div key={contact.id} className="glass rounded-3xl p-6">
            {editingId === contact.id ? (
              <>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Editing</h2>
                <ContactForm
                  initial={contact}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              </>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-800">{contact.name}</h2>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white flex-shrink-0"
                      style={{ backgroundColor: '#6B8E23' }}
                    >
                      {hikeCount} {hikeCount === 1 ? 'hike' : 'hikes'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span>{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <span>{contact.email}</span>
                    </div>
                  )}
                  {contact.birthday && (
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Birthday:</span>{' '}
                      {new Date(contact.birthday + 'T00:00:00').toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                      })}
                    </p>
                  )}
                  {contact.notes && (
                    <p className="text-sm text-gray-500 italic">{contact.notes}</p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setEditingId(contact.id)}
                    className="p-2 glass rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHikerContact(contact.id)}
                    className="p-2 glass rounded-xl text-red-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HikersContacts;
