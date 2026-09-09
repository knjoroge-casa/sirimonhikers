import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Save, Trash2, Plus, X } from 'lucide-react';

const EditDashboard = () => {
  const { dashboardIntro, saveDashboardIntro, noticeBoard, saveNotice, deleteNotice } = useOutletContext();

  const [introText, setIntroText] = useState(dashboardIntro || '');
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleSaveIntro = () => saveDashboardIntro(introText);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setNewImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddNotice = async () => {
    if (!newTitle || !newBody) return;
    await saveNotice(newTitle, newBody, newImage);
    setNewTitle('');
    setNewBody('');
    handleRemoveImage();
  };

  const noticeCount = noticeBoard?.length ?? 0;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Dashboard Intro</h2>
        <textarea
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
          rows="4"
          className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800"
          placeholder="Enter dashboard intro text..."
        />
        <button
          onClick={handleSaveIntro}
          className="mt-4 w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
          style={{ backgroundColor: '#6B8E23' }}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Intro
        </button>
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Notice Board</h2>

        {noticeCount > 0 ? (
          <div className="space-y-3 mb-6">
            {noticeBoard.map((notice) => (
              <div key={notice.id} className="glass-dark rounded-2xl p-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{notice.title}</p>
                  {notice.image_url && (
                    <img
                      src={notice.image_url}
                      alt={notice.title}
                      className="my-2 max-w-full max-h-40 object-contain rounded-xl"
                    />
                  )}
                  <p className="text-gray-600 text-sm mt-1">{notice.body}</p>
                </div>
                <button
                  onClick={() => deleteNotice(notice.id)}
                  className="flex-shrink-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm mb-6">No notices posted.</p>
        )}

        {noticeCount < 3 ? (
          <div className="border-t border-white/20 pt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
              Add Notice ({noticeCount}/3)
            </p>
            <input
              type="text"
              placeholder="Notice title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800 mb-3"
            />
            <textarea
              placeholder="Notice message"
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800 mb-3"
            />
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">Image (optional)</p>
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
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={handleAddNotice}
              className="w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
              style={{ backgroundColor: '#6B8E23' }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Notice
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic border-t border-white/20 pt-4">
            Maximum 3 notices reached. Delete one to add another.
          </p>
        )}
      </div>
    </div>
  );
};

export default EditDashboard;
