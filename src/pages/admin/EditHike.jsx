import React from 'react';
import { useOutletContext } from 'react-router-dom';
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
  } = useOutletContext();

  if (!upcomingHike) {
    return (
      <div className="max-w-3xl">
        <div className="glass rounded-3xl p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Hike Details</h1>
          <p className="text-gray-500 italic">No upcoming hike data found. Check your Supabase connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <EditHikeForm
        upcomingHike={upcomingHike}
        setIsEditing={() => {}}
        saveUpcomingHike={saveUpcomingHike}
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
