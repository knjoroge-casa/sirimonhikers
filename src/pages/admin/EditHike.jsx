import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import HikeDetailsPage from '../HikeDetails';

const EditHike = () => {
  const {
    upcomingHike,
    setUpcomingHike,
    saveUpcomingHike,
    markHikeAsCompleted,
    itemLabels,
    customItems,
    saveCustomItems,
    isEditingItems,
    setIsEditingItems,
    hikeCalendar,
    registrations,
    toggleCheckIn,
    handleRegister,
    saveAsPDF,
    downloadSingleEvent,
  } = useOutletContext();

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (data) => {
    await saveUpcomingHike(data);
    setIsEditing(false);
  };

  return (
    <HikeDetailsPage
      upcomingHike={upcomingHike}
      setUpcomingHike={setUpcomingHike}
      isAdminAuthenticated={true}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      isEditingItems={isEditingItems}
      setIsEditingItems={setIsEditingItems}
      hikeCalendar={hikeCalendar}
      customItems={customItems}
      registrations={registrations}
      handleRegister={handleRegister}
      saveAsPDF={saveAsPDF}
      downloadSingleEvent={downloadSingleEvent}
      toggleCheckIn={toggleCheckIn}
      itemLabels={itemLabels}
      navigate={navigate}
      saveUpcomingHike={handleSave}
      markHikeAsCompleted={markHikeAsCompleted}
      saveCustomItems={saveCustomItems}
    />
  );
};

export default EditHike;
