import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Save, Trash2, Plus } from 'lucide-react';

const EditDashboard = () => {
  const { dashboardIntro, saveDashboardIntro, noticeBoard, saveNotice, deleteNotice } = useOutletContext();

  const [introText, setIntroText] = useState(dashboardIntro || '');
  const [newNotice, setNewNotice] = useState({ title: '', message: '' });

  const handleSaveIntro = () => saveDashboardIntro(introText);

  const handleAddNotice = () => {
    if (!newNotice.title || !newNotice.message) return;
    saveNotice(newNotice);
    setNewNotice({ title: '', message: '' });
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
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{notice.title}</p>
                  <p className="text-gray-600 text-sm mt-1">{notice.message}</p>
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
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800 mb-3"
            />
            <textarea
              placeholder="Notice message"
              value={newNotice.message}
              onChange={(e) => setNewNotice({ ...newNotice, message: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 glass-dark rounded-2xl border-0 text-gray-800 mb-3"
            />
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
