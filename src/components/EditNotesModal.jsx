import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditNotesModal = ({ importantNotes, setIsEditingNotes, saveImportantNotes }) => {
  const [notes, setNotes] = useState([...importantNotes]);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (newNote) {
      setNotes([...notes, newNote]);
      setNewNote('');
    }
  };

  const handleRemoveNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Edit Important Notes</h3>
          <button onClick={() => setIsEditingNotes(false)} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-4 space-y-2">
          {notes.map((note, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm text-gray-700">{note}</span>
              <button onClick={() => handleRemoveNote(index)} className="text-red-600 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Add new note"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full px-4 py-2 glass rounded-2xl border-0 mb-2"
          />
          <button onClick={handleAddNote} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
            Add Note
          </button>
        </div>
        <button
          onClick={() => saveImportantNotes(notes)}
          className="w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
          style={{ backgroundColor: '#6B8E23' }}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Notes
        </button>
      </div>
    </div>
  );
};

export default EditNotesModal;
