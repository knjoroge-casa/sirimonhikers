import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import EditCalendarForm from '../../components/EditCalendarForm';

const EditCalendar = () => {
  const { hikeCalendar, saveCalendar } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl">
      <EditCalendarForm
        hikeCalendar={hikeCalendar}
        setIsEditingCalendar={() => navigate('/admin')}
        saveCalendar={saveCalendar}
      />
    </div>
  );
};

export default EditCalendar;
