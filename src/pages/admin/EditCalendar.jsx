import React from 'react';
import { useOutletContext } from 'react-router-dom';
import EditCalendarForm from '../../components/EditCalendarForm';

const EditCalendar = () => {
  const { hikeCalendar, saveCalendar } = useOutletContext();

  return (
    <div className="max-w-3xl">
      <EditCalendarForm
        hikeCalendar={hikeCalendar}
        setIsEditingCalendar={() => {}}
        saveCalendar={saveCalendar}
      />
    </div>
  );
};

export default EditCalendar;
