import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Mountain } from 'lucide-react';
import EditHikeForm from '../../components/EditHikeForm';
import EditItemsForm from '../../components/EditItemsForm';

const EditHike = () => {
  const {
    upcomingHike,
    saveUpcomingHike,
    markHikeAsCompleted,
    itemLabels,
    customItems,
    saveCustomItems,
    isEditingItems,
    setIsEditingItems,
    hikeCalendar,
  } = useOutletContext();

  const navigate = useNavigate();
  const [draftHike, setDraftHike] = useState(null);

  const hikeToEdit = upcomingHike ?? draftHike;

  const handleSave = async (data) => {
    await saveUpcomingHike(data);
    setDraftHike(null);
  };

  const handleClose = () => {
    if (draftHike && !upcomingHike) {
      setDraftHike(null);
    } else {
      navigate('/admin');
    }
  };

  if (!hikeToEdit) {
    const handleCreate = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const nextCalendarHike = hikeCalendar?.find(h => new Date(h.date) >= today);
      setDraftHike({
        name: nextCalendarHike?.hike || '',
        date: nextCalendarHike?.date || '',
        time: '',
        location: '',
        intro: '',
        whatToExpect: nextCalendarHike?.prerequisites || '',
        difficulty: '',
        duration: '',
        distance: '',
        elevation: '',
        weather: '',
        meetingPoint: '',
        cost: '',
        postHikeManenos: '',
        lastWords: '',
        whatToBring: {},
        registrationClosed: false,
      });
    };

    return (
      <div className="max-w-3xl">
        <div className="glass rounded-3xl p-6 text-center">
          <Mountain className="w-10 h-10 text-forest-olive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">No Upcoming Hike Yet</h1>
          <p className="text-gray-500 mb-6">
            There's no upcoming hike set up. Create one to publish details to the public page.
          </p>
          <button
            onClick={handleCreate}
            className="px-6 py-3 rounded-2xl font-semibold text-white hover:opacity-90"
            style={{ backgroundColor: '#6B8E23' }}
          >
            + Create New Hike
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <EditHikeForm
        upcomingHike={hikeToEdit}
        setIsEditing={handleClose}
        saveUpcomingHike={handleSave}
        setIsEditingItems={setIsEditingItems}
        markHikeAsCompleted={markHikeAsCompleted}
        itemLabels={itemLabels}
        customItems={customItems}
      />
      {isEditingItems && (
        <EditItemsForm
          customItems={customItems}
          setIsEditingItems={setIsEditingItems}
          saveCustomItems={saveCustomItems}
          itemLabels={itemLabels}
        />
      )}
    </div>
  );
};

export default EditHike;
