import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Gift, Plus, Pencil, Trash2, Save, ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react';

const EMPTY_PARTY = {
  year: new Date().getFullYear(),
  party_date: '',
  party_time: '',
  venue: '',
  dress_code: '',
  contribution: '',
  what_to_bring: '',
  instructions: '',
  writeup: '',
  recap: '',
  image_url: null,
  rsvp_deadline: '',
  is_visible: false,
  status: 'upcoming',
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

const getDaysUntilDeadline = (deadline) => {
  if (!deadline) return null;
  const diff = Math.ceil((new Date(deadline + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Deadline passed';
  if (diff === 0) return 'Deadline today';
  return `${diff} day${diff === 1 ? '' : 's'} left`;
};

const RsvpRow = ({ rsvp, onDelete }) => (
  <div className="flex items-center justify-between gap-4 py-1.5">
    <div className="space-y-0.5 min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-semibold text-gray-800">{rsvp.name}</p>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${rsvp.attending ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {rsvp.attending ? 'Yes' : 'No'}
        </span>
        {rsvp.attending && rsvp.guest_count > 0 && (
          <span className="text-xs text-gray-500">+{rsvp.guest_count} guest{rsvp.guest_count !== 1 ? 's' : ''}</span>
        )}
      </div>
      <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
        {rsvp.phone && <span>{rsvp.phone}</span>}
        {rsvp.dietary && <span>Dietary: {rsvp.dietary}</span>}
        {rsvp.bringing && <span>Bringing: {rsvp.bringing}</span>}
        {rsvp.rsvped_at && (
          <span>
            {new Date(rsvp.rsvped_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>
    <button
      onClick={() => onDelete(rsvp.id)}
      className="p-1.5 glass rounded-xl text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
      title="Remove RSVP"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);

const PartyForm = ({ initial, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...initial });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initial.image_url || null);
  const fileInputRef = useRef(null);

  const isCompleted = initial.status === 'completed';
  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setForm(prev => ({ ...prev, image_url: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    if (!form.year) { alert('Year is required'); return; }
    onSave(form, imageFile);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Year *</label>
        <input
          type="number"
          value={form.year || ''}
          onChange={set('year')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. 2026"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Write-up</label>
        <textarea
          value={form.writeup || ''}
          onChange={set('writeup')}
          rows="4"
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="Describe this year's party..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Party Date</label>
          <input
            type="date"
            value={form.party_date || ''}
            onChange={set('party_date')}
            className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Party Time</label>
          <input
            type="text"
            value={form.party_time || ''}
            onChange={set('party_time')}
            className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
            placeholder="e.g. 7:00 PM"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Venue</label>
        <input
          type="text"
          value={form.venue || ''}
          onChange={set('venue')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. Nairobi Serena Hotel"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Dress Code</label>
        <input
          type="text"
          value={form.dress_code || ''}
          onChange={set('dress_code')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. Smart Casual"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Contribution</label>
        <input
          type="text"
          value={form.contribution || ''}
          onChange={set('contribution')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="e.g. KES 2,000 per person"
        />
        <p className="text-xs text-gray-400 mt-1">Leave blank if no contribution needed</p>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">What to Bring</label>
        <textarea
          value={form.what_to_bring || ''}
          onChange={set('what_to_bring')}
          rows="3"
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="Items guests should bring..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">What You Need to Know</label>
        <textarea
          value={form.instructions || ''}
          onChange={set('instructions')}
          rows="3"
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="Any additional instructions..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">RSVP Deadline</label>
        <input
          type="date"
          value={form.rsvp_deadline || ''}
          onChange={set('rsvp_deadline')}
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_visible"
          checked={form.is_visible || false}
          onChange={e => setForm(prev => ({ ...prev, is_visible: e.target.checked }))}
          className="w-4 h-4 rounded"
        />
        <label htmlFor="is_visible" className="text-sm text-gray-700">Show on public /christmas page</label>
      </div>

      {isCompleted && (
        <>
          <div className="border-t border-white/20 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Post-Party</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Recap</label>
            <textarea
              value={form.recap || ''}
              onChange={set('recap')}
              rows="4"
              className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
              placeholder="How did the party go?"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Group Photo</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white/60 file:text-gray-700 hover:file:bg-white/80"
            />
            <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 5MB</p>
            {imagePreview && (
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-32 max-w-[200px] object-contain rounded-xl"
                />
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold mt-1"
                >
                  <X className="w-3 h-3" /> Remove image
                </button>
              </div>
            )}
          </div>
        </>
      )}

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

const ChristmasAdmin = () => {
  const {
    christmasParties,
    christmasRsvps,
    saveChristmasParty,
    markChristmasPartyCompleted,
    deleteChristmasParty,
    deleteChristmasRsvp,
  } = useOutletContext();

  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const getRsvpsForParty = (partyId) => christmasRsvps.filter(r => r.party_id === partyId);
  const getAttendingCount = (partyId) => christmasRsvps.filter(r => r.party_id === partyId && r.attending === true).length;
  const getDeclinedCount = (partyId) => christmasRsvps.filter(r => r.party_id === partyId && r.attending === false).length;
  const getTotalGuests = (partyId) => christmasRsvps
    .filter(r => r.party_id === partyId && r.attending === true)
    .reduce((sum, r) => sum + 1 + (r.guest_count || 0), 0);

  const handleSave = async (party, imageFile) => {
    const ok = await saveChristmasParty(party, imageFile);
    if (ok) setEditingId(null);
  };

  return (
    <div className="max-w-3xl space-y-4">
      {/* Header */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Christmas Party</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage yearly Christmas parties and RSVPs</p>
          </div>
          {editingId !== 'new' && (
            <button
              onClick={() => setEditingId('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-white hover:opacity-90 text-sm flex-shrink-0"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Plus className="w-4 h-4" />
              Add New Year's Party
            </button>
          )}
        </div>
      </div>

      {/* New party form */}
      {editingId === 'new' && (
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">New Christmas Party</h2>
          <PartyForm
            initial={EMPTY_PARTY}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* Empty state */}
      {christmasParties.length === 0 && editingId !== 'new' && (
        <div className="glass rounded-3xl p-6 text-center">
          <Gift className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 italic">No Christmas parties added yet.</p>
        </div>
      )}

      {/* Party cards */}
      {christmasParties.map(party => {
        const attendingCount = getAttendingCount(party.id);
        const declinedCount = getDeclinedCount(party.id);
        const totalGuests = getTotalGuests(party.id);
        const rsvps = getRsvpsForParty(party.id);
        const daysLeft = getDaysUntilDeadline(party.rsvp_deadline);
        const isExpanded = expandedId === party.id;
        const isUpcoming = party.status !== 'completed';
        const attending = rsvps.filter(r => r.attending === true);
        const declined = rsvps.filter(r => r.attending === false);

        return (
          <div key={party.id} className="glass rounded-3xl p-6">
            {editingId === party.id ? (
              <>
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Editing {party.year}</h2>
                <PartyForm
                  initial={party}
                  onSave={handleSave}
                  onCancel={() => setEditingId(null)}
                />
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-2xl font-bold text-gray-800">{party.year}</h2>
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: isUpcoming ? '#6B8E23' : '#3B82F6' }}
                      >
                        {isUpcoming ? 'Upcoming' : 'Completed'}
                      </span>
                      {isUpcoming && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${party.is_visible ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                          {party.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      )}
                    </div>

                    {(party.party_date || party.party_time || party.venue) && (
                      <p className="text-sm text-gray-600">
                        {[party.party_date ? formatDate(party.party_date) : null, party.party_time, party.venue]
                          .filter(Boolean).join(' · ')}
                      </p>
                    )}

                    {party.dress_code && (
                      <p className="text-sm text-gray-600">Dress: {party.dress_code}</p>
                    )}

                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">RSVPs:</span>{' '}
                      {attendingCount} attending
                      {declinedCount > 0 && `, ${declinedCount} declined`}
                      {totalGuests > 0 && `, ${totalGuests} total guests`}
                    </p>

                    {isUpcoming && daysLeft && (
                      <p className={`text-xs font-semibold ${daysLeft === 'Deadline passed' ? 'text-red-500' : 'text-gray-500'}`}>
                        RSVP Deadline: {daysLeft}
                      </p>
                    )}

                    {isUpcoming && (
                      <label className="flex items-center gap-2 cursor-pointer mt-1">
                        <input
                          type="checkbox"
                          checked={party.is_visible || false}
                          onChange={() => saveChristmasParty({ ...party, is_visible: !party.is_visible }, null)}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-sm text-gray-600">Show on public /christmas page</span>
                      </label>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0 items-end">
                    {isUpcoming && (
                      <button
                        onClick={() => markChristmasPartyCompleted(party.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white hover:opacity-90"
                        style={{ backgroundColor: '#6B8E23' }}
                        title="Mark as Completed"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark Completed
                      </button>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingId(party.id)}
                        className="p-2 glass rounded-xl text-gray-500 hover:text-gray-800 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteChristmasParty(party.id)}
                        className="p-2 glass rounded-xl text-red-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {party.image_url && (
                  <img
                    src={party.image_url}
                    alt={`Christmas ${party.year}`}
                    className="mt-3 w-full max-h-48 object-cover rounded-2xl"
                  />
                )}

                {party.recap && (
                  <p className="mt-3 text-sm text-gray-600 italic border-t border-white/20 pt-3">{party.recap}</p>
                )}

                <button
                  onClick={() => setExpandedId(isExpanded ? null : party.id)}
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  View RSVPs ({rsvps.length})
                </button>

                {isExpanded && (
                  <div className="mt-3 border-t border-white/30 pt-3">
                    {rsvps.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No RSVPs yet.</p>
                    ) : (
                      <>
                        {attending.length > 0 && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2">Attending ({attending.length})</p>
                            <div className="space-y-1">
                              {attending.map(rsvp => (
                                <RsvpRow key={rsvp.id} rsvp={rsvp} onDelete={deleteChristmasRsvp} />
                              ))}
                            </div>
                          </div>
                        )}
                        {declined.length > 0 && (
                          <div className={attending.length > 0 ? 'mt-3 pt-3 border-t border-white/20' : ''}>
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Declined ({declined.length})</p>
                            <div className="space-y-1">
                              {declined.map(rsvp => (
                                <RsvpRow key={rsvp.id} rsvp={rsvp} onDelete={deleteChristmasRsvp} />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
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

export default ChristmasAdmin;
