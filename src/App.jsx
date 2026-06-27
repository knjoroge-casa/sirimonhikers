import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';

import DashboardPage from './pages/Dashboard';
import HikeDetailsPage from './pages/HikeDetails';
import CalendarPage from './pages/Calendar';
import CompletedHikesPage from './pages/CompletedHikes';
import AdminLogin from './pages/Admin';
import EditCompletedHikeModal from './components/EditCompletedHikeModal';
import AdminLayout from './components/AdminLayout';

import AdminDashboard from './pages/admin/AdminDashboard';
import EditDashboard from './pages/admin/EditDashboard';
import EditHike from './pages/admin/EditHike';
import EditCalendar from './pages/admin/EditCalendar';
import EditCompleted from './pages/admin/EditCompleted';
import Companies from './pages/admin/Companies';
import Guides from './pages/admin/Guides';
import Resources from './pages/admin/Resources';
import HikersContacts from './pages/admin/HikersContacts';

import itemLabels from './constants/itemLabels';

const ADMIN_PASSWORD = "hiking2026";

export default function App() {
  const [upcomingHike, setUpcomingHike] = useState(null);
  const [hikeCalendar, setHikeCalendar] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const [isEditingCalendar, setIsEditingCalendar] = useState(false);
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [customItems, setCustomItems] = useState({});
  const [importantNotes, setImportantNotes] = useState([]);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [completedHikes, setCompletedHikes] = useState([]);
  const [currentCompletedHike, setCurrentCompletedHike] = useState(null);
  const [isEditingCompletedHike, setIsEditingCompletedHike] = useState(false);
  const [dashboardIntro, setDashboardIntro] = useState('');
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [noticeBoard, setNoticeBoard] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [hikeCurators, setHikeCurators] = useState([]);
  const [hikeGuides, setHikeGuides] = useState([]);
  const [hikeResources, setHikeResources] = useState([]);
  const [hikersContacts, setHikersContacts] = useState([]);
  const [allRegistrations, setAllRegistrations] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: hikeData, error: hikeError } = await supabase
        .from('upcoming_hike')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (hikeError && hikeError.code !== 'PGRST116') {
        console.error('Error loading hike:', hikeError);
      }

      if (hikeData) {
        setUpcomingHike({
          id: hikeData.id,
          ...hikeData,
          whatToExpect: hikeData.what_to_expect,
          meetingPoint: hikeData.meeting_point,
          postHikeManenos: hikeData.post_hike_manenos,
          lastWords: hikeData.last_words,
          whatToBring: hikeData.what_to_bring || {},
          registrationClosed: hikeData.registration_closed || false
        });
      } else {
        setUpcomingHike(null);
      }

      const { data: calendarData, error: calendarError } = await supabase
        .from('hike_calendar')
        .select('*')
        .order('date', { ascending: true });

      if (calendarError) console.error('Error loading calendar:', calendarError);
      setHikeCalendar(calendarData && calendarData.length > 0 ? calendarData : []);

      const { data: itemsData, error: itemsError } = await supabase
        .from('custom_items')
        .select('*');

      if (itemsError) console.error('Error loading items:', itemsError);
      if (itemsData) {
        const itemsObj = {};
        itemsData.forEach(item => { itemsObj[item.item_key] = item.item_label; });
        setCustomItems(itemsObj);
      }

      const { data: notesData, error: notesError } = await supabase
        .from('important_notes')
        .select('*')
        .order('order_index', { ascending: true });

      if (notesError) console.error('Error loading notes:', notesError);
      setImportantNotes(notesData && notesData.length > 0 ? notesData.map(n => n.note) : []);

      const { data: completedData, error: completedError } = await supabase
        .from('completed_hikes')
        .select('*')
        .order('date', { ascending: false });

      if (completedError) console.error('Error loading completed hikes:', completedError);
      if (completedData) setCompletedHikes(completedData);

      try {
        const { data: introData } = await supabase
          .from('dashboard_intro')
          .select('*')
          .limit(1)
          .single();
        if (introData) setDashboardIntro(introData.content || '');
      } catch (e) {
        setDashboardIntro('');
      }

      try {
        const { data: noticeData } = await supabase
          .from('notice_board')
          .select('*')
          .order('created_at', { ascending: false });
        setNoticeBoard(noticeData || []);
      } catch (e) {
        setNoticeBoard([]);
      }

      try {
        const { data: curatorsData } = await supabase
          .from('curating_companies')
          .select('*')
          .order('name', { ascending: true });
        setHikeCurators(curatorsData || []);
      } catch (e) {
        console.error('Error loading curators:', e);
      }

      try {
        const { data: guidesData } = await supabase
          .from('guides')
          .select('*')
          .order('name', { ascending: true });
        setHikeGuides(guidesData || []);
      } catch (e) {
        console.error('Error loading guides:', e);
      }

      try {
        const { data: resourcesData } = await supabase
          .from('resources_directory')
          .select('*')
          .order('type', { ascending: true })
          .order('name', { ascending: true });
        setHikeResources(resourcesData || []);
      } catch (e) {
        console.error('Error loading resources:', e);
      }

      try {
        const { data: contactsData } = await supabase
          .from('hikers_contacts')
          .select('*')
          .order('name', { ascending: true });
        setHikersContacts(contactsData || []);
      } catch (e) {
        console.error('Error loading hikers contacts:', e);
      }

      try {
        const { data: allRegData } = await supabase
          .from('registrations')
          .select('id, phone, hike_id, hike_name, checked_in');
        setAllRegistrations(allRegData || []);
      } catch (e) {
        console.error('Error loading all registrations:', e);
      }

      if (hikeData?.id) {
        const { data: regData, error: regError } = await supabase
          .from('registrations')
          .select('*')
          .eq('hike_id', hikeData.id)
          .order('registered_at', { ascending: true });

        if (regError) console.error('Error loading registrations:', regError);
        setRegistrations(regData || []);
      } else {
        setRegistrations([]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setUpcomingHike(null);
      setHikeCalendar([]);
      setImportantNotes([]);
      setCompletedHikes([]);
    }
    setIsLoading(false);
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      setAdminPassword('');
      setIsEditing(true);
    } else {
      alert('Incorrect password');
      setAdminPassword('');
    }
  };

  const saveUpcomingHike = async (data) => {
    try {
      const hikeToSave = {
        name: data.name,
        date: data.date,
        time: data.time,
        location: data.location,
        intro: data.intro,
        what_to_expect: data.whatToExpect,
        difficulty: data.difficulty,
        duration: data.duration,
        distance: data.distance,
        elevation: data.elevation,
        weather: data.weather,
        meeting_point: data.meetingPoint,
        cost: data.cost,
        post_hike_manenos: data.postHikeManenos,
        last_words: data.lastWords,
        what_to_bring: data.whatToBring,
        registration_closed: data.registrationClosed || false
      };

      let savedHike;

      if (upcomingHike?.id) {
        const { data: updatedData, error } = await supabase
          .from('upcoming_hike')
          .update(hikeToSave)
          .eq('id', upcomingHike.id)
          .select()
          .single();

        if (error) throw error;
        savedHike = updatedData;
      } else {
        await supabase.from('upcoming_hike').delete().neq('id', 0);
        const { data: insertedData, error } = await supabase
          .from('upcoming_hike')
          .insert([hikeToSave])
          .select()
          .single();

        if (error) throw error;
        savedHike = insertedData;
      }

      setUpcomingHike({ ...data, id: savedHike.id });
      alert('Saved!');
      setIsEditing(false);
    } catch (e) {
      console.error('Error saving:', e);
      alert('Error saving');
    }
  };

  const saveCalendar = async (data) => {
    try {
      await supabase.from('hike_calendar').delete().neq('id', 0);
      const calendarToSave = data.map(item => ({
        month: item.month,
        hike: item.hike,
        date: item.date,
        prerequisites: item.prerequisites
      }));
      const { error } = await supabase.from('hike_calendar').insert(calendarToSave);
      if (error) throw error;
      setHikeCalendar(data);
      alert('Calendar saved!');
      setIsEditingCalendar(false);
    } catch (e) {
      console.error('Error saving calendar:', e);
      alert('Error');
    }
  };

  const saveCustomItems = async (items) => {
    try {
      await supabase.from('custom_items').delete().neq('id', 0);
      const itemsToSave = Object.entries(items).map(([key, label]) => ({
        item_key: key,
        item_label: label
      }));
      if (itemsToSave.length > 0) {
        const { error } = await supabase.from('custom_items').insert(itemsToSave);
        if (error) throw error;
      }
      setCustomItems(items);
      alert('Items saved!');
      setIsEditingItems(false);
    } catch (e) {
      console.error('Error saving items:', e);
      alert('Error');
    }
  };

  const saveImportantNotes = async (notes) => {
    try {
      await supabase.from('important_notes').delete().neq('id', 0);
      const notesToSave = notes.map((note, index) => ({ note, order_index: index }));
      const { error } = await supabase.from('important_notes').insert(notesToSave);
      if (error) throw error;
      setImportantNotes(notes);
      alert('Notes saved!');
      setIsEditingNotes(false);
    } catch (e) {
      console.error('Error saving notes:', e);
      alert('Error');
    }
  };

  const saveDashboardIntro = async (content) => {
    try {
      await supabase.from('dashboard_intro').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('dashboard_intro').insert([{ content }]);
      if (error) throw error;
      setDashboardIntro(content);
      setIsEditingIntro(false);
    } catch (e) {
      console.error('Error saving intro:', e);
      alert('Error saving intro');
    }
  };

  const saveNotice = async (title, body) => {
    try {
      if (noticeBoard.length >= 3) {
        alert('Maximum 3 notices allowed. Please delete one first.');
        return;
      }
      const { error } = await supabase.from('notice_board').insert([{ title, body }]);
      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Error saving notice:', e);
      alert('Error saving notice');
    }
  };

  const deleteNotice = async (id) => {
    try {
      const { error } = await supabase.from('notice_board').delete().eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Error deleting notice:', e);
      alert('Error deleting notice');
    }
  };

  const markHikeAsCompleted = async () => {
    if (!window.confirm('Mark this hike as completed? It will be moved to the archive.')) return;

    try {
      const completedHike = {
        name: upcomingHike.name,
        date: upcomingHike.date,
        time: upcomingHike.time,
        location: upcomingHike.location,
        intro: upcomingHike.intro,
        what_to_expect: upcomingHike.whatToExpect,
        difficulty: upcomingHike.difficulty,
        duration: upcomingHike.duration,
        distance: upcomingHike.distance,
        elevation: upcomingHike.elevation,
        weather: upcomingHike.weather,
        meeting_point: upcomingHike.meetingPoint,
        cost: upcomingHike.cost,
        post_hike_manenos: upcomingHike.postHikeManenos,
        last_words: upcomingHike.lastWords,
        what_to_bring: upcomingHike.whatToBring,
        participants: 0,
        write_up: '',
        actual_cost: null,
        actual_distance: null,
        actual_elevation: null
      };

      const { error: insertError } = await supabase.from('completed_hikes').insert([completedHike]);
      if (insertError) throw insertError;

      await supabase.from('upcoming_hike').delete().neq('id', 0);
      await loadData();
      alert('Hike marked as completed!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error marking hike as completed:', error);
      alert('Error marking hike as completed');
    }
  };

  const saveCompletedHike = async (hikeData, photoFile) => {
    try {
      let photoUrl = hikeData.group_photo_url;

      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('hike-photos')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('hike-photos')
          .getPublicUrl(fileName);

        photoUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from('completed_hikes')
        .update({
          name: hikeData.name,
          date: hikeData.date,
          elevation: hikeData.elevation,
          participants: hikeData.participants,
          write_up: hikeData.write_up,
          actual_cost: hikeData.actual_cost,
          actual_distance: hikeData.actual_distance,
          actual_elevation: hikeData.actual_elevation,
          group_photo_url: photoUrl
        })
        .eq('id', hikeData.id);

      if (error) throw error;

      await loadData();
      alert('Completed hike updated!');
      setIsEditingCompletedHike(false);
      setCurrentCompletedHike(null);
    } catch (error) {
      console.error('Error saving completed hike:', error);
      alert('Error saving changes');
    }
  };

  const saveHikeCurator = async (curator) => {
    try {
      const payload = {
        name: curator.name,
        contacts: curator.contacts,
        rates: curator.rates,
        notes: curator.notes,
      };
      if (curator.id) {
        const { error } = await supabase
          .from('curating_companies')
          .update(payload)
          .eq('id', curator.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('curating_companies')
          .insert([payload]);
        if (error) throw error;
      }
      await loadData();
      return true;
    } catch (e) {
      console.error('Error saving curator:', e);
      alert('Error saving curator');
      return false;
    }
  };

  const deleteHikeCurator = async (id) => {
    if (!window.confirm('Delete this curator?')) return;
    try {
      const { error } = await supabase
        .from('curating_companies')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Error deleting curator:', e);
      alert('Error deleting curator');
    }
  };

  const saveHikeGuide = async (guide) => {
    try {
      const cleanAreas = (guide.area || []).filter(a => a && a.trim() !== '');
      const payload = {
        name: guide.name,
        phone: guide.phone,
        area: cleanAreas,
        rates: guide.rates,
        notes: guide.notes,
      };
      if (guide.id) {
        const { error } = await supabase
          .from('guides')
          .update(payload)
          .eq('id', guide.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('guides')
          .insert([payload]);
        if (error) throw error;
      }
      await loadData();
      return true;
    } catch (e) {
      console.error('Error saving guide:', e);
      alert('Error saving guide');
      return false;
    }
  };

  const deleteHikeGuide = async (id) => {
    if (!window.confirm('Delete this guide?')) return;
    try {
      const { error } = await supabase
        .from('guides')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Error deleting guide:', e);
      alert('Error deleting guide');
    }
  };

  const saveHikeResource = async (resource) => {
    try {
      const payload = {
        type: resource.type,
        name: resource.name,
        contact: resource.contact,
        notes: resource.notes,
      };
      if (resource.id) {
        const { error } = await supabase
          .from('resources_directory')
          .update(payload)
          .eq('id', resource.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('resources_directory')
          .insert([payload]);
        if (error) throw error;
      }
      await loadData();
      return true;
    } catch (e) {
      console.error('Error saving resource:', e);
      alert('Error saving resource');
      return false;
    }
  };

  const deleteHikeResource = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    try {
      const { error } = await supabase
        .from('resources_directory')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Error deleting resource:', e);
      alert('Error deleting resource');
    }
  };

  const saveHikerContact = async (contact) => {
    try {
      if (!contact.name || !contact.phone) {
        alert('Name and phone are required');
        return false;
      }
      const payload = {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        notes: contact.notes,
        birthday: contact.birthday || null,
        manual_hike_count: contact.manual_hike_count !== null && contact.manual_hike_count !== undefined && contact.manual_hike_count !== '' ? parseInt(contact.manual_hike_count) : null,
      };
      if (contact.id) {
        const { error } = await supabase
          .from('hikers_contacts')
          .update(payload)
          .eq('id', contact.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hikers_contacts')
          .insert([payload]);
        if (error) throw error;
      }
      await loadData();
      return true;
    } catch (e) {
      console.error('Error saving contact:', e);
      alert('Error saving contact');
      return false;
    }
  };

  const deleteHikerContact = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      const { error } = await supabase
        .from('hikers_contacts')
        .delete()
        .eq('id', id);
      if (error) throw error;
      await loadData();
    } catch (e) {
      console.error('Error deleting contact:', e);
      alert('Error deleting contact');
    }
  };

  const saveAsPDF = () => {
    const allItems = { ...itemLabels, ...customItems };
    const printWindow = window.open('', '_blank');
    const formattedDate = new Date(upcomingHike.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const selectedItems = Object.keys(allItems)
      .filter(key => upcomingHike.whatToBring[key])
      .map(key => allItems[key]);

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${upcomingHike.name} - Sirimon Hikers</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { color: #1e40af; margin-bottom: 10px; }
    h2 { color: #2563eb; margin-top: 30px; margin-bottom: 15px; font-size: 1.3em; }
    .header { background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #374151; }
    .section { margin: 25px 0; }
    ul { margin: 10px 0; padding-left: 20px; }
    li { margin: 8px 0; }
    .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 0.9em; }
  </style>
</head>
<body>
  <h1>Sirimon Hikers</h1>
  <div class="header">
    <h1>${upcomingHike.name}</h1>
    <div class="info-row"><span class="label">Date:</span> ${formattedDate}</div>
    <div class="info-row"><span class="label">Time:</span> ${upcomingHike.time}</div>
    <div class="info-row"><span class="label">Hike Location:</span> ${upcomingHike.location}</div>
    <div class="info-row"><span class="label">Meeting Point:</span> ${upcomingHike.meetingPoint}</div>
    <div class="info-row"><span class="label">Cost:</span> ${upcomingHike.cost}</div>
  </div>
  ${upcomingHike.intro ? `<div class="section"><p><em>${upcomingHike.intro}</em></p></div>` : ''}
  <div class="section">
    <h2>What to Expect</h2>
    <p>${upcomingHike.whatToExpect}</p>
  </div>
  <div class="section">
    <div class="info-row"><span class="label">Difficulty:</span> ${upcomingHike.difficulty}</div>
    <div class="info-row"><span class="label">Duration:</span> ${upcomingHike.duration}</div>
    <div class="info-row"><span class="label">Distance:</span> ${upcomingHike.distance}</div>
  </div>
  <div class="section">
    <h2>Weather</h2>
    <p>${upcomingHike.weather}</p>
  </div>
  <div class="section">
    <h2>What to Bring</h2>
    <ul>${selectedItems.map(item => `<li>${item}</li>`).join('')}</ul>
  </div>
  <div class="section">
    <h2>Post Hike Manenos</h2>
    <p>${upcomingHike.postHikeManenos}</p>
  </div>
  <div class="section">
    <h2>Last Words</h2>
    <p>${upcomingHike.lastWords}</p>
  </div>
  <div class="footer">
    <p>Questions? Contact your host. You know how!</p>
  </div>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  const generateICS = (hike) => {
    const dateStr = hike.date;
    const timeStr = hike.time || '05:00';

    let hours = 5;
    let minutes = 0;

    if (timeStr.includes(':')) {
      const timeParts = timeStr.toLowerCase().replace(/\s/g, '').match(/(\d+):(\d+)(am|pm)?/);
      if (timeParts) {
        hours = parseInt(timeParts[1]);
        minutes = parseInt(timeParts[2]);
        const ampm = timeParts[3];
        if (ampm === 'pm' && hours !== 12) hours += 12;
        if (ampm === 'am' && hours === 12) hours = 0;
      }
    }

    const startDate = new Date(dateStr + 'T' + String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':00+03:00');
    const endDate = new Date(dateStr + 'T17:00:00+03:00');

    const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Sirimon Hikers//EN\r\nBEGIN:VEVENT\r\nUID:${hike.id}@sirimonhikers.com\r\nDTSTAMP:${formatDate(new Date())}\r\nDTSTART:${formatDate(startDate)}\r\nDTEND:${formatDate(endDate)}\r\nSUMMARY:${hike.hike || hike.name}\r\nDESCRIPTION:${hike.prerequisites || hike.whatToExpect || ''}\r\nLOCATION:${hike.location || ''}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  };

  const downloadSingleEvent = (hike) => {
    const icsContent = generateICS(hike);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(hike.hike || hike.name).replace(/[^a-z0-9]/gi, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAllEvents = () => {
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hour = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const sec = String(date.getSeconds()).padStart(2, '0');
      return `${year}${month}${day}T${hour}${min}${sec}Z`;
    };

    const events = hikeCalendar.map(hike => {
      const startDate = new Date(hike.date + 'T05:00:00+03:00');
      const endDate = new Date(hike.date + 'T17:00:00+03:00');
      return `BEGIN:VEVENT\r\nUID:${hike.id}@sirimonhikers.com\r\nDTSTAMP:${formatDate(new Date())}\r\nDTSTART:${formatDate(startDate)}\r\nDTEND:${formatDate(endDate)}\r\nSUMMARY:${hike.hike}\r\nDESCRIPTION:${hike.prerequisites}\r\nEND:VEVENT`;
    }).join('\r\n');

    const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Sirimon Hikers//EN\r\n${events}\r\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hiking_calendar_2026.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRegister = async (name, phone) => {
    if (name && phone) {
      try {
        const { data: insertedData, error: supabaseError } = await supabase
          .from('registrations')
          .insert([{
            hike_id: upcomingHike?.id || null,
            hike_name: upcomingHike.name,
            hike_date: upcomingHike.date,
            name,
            phone
          }])
          .select();

        if (supabaseError) console.error('Supabase registration error:', supabaseError);

        const params = new URLSearchParams({
          name,
          phone,
          hike: upcomingHike.name,
          date: upcomingHike.date,
          timestamp: new Date().toISOString()
        });

        await fetch(
          `https://script.google.com/macros/s/AKfycbwRfnt-uXbPJH7InEiWOHs9VQ3ZCzhvOMrFCC8P3RkCqDg69ru1pmrdlGkosJBlvWHB/exec?${params.toString()}`,
          { method: 'GET', mode: 'no-cors' }
        );

        alert(`✅ Registration successful! You're signed up for ${upcomingHike.name}. We'll contact you at ${phone}`);
        await loadData();
      } catch (error) {
        console.error('Registration error:', error);
        alert(`Registration received! You're signed up for ${upcomingHike.name}. We'll contact you at ${phone}`);
      }
    }
  };

  const toggleCheckIn = async (registrationId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('registrations')
        .update({
          checked_in: !currentStatus,
          checked_in_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', registrationId);

      if (error) throw error;

      setRegistrations(registrations.map(reg =>
        reg.id === registrationId
          ? { ...reg, checked_in: !currentStatus, checked_in_at: !currentStatus ? new Date().toISOString() : null }
          : reg
      ));
    } catch (error) {
      console.error('Error updating check-in:', error);
      alert('Error updating attendance');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-2xl">Sirimon Hikers</h1>
          <div className="text-white/90 text-lg">Loading your adventure...</div>
          <div className="mt-4 animate-pulse text-white/70">🏔️</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl">
            Sirimon Hikers
          </h1>
        </div>
      </div>

      <Routes>
        <Route path="/" element={
          <DashboardPage
            hikeCalendar={hikeCalendar}
            upcomingHike={upcomingHike}
            completedHikes={completedHikes}
            dashboardIntro={dashboardIntro}
            noticeBoard={noticeBoard}
            isAdminAuthenticated={isAdminAuthenticated}
            isEditingIntro={isEditingIntro}
            setIsEditingIntro={setIsEditingIntro}
            setUpcomingHike={setUpcomingHike}
            navigate={navigate}
            setIsEditing={setIsEditing}
            saveDashboardIntro={saveDashboardIntro}
            saveNotice={saveNotice}
            deleteNotice={deleteNotice}
          />
        } />
        <Route path="/nexthike" element={
          <HikeDetailsPage
            upcomingHike={upcomingHike}
            setUpcomingHike={setUpcomingHike}
            isAdminAuthenticated={isAdminAuthenticated}
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
            saveUpcomingHike={saveUpcomingHike}
            markHikeAsCompleted={markHikeAsCompleted}
            saveCustomItems={saveCustomItems}
          />
        } />
        <Route path="/fullcalendar" element={
          <CalendarPage
            isEditingCalendar={isEditingCalendar}
            setIsEditingCalendar={setIsEditingCalendar}
            isAdminAuthenticated={isAdminAuthenticated}
            navigate={navigate}
            downloadAllEvents={downloadAllEvents}
            hikeCalendar={hikeCalendar}
            downloadSingleEvent={downloadSingleEvent}
            importantNotes={importantNotes}
            isEditingNotes={isEditingNotes}
            setIsEditingNotes={setIsEditingNotes}
            saveCalendar={saveCalendar}
            saveImportantNotes={saveImportantNotes}
          />
        } />
        <Route path="/completedhikes" element={
          <CompletedHikesPage
            completedHikes={completedHikes}
            isAdminAuthenticated={isAdminAuthenticated}
            navigate={navigate}
            setCurrentCompletedHike={setCurrentCompletedHike}
            setIsEditingCompletedHike={setIsEditingCompletedHike}
          />
        } />
        <Route
          path="/admin"
          element={
            isAdminAuthenticated
              ? <AdminLayout
                  setIsAdminAuthenticated={setIsAdminAuthenticated}
                  completedHikes={completedHikes}
                  upcomingHike={upcomingHike}
                  setUpcomingHike={setUpcomingHike}
                  saveUpcomingHike={saveUpcomingHike}
                  markHikeAsCompleted={markHikeAsCompleted}
                  itemLabels={itemLabels}
                  customItems={customItems}
                  saveCustomItems={saveCustomItems}
                  isEditingItems={isEditingItems}
                  setIsEditingItems={setIsEditingItems}
                  hikeCalendar={hikeCalendar}
                  saveCalendar={saveCalendar}
                  dashboardIntro={dashboardIntro}
                  saveDashboardIntro={saveDashboardIntro}
                  noticeBoard={noticeBoard}
                  saveNotice={saveNotice}
                  deleteNotice={deleteNotice}
                  saveCompletedHike={saveCompletedHike}
                  hikeCurators={hikeCurators}
                  saveHikeCurator={saveHikeCurator}
                  deleteHikeCurator={deleteHikeCurator}
                  hikeGuides={hikeGuides}
                  saveHikeGuide={saveHikeGuide}
                  deleteHikeGuide={deleteHikeGuide}
                  hikeResources={hikeResources}
                  saveHikeResource={saveHikeResource}
                  deleteHikeResource={deleteHikeResource}
                  hikersContacts={hikersContacts}
                  saveHikerContact={saveHikerContact}
                  deleteHikerContact={deleteHikerContact}
                  registrations={registrations}
                  allRegistrations={allRegistrations}
                />
              : <AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="edit-dashboard" element={<EditDashboard />} />
          <Route path="edit-hike" element={<EditHike />} />
          <Route path="edit-calendar" element={<EditCalendar />} />
          <Route path="edit-completed" element={<EditCompleted />} />
          <Route path="companies" element={<Companies />} />
          <Route path="guides" element={<Guides />} />
          <Route path="resources" element={<Resources />} />
          <Route path="hikers" element={<HikersContacts />} />
        </Route>
      </Routes>

      <footer className="max-w-2xl mx-auto mt-12 text-center text-white/90 text-sm">
        <p>Questions? Contact your Sirimon Host. You know how!</p>
        {!isAdminAuthenticated && (
          <div className="mt-4 pb-4">
            <Link
              to="/admin"
              className="text-white/30 hover:text-white/80 transition-opacity duration-300 text-lg inline-block"
              title="Admin login"
            >
              🔒
            </Link>
          </div>
        )}
      </footer>

      {isEditingCompletedHike && (
        <EditCompletedHikeModal
          currentCompletedHike={currentCompletedHike}
          setIsEditingCompletedHike={setIsEditingCompletedHike}
          setCurrentCompletedHike={setCurrentCompletedHike}
          saveCompletedHike={saveCompletedHike}
        />
      )}

      {isAdminAuthenticated && (
        <Link
          to="/admin"
          className="fixed top-4 right-4 z-50 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
          style={{ backgroundColor: '#6B8E23' }}
        >
          Admin
        </Link>
      )}
    </div>
  );
}
