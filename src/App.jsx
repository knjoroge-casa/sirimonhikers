import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Clock, Info, ChevronRight, Download, Edit, Save, X, Lock, FileText } from 'lucide-react';
import { supabase } from './lib/supabase';

const ADMIN_PASSWORD = "hiking2026";

const itemLabels = {
  hikeBag: "Comfortable hiking backpack",
  hikeBoots: "Comfortable hiking boots or trail shoes with good traction",
  pants: "Long hiking pants",
  top: "Light top",
  thermals: "Thermal mid-layers",
  layers: "Lightweight, breathable outer layers (weather-appropriate)",
  water: "At least 2 litres of water",
  hikePoles: "Hiking poles",
  snacks: "High energy snacks",
  salts: "Hydration salts / Electrolytes",
  sunscreen: "Sunscreen",
  hat: "Hat/Cap",
  mittens: "Water-resistant gloves/mittens",
  buff: "Buff",
  gaiters: "Gaiters",
  clothesChange: "Post-hike change of clothes",
  socksShoes: "Change of socks and shoes",
  camera: "Camera (optional)",
  rainJacket: "Rain jacket / Poncho",
  firstAid: "First aid kit",
  powerBank: "Power bank",
  identification: "Identification",
  medIns: "Medical cover card",
  trashBag: "Trash-bag",
  personalStuff: "Personal Items",
  attitude: "A great attitude and a helping hand - we look out for each other",
  spirit: "Your fighting spirit and great sense of humour",
  petho: "Petho is requested to be left at home because once you’re out in the elements there’s no shame in the nature game"
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [upcomingHike, setUpcomingHike] = useState(null);
  const [hikeCalendar, setHikeCalendar] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
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
const [isEditingNotices, setIsEditingNotices] = useState(false);
  const [registrations, setRegistrations] = useState([]);
const [rotatingStat] = useState(() => {
  const stats = [
    { label: "Photos Taken", value: "4,300+", suffix: "Proof we were actually there.", icon: "📸" },
    { label: "Laughs Had", value: "Uncountable", suffix: "Premium banter and hilarity ensues.", icon: "😂" },
    { label: "Tears Cried", value: "A few", suffix: "Mostly on steep inclines and bamboo forests. We don't name names.", icon: "😭" },
    { label: "Fucks Given", value: "Selective", suffix: "Reserved for safety, summits, and snacks.", icon: "🎯" },
    { label: "Early Mornings", value: "Every single one", suffix: "Worth it. Every time. Mostly.", icon: "🌅" },
  ];
  return stats[Math.floor(Math.random() * stats.length)];
});


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    // Load upcoming hike
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

    // Load calendar
    const { data: calendarData, error: calendarError } = await supabase
      .from('hike_calendar')
      .select('*')
      .order('date', { ascending: true });

    if (calendarError) {
      console.error('Error loading calendar:', calendarError);
    }

    if (calendarData && calendarData.length > 0) {
      setHikeCalendar(calendarData);
    } else {
      setHikeCalendar([]);
    }

    // Load custom items
    const { data: itemsData, error: itemsError } = await supabase
      .from('custom_items')
      .select('*');

    if (itemsError) {
      console.error('Error loading items:', itemsError);
    }

    if (itemsData) {
      const itemsObj = {};
      itemsData.forEach(item => {
        itemsObj[item.item_key] = item.item_label;
      });
      setCustomItems(itemsObj);
    }

    // Load important notes
    const { data: notesData, error: notesError } = await supabase
      .from('important_notes')
      .select('*')
      .order('order_index', { ascending: true });

    if (notesError) {
      console.error('Error loading notes:', notesError);
    }

    if (notesData && notesData.length > 0) {
      setImportantNotes(notesData.map(n => n.note));
    } else {
      setImportantNotes([]);
    }
// Load completed hikes
const { data: completedData, error: completedError } = await supabase
  .from('completed_hikes')
  .select('*')
  .order('date', { ascending: false }); // Most recent first

if (completedError) {
  console.error('Error loading completed hikes:', completedError);
}

if (completedData) {
  setCompletedHikes(completedData);
}
    // Load dashboard intro
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

// Load notice board
try {
  const { data: noticeData } = await supabase
    .from('notice_board')
    .select('*')
    .order('created_at', { ascending: false });
  setNoticeBoard(noticeData || []);
} catch (e) {
  setNoticeBoard([]);
}
    // Load registrations for upcoming hike
if (hikeData?.id) {
  const { data: regData, error: regError } = await supabase
    .from('registrations')
    .select('*')
    .eq('hike_id', hikeData.id)
    .order('registered_at', { ascending: true });

  if (regError) {
    console.error('Error loading registrations:', regError);
  }
  setRegistrations(regData || []);
} else {
  setRegistrations([]);
}
  } catch (error) {
    console.error('Error loading data:', error);
    // Don't set any defaults - just leave empty
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
      setShowAdminLogin(false);
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
      // UPDATE existing hike
      const { data: updatedData, error } = await supabase
        .from('upcoming_hike')
        .update(hikeToSave)
        .eq('id', upcomingHike.id)
        .select()
        .single();

      if (error) throw error;
      savedHike = updatedData;
    } else {
      // INSERT new hike (only if no existing hike)
      // First delete any existing hikes
      await supabase.from('upcoming_hike').delete().neq('id', 0);
      
      const { data: insertedData, error } = await supabase
        .from('upcoming_hike')
        .insert([hikeToSave])
        .select()
        .single();

      if (error) throw error;
      savedHike = insertedData;
    }
    
    setUpcomingHike({
      ...data,
      id: savedHike.id
    });
    
    alert('Saved!');
    setIsEditing(false);
  } catch (e) {
    console.error('Error saving:', e);
    alert('Error saving');
  }
};

  const saveCalendar = async (data) => {
    try {
      // Delete all existing calendar items
      await supabase.from('hike_calendar').delete().neq('id', 0);
      
      // Insert new calendar items
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
      // Delete all existing custom items
      await supabase.from('custom_items').delete().neq('id', 0);
      
      // Insert new items
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
      // Delete all existing notes
      await supabase.from('important_notes').delete().neq('id', 0);
      
      // Insert new notes
      const notesToSave = notes.map((note, index) => ({
        note,
        order_index: index
      }));

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
    // Delete existing and insert fresh
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
  if (!window.confirm('Mark this hike as completed? It will be moved to the archive.')) {
    return;
  }

  try {
    // Copy hike to completed_hikes table
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

    const { error: insertError } = await supabase
      .from('completed_hikes')
      .insert([completedHike]);

    if (insertError) throw insertError;

    // Delete from upcoming_hike
    await supabase.from('upcoming_hike').delete().neq('id', 0);

    // Reload data
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
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hike-photos')
        .upload(filePath, photoFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('hike-photos')
        .getPublicUrl(filePath);

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
  const saveAsPDF = () => {
    const allItems = { ...itemLabels, ...customItems };
    const printWindow = window.open('', '_blank');
    const formattedDate = new Date(upcomingHike.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
// Get selected items in the order defined by itemLabels + customItems
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
  const timeStr = hike.time || '05:00'; // Default to 5am
  
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
  
  // Create date in Kenya timezone (UTC+3)
  const startDate = new Date(dateStr + 'T' + String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':00+03:00');
  const endDate = new Date(dateStr + 'T17:00:00+03:00'); // 5pm Kenya time
  
  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

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
  // Create dates in Kenya timezone (UTC+3)
  const startDate = new Date(hike.date + 'T05:00:00+03:00'); // 5am Kenya time
  const endDate = new Date(hike.date + 'T17:00:00+03:00');   // 5pm Kenya time
  
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
    console.log('Registering:', { name, phone, hike: upcomingHike.name });
    
    try {
      // Save to Supabase first
      console.log('Attempting Supabase insert with:', {
        hike_id: upcomingHike?.id || null,
        hike_name: upcomingHike.name,
        hike_date: upcomingHike.date,
        name: name,
        phone: phone
      });

      const { data: insertedData, error: supabaseError } = await supabase
        .from('registrations')
        .insert([{
          hike_id: upcomingHike?.id || null,
          hike_name: upcomingHike.name,
          hike_date: upcomingHike.date,
          name: name,
          phone: phone
        }])
        .select();

      console.log('Supabase insert result:', { data: insertedData, error: supabaseError });

      if (supabaseError) {
        console.error('Supabase registration error:', supabaseError);
        // Continue to Google Sheets even if Supabase fails
      }

      // Also save to Google Sheets (backup)
      const params = new URLSearchParams({
        name: name,
        phone: phone,
        hike: upcomingHike.name,
        date: upcomingHike.date,
        timestamp: new Date().toISOString()
      });
      
      const url = `https://script.google.com/macros/s/AKfycbwRfnt-uXbPJH7InEiWOHs9VQ3ZCzhvOMrFCC8P3RkCqDg69ru1pmrdlGkosJBlvWHB/exec?${params.toString()}`;
      
      await fetch(url, { 
        method: 'GET',
        mode: 'no-cors'
      });
      
      alert(`✅ Registration successful! You're signed up for ${upcomingHike.name}. We'll contact you at ${phone}`);
      await loadData(); // Reload to show new registration in admin list
      
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

    // Update local state
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
const useCountdown = (targetDate, targetTime) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (!targetDate) return;

    const calculate = () => {
      const now = new Date();
      
      // Parse target time (e.g., "5:30 AM" or "05:30")
      let hours = 0;
      let minutes = 0;
      
      if (targetTime) {
        const timeStr = targetTime.toLowerCase().trim();
        const match = timeStr.match(/(\d+):(\d+)\s*(am|pm)?/);
        
        if (match) {
          hours = parseInt(match[1]);
          minutes = parseInt(match[2]);
          const ampm = match[3];
          
          if (ampm === 'pm' && hours !== 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;
        }
      }
      
      // Create target datetime in local timezone
      const target = new Date(targetDate + 'T' + String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0') + ':00');
      const diff = target - now;

      if (diff <= 0) {
        const daysPast = Math.floor(Math.abs(diff) / (1000 * 60 * 60 * 24));
        if (daysPast === 0) {
          setCountdown('Today!');
        } else if (daysPast === 1) {
          setCountdown('Yesterday');
        } else {
          setCountdown(`${daysPast} days ago`);
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdown(`${days}d ${hrs}h ${mins}m`);
      } else {
        setCountdown(`${hrs}h ${mins}m`);
      }
    };

    calculate();
    const interval = setInterval(calculate, 60000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  return countdown;
};
  const AdminLoginModal = () => {
    if (!showAdminLogin) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Admin Login</h3>
            <button onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }} className="text-gray-600 hover:text-gray-800">
              <X className="w-6 h-6" />
            </button>
          </div>
          <input
            type="password"
            placeholder="Enter admin password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
            autoFocus
            className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <button onClick={handleAdminLogin} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            Login
          </button>
        </div>
      </div>
    );
  };

  const EditItemsForm = () => {
    const [items, setItems] = useState({ ...customItems });
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');

    const handleAddItem = () => {
      if (newKey && newLabel) {
        const key = newKey.toLowerCase().replace(/\s+/g, '');
        setItems({ ...items, [key]: newLabel });
        setNewKey('');
        setNewLabel('');
      }
    };

    const handleRemoveItem = (key) => {
      const newItems = { ...items };
      delete newItems[key];
      setItems(newItems);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Manage What to Bring Items</h3>
            <button onClick={() => setIsEditingItems(false)} className="text-gray-600 hover:text-gray-800">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Default Items (Cannot be removed)</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(itemLabels).map(([key, label]) => (
                <div key={key} className="bg-gray-50 p-2 rounded text-sm text-gray-700">{label}</div>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Custom Items</h4>
            {Object.keys(items).length === 0 ? (
              <p className="text-sm text-gray-500 italic">No custom items yet</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(items).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between bg-blue-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{label}</span>
                    <button onClick={() => handleRemoveItem(key)} className="text-red-600 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mb-6 border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Add New Item</h4>
            <input
              type="text"
              placeholder="Item name (e.g., headlamp)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full px-4 py-2 glass rounded-2xl border-0 mb-3"
            />
            <input
              type="text"
              placeholder="Item description (e.g., Headlamp with extra batteries)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full px-4 py-2 glass rounded-2xl border-0 mb-3"
            />
            <button onClick={handleAddItem} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
              Add Item
            </button>
          </div>
          <button onClick={() => saveCustomItems(items)} className="w-full bg-forest-green text-white py-3 rounded-2xl hover:bg-forest-olive font-semibold hover:bg-blue-700 flex items-center justify-center">
            <Save className="w-5 h-5 mr-2" />
            Save Items
          </button>
        </div>
      </div>
    );
  };

  const EditCalendarForm = () => {
    const [calendarData, setCalendarData] = useState([...hikeCalendar]);

    const handleUpdateHike = (index, field, value) => {
      const updated = [...calendarData];
      updated[index] = { ...updated[index], [field]: value };
      setCalendarData(updated);
    };

    const handleAddHike = () => {
      setCalendarData([...calendarData, {
        id: calendarData.length + 1,
        month: "",
        hike: "",
        date: "",
        prerequisites: ""
      }]);
    };

    const handleRemoveHike = (index) => {
      setCalendarData(calendarData.filter((_, i) => i !== index));
    };

    return (
      <div className="glass rounded-3xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Calendar</h2>
          <button onClick={() => setIsEditingCalendar(false)} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {calendarData.map((hike, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Hike {index + 1}</h3>
                <button onClick={() => handleRemoveHike(index)} className="text-red-600 hover:text-red-700" title="Remove hike">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Month"
                  value={hike.month}
                  onChange={(e) => handleUpdateHike(index, 'month', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={hike.date}
                  onChange={(e) => handleUpdateHike(index, 'date', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <input
                type="text"
                placeholder="Hike name"
                value={hike.hike}
                onChange={(e) => handleUpdateHike(index, 'hike', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <textarea
                placeholder="Prerequisites"
                value={hike.prerequisites}
                onChange={(e) => handleUpdateHike(index, 'prerequisites', e.target.value)}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          ))}
        </div>
        <button onClick={handleAddHike} className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">
          + Add Hike
        </button>
        <button onClick={() => saveCalendar(calendarData)} className="w-full mt-4 py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
style={{ backgroundColor: '#6B8E23' }}>
          <Save className="w-5 h-5 mr-2" />
          Save Calendar
        </button>
      </div>
    );
  };

  const EditHikeForm = () => {
    const [editData, setEditData] = useState({ ...upcomingHike });
    const allItems = { ...itemLabels, ...customItems };

    const handleCheckboxChange = (item) => {
      setEditData({
        ...editData,
        whatToBring: {
          ...editData.whatToBring,
          [item]: !editData.whatToBring[item]
        }
      });
    };

    return (
      <div className="glass rounded-3xl p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Edit Upcoming Hike</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Hike Name</label>
  <input
    type="text"
    value={editData.name}
    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
    <input
      type="date"
      value={editData.date}
      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
      className="w-full px-4 py-2 glass rounded-2xl border-0"
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
    <input
      type="text"
      value={editData.time}
      onChange={(e) => setEditData({ ...editData, time: e.target.value })}
      placeholder="7:00 AM"
      className="w-full px-4 py-2 glass rounded-2xl border-0"
    />
  </div>
</div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Hike Location</label>
  <input
    type="text"
    value={editData.location}
    onChange={(e) => setEditData({ ...editData, location: e.target.value })}
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Meeting Point</label>
  <input
    type="text"
    value={editData.meetingPoint}
    onChange={(e) => setEditData({ ...editData, meetingPoint: e.target.value })}
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Introduction</label>
  <textarea
    value={editData.intro}
    onChange={(e) => setEditData({ ...editData, intro: e.target.value })}
    rows="2"
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">What to Expect</label>
  <textarea
    value={editData.whatToExpect}
    onChange={(e) => setEditData({ ...editData, whatToExpect: e.target.value })}
    rows="3"
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>

<div className="grid grid-cols-4 gap-4">
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty</label>
    <select
      value={editData.difficulty}
      onChange={(e) => setEditData({ ...editData, difficulty: e.target.value })}
      className="w-full px-4 py-2 glass rounded-2xl border-0"
    >
      <option>Friendly</option>
      <option>Moderate</option>
      <option>Let's Challenge Ourselves</option>
    </select>
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Distance</label>
    <input
      type="text"
      value={editData.distance}
      onChange={(e) => setEditData({ ...editData, distance: e.target.value })}
      placeholder="12 km"
      className="w-full px-4 py-2 glass rounded-2xl border-0"
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
    <input
      type="text"
      value={editData.duration}
      onChange={(e) => setEditData({ ...editData, duration: e.target.value })}
      placeholder="4-5 hours"
      className="w-full px-4 py-2 glass rounded-2xl border-0"
    />
  </div>
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">Elevation</label>
    <input
      type="text"
      value={editData.elevation}
      onChange={(e) => setEditData({ ...editData, elevation: e.target.value })}
      placeholder="800m"
      className="w-full px-4 py-2 glass rounded-2xl border-0"
    />
  </div>
</div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Weather</label>
  <textarea
    value={editData.weather}
    onChange={(e) => setEditData({ ...editData, weather: e.target.value })}
    rows="2"
    placeholder="Expected weather conditions"
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Cost</label>
  <p className="text-xs text-gray-500 italic mb-2">
    Final cost shared on the day. Covers access fees, guides, logistics, lunch, and all the invisible work that makes this feel effortless.
  </p>
  <input
    type="text"
    value={editData.cost}
    onChange={(e) => setEditData({ ...editData, cost: e.target.value })}
    placeholder="KES 500"
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Post Hike Manenos</label>
  <textarea
    value={editData.postHikeManenos}
    onChange={(e) => setEditData({ ...editData, postHikeManenos: e.target.value })}
    rows="2"
    placeholder="What happens after the hike?"
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Last Words</label>
  <textarea
    value={editData.lastWords}
    onChange={(e) => setEditData({ ...editData, lastWords: e.target.value })}
    rows="2"
    placeholder="Final tips or encouragement"
    className="w-full px-4 py-2 glass rounded-2xl border-0"
  />
</div>
          <div className="flex items-center gap-3 p-4 glass-dark rounded-2xl">
  <input
    type="checkbox"
    id="registration-closed"
    checked={editData.registrationClosed || false}
    onChange={(e) => setEditData({ ...editData, registrationClosed: e.target.checked })}
    className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
  />
  <label htmlFor="registration-closed" className="font-semibold text-gray-800 cursor-pointer">
    Close Registration (The bus is full, and other short stories!)
  </label>
</div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">What to Bring</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(allItems).map(item => (
                <label key={item} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editData.whatToBring[item] || false}
                    onChange={() => handleCheckboxChange(item)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">{allItems[item]}</span>
                </label>
              ))}
            </div>
            <button
              onClick={() => setIsEditingItems(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 underline"
            >
              + Manage Item List
            </button>
          </div>
          <button
            onClick={() => saveUpcomingHike(editData)}
            className="w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
style={{ backgroundColor: '#6B8E23' }}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </button>
          {(() => {
  const hikeDate = new Date(editData.date + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayAfterHike = new Date(hikeDate);
  dayAfterHike.setDate(dayAfterHike.getDate() + 1);
  
  if (today >= dayAfterHike) {
    return (
      <button
        onClick={markHikeAsCompleted}
        className="w-full mt-4 py-3 rounded-2xl font-semibold text-white bg-green-600 hover:bg-green-700 flex items-center justify-center"
      >
        ✓ Mark as Completed
      </button>
    );
  }
  return null;
})()}
        </div>
      </div>
    );
  };

  const EditNotesModal = () => {
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
const EditCompletedHikeModal = () => {
  const [editData, setEditData] = useState({ ...currentCompletedHike });
  const [photoFile, setPhotoFile] = useState(null);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be less than 5MB');
        return;
      }
      setPhotoFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Edit Completed Hike</h3>
          <button onClick={() => { setIsEditingCompletedHike(false); setCurrentCompletedHike(null); }} className="text-gray-600 hover:text-gray-800">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Hike Name</label>
  <input
    type="text"
    value={editData.name || ''}
    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
  <input
    type="date"
    value={editData.date || ''}
    onChange={(e) => setEditData({ ...editData, date: e.target.value })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>
          <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Elevation</label>
  <input
    type="text"
    value={editData.elevation || ''}
    onChange={(e) => setEditData({ ...editData, elevation: e.target.value })}
    placeholder="800m"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Participants</label>
            <input
              type="number"
              value={editData.participants || ''}
              onChange={(e) => setEditData({ ...editData, participants: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

         <div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Actual Cost (KES)</label>
  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
    <span className="px-3 py-2 bg-gray-100 text-gray-600 font-semibold text-sm border-r border-gray-300">KES</span>
    <input
      type="number"
      value={editData.actual_cost || ''}
      onChange={(e) => setEditData({ ...editData, actual_cost: e.target.value ? parseFloat(e.target.value) : null })}
      placeholder="0"
      className="w-full px-4 py-2 border-0 focus:outline-none"
    />
  </div>
</div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Actual Distance (km)</label>
  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
    <span className="px-3 py-2 bg-gray-100 text-gray-600 font-semibold text-sm border-r border-gray-300">km</span>
    <input
      type="number"
      step="0.1"
      value={editData.actual_distance || ''}
      onChange={(e) => setEditData({ ...editData, actual_distance: e.target.value ? parseFloat(e.target.value) : null })}
      placeholder="0"
      className="w-full px-4 py-2 border-0 focus:outline-none"
    />
  </div>
</div>

<div>
  <label className="block text-sm font-semibold text-gray-700 mb-1">Actual Elevation (m)</label>
  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
    <span className="px-3 py-2 bg-gray-100 text-gray-600 font-semibold text-sm border-r border-gray-300">m</span>
    <input
      type="number"
      value={editData.actual_elevation || ''}
      onChange={(e) => setEditData({ ...editData, actual_elevation: e.target.value ? parseFloat(e.target.value) : null })}
      placeholder="0"
      className="w-full px-4 py-2 border-0 focus:outline-none"
    />
  </div>
</div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Write-up</label>
            <textarea
              value={editData.write_up || ''}
              onChange={(e) => setEditData({ ...editData, write_up: e.target.value })}
              rows="6"
              placeholder="Share your experience from this hike..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Group Photo (Max 5MB)</label>
            {editData.group_photo_url && (
              <div className="mb-2">
                <img src={editData.group_photo_url} alt="Current group photo" className="w-full h-48 object-cover rounded-lg" />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            {photoFile && <p className="text-sm text-gray-600 mt-1">New photo selected: {photoFile.name}</p>}
          </div>
        </div>

        <button
          onClick={() => saveCompletedHike(editData, photoFile)}
          className="w-full mt-4 py-3 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
          style={{ backgroundColor: '#6B8E23' }}
        >
          <Save className="w-5 h-5 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

const CompletedHikesPage = () => {
  const [expandedHike, setExpandedHike] = useState(null);

  const toggleExpand = (hikeId) => {
    setExpandedHike(expandedHike === hikeId ? null : hikeId);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentPage('home')}
          className="text-white/90 hover:text-white font-semibold flex items-center"
        >
          ← Back to Home
        </button>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Completed Hikes</h1>
      <p className="text-gray-600 mb-6">
        {completedHikes.length} hike{completedHikes.length !== 1 ? 's' : ''} completed
        {/*{completedHikes.length > 0 && ` • ${completedHikes.reduce((sum, h) => sum + (h.participants || 0), 0)} total participants`}*/}
      </p>

      {completedHikes.length === 0 ? (
        <div className="glass rounded-3xl p-6 text-center">
          <p className="text-gray-600">No completed hikes yet. Check back after your first adventure!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedHikes.map(hike => {
            const isExpanded = expandedHike === hike.id;
            const formattedDate = new Date(hike.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div key={hike.id} className="glass rounded-3xl overflow-hidden">
                <div 
                  className="p-5 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => toggleExpand(hike.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    {hike.group_photo_url && (
                      <img src={hike.group_photo_url} alt={hike.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">{hike.name}</h3>
                      <p className="text-blue-600 font-semibold">{formattedDate}</p>
                      {hike.participants > 0 && (
                        <p className="text-sm text-gray-600 mt-1">{hike.participants} participants</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Completed
                      </span>
                      {isAdminAuthenticated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentCompletedHike(hike);
                            setIsEditingCompletedHike(true);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                      <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>
                  </div>
                </div>

                {isExpanded && (
  <div className="px-5 pb-5 border-t border-gray-200">
    {/* 1. GROUP PHOTO */}
    {hike.group_photo_url && (
      <div className="mt-4 mb-4">
        <img src={hike.group_photo_url} alt="Group photo" className="w-full h-64 object-cover rounded-lg" />
      </div>
    )}

    {/* 2. WRITE-UP */}
    {hike.write_up && (
      <div className="mt-4 bg-blue-50 p-4 rounded-2xl">
        <h4 className="font-semibold text-gray-800 mb-2">Our Experience</h4>
        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.write_up}</p>
      </div>
    )}

    {/* 3. HIKE DETAILS */}
    {hike.intro && (
      <div className="mt-4">
        <p className="text-gray-700 italic" style={{ whiteSpace: 'pre-wrap' }}>{hike.intro}</p>
      </div>
    )}

    <div className="mt-4">
      <h4 className="font-semibold text-gray-800 mb-2">What to Expect</h4>
      <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.what_to_expect}</p>
    </div>

    <div className="mt-4 glass-dark p-4 rounded-2xl">
  <div className="grid grid-cols-4 gap-4 text-sm">
    <div>
      <span className="font-semibold text-gray-700">Difficulty</span>
      <p className="text-gray-600">{hike.difficulty}</p>
    </div>
    <div>
      <span className="font-semibold text-gray-700">Distance</span>
      <p className="text-gray-600 text-xs text-gray-400">Estimated</p>
      <p className="text-gray-600">{hike.distance}</p>
      {hike.actual_distance && (
        <>
          <p className="text-xs text-green-600 mt-1">Actual</p>
          <p className="text-green-700 font-semibold">{Number(hike.actual_distance).toLocaleString()} km</p>
        </>
      )}
    </div>
    <div>
      <span className="font-semibold text-gray-700">Duration</span>
      <p className="text-gray-600">{hike.duration}</p>
    </div>
    <div>
      <span className="font-semibold text-gray-700">Elevation</span>
      <p className="text-xs text-gray-400">Estimated</p>
      <p className="text-gray-600">{hike.elevation}</p>
      {hike.actual_elevation && (
        <>
          <p className="text-xs text-green-600 mt-1">Actual</p>
          <p className="text-green-700 font-semibold">{Number(hike.actual_elevation).toLocaleString()} m</p>
        </>
      )}
    </div>
  </div>
</div>

    {hike.weather && (
      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Weather</h4>
        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.weather}</p>
      </div>
    )}

    <div className="mt-4 glass-dark p-4 rounded-2xl">
      <h4 className="font-semibold text-gray-800 mb-2">Details</h4>
      <p className="text-gray-700"><span className="font-semibold">Location:</span> {hike.location}</p>
      <p className="text-gray-700 mt-1"><span className="font-semibold">Meeting Point:</span> {hike.meeting_point}</p>
      <div className="mt-1">
  <span className="font-semibold text-gray-700">Cost</span>
  <p className="text-xs text-gray-400">Estimated</p>
  <p className="text-gray-700">{hike.cost}</p>
  {hike.actual_cost && (
    <>
      <p className="text-xs text-green-600 mt-1">Actual</p>
      <p className="text-green-700 font-semibold">KES {Number(hike.actual_cost).toLocaleString()}</p>
    </>
  )}
</div>
      {hike.participants > 0 && (
        <p className="text-gray-700 mt-1"><span className="font-semibold">Participants:</span> {hike.participants}</p>
      )}
    </div>

    {hike.post_hike_manenos && (
      <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Post Hike Manenos</h4>
        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.post_hike_manenos}</p>
      </div>
    )}

    {hike.last_words && (
      <div className="mt-4 glass-dark p-4 rounded-2xl border-l-4 border-forest-olive">
        <h4 className="font-semibold text-gray-800 mb-2">Last Words</h4>
        <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>{hike.last_words}</p>
      </div>
    )}
  </div>
)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
const CAROUSEL_STATS = [
  { label: "Photos Taken", value: "4,300+", suffix: "Proof we were actually there.", icon: "📸" },
  { label: "Laughs Had", value: "Uncountable", suffix: "Premium banter and hilarity ensues.", icon: "😂" },
  { label: "Tears Cried", value: "A few", suffix: "Mostly on steep inclines and in bewitched bamboo forests.", icon: "😭" },
  { label: "Fucks Given", value: "None", suffix: "Really didn't know we could pee anywhere.", icon: "🎯" },
  { label: "Early Mornings", value: "Every single one", suffix: "Worth it. Every time. Mostly.", icon: "🌅" },
];

const CarouselStats = () => {
  const [current, setCurrent] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState('left');
  const [isPaused, setIsPaused] = useState(false);
  const total = CAROUSEL_STATS.length;

  const goTo = useCallback((index, dir = 'left') => {
    if (sliding) return;
    setDirection(dir);
    setSliding(true);
    setTimeout(() => {
      setCurrent(index);
      setSliding(false);
    }, 300);
  }, [sliding]);

  const goNext = useCallback(() => {
    goTo((current + 1) % total, 'left');
  }, [current, total, goTo]);

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total, 'right');
  }, [current, total, goTo]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, 4000);
    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  const stat = CAROUSEL_STATS[current];

  return (
    <div
      className="glass-dark rounded-2xl p-4 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slide container */}
      <div
        className="flex flex-col items-center gap-2 transition-all duration-300"
        style={{
          opacity: sliding ? 0 : 1,
          transform: sliding
            ? `translateX(${direction === 'left' ? '-20px' : '20px'})`
            : 'translateX(0)',
        }}
      >
        <span className="text-3xl flex-shrink-0">{stat.icon}</span>
        <div className="flex-1 min-w-0 text-center">
  <p className="text-sm font-bold uppercase tracking-widest text-gray-500">{stat.label}</p>
  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
  <p className="text-sm text-gray-500">{stat.suffix}</p>
</div>
      </div>

      {/* Left / right controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={goPrev}
          className="text-gray-400 hover:text-gray-700 transition p-1"
        >
          ‹
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5">
          {CAROUSEL_STATS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 'left' : 'right')}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{ backgroundColor: i === current ? '#6B8E23' : '#d1d5db' }}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          className="text-gray-400 hover:text-gray-700 transition p-1"
        >
          ›
        </button>
      </div>
    </div>
  );
};
  
  const DashboardPage = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Next hike from calendar
  const nextCalendarHike = hikeCalendar.find(h => new Date(h.date) >= today);

  // Determine countdown target
  const countdownTarget = upcomingHike?.date || nextCalendarHike?.date || null;
  const countdown = useCountdown(countdownTarget, upcomingHike?.time || nextCalendarHike?.time);

  // Damage Report calculations
  const totalHikes = completedHikes.length;
  const totalKm = completedHikes.reduce((sum, h) => sum + (parseFloat(h.actual_distance) || 0), 0);
  const totalElevation = completedHikes.reduce((sum, h) => sum + (parseFloat(h.actual_elevation) || 0), 0);

  // Intro editing state
  const [introText, setIntroText] = useState(dashboardIntro);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeBody, setNewNoticeBody] = useState('');
  const [showAddNotice, setShowAddNotice] = useState(false);

  const handleSaveIntro = () => saveDashboardIntro(introText);

  const handleAddNotice = async () => {
    if (!newNoticeTitle.trim() || !newNoticeBody.trim()) {
      alert('Please fill in both title and body');
      return;
    }
    await saveNotice(newNoticeTitle.trim(), newNoticeBody.trim());
    setNewNoticeTitle('');
    setNewNoticeBody('');
    setShowAddNotice(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
  <AdminLoginModal />

      {/* ── INTRO SECTION ── */}
      <div className="glass rounded-3xl p-6 mb-6 relative">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-gray-700 uppercase tracking-widest text-sm">Welcome</h2>
          {isAdminAuthenticated && !isEditingIntro && (
            <button onClick={() => { setIsEditingIntro(true); }} className="text-gray-400 hover:text-blue-600">
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditingIntro ? (
          <div>
            <textarea
              value={introText}
              onChange={(e) => setIntroText(e.target.value)}
              rows="4"
              placeholder="Write a welcome message for the group..."
              className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />
            <div className="flex gap-2">
              <button onClick={handleSaveIntro} className="flex items-center px-4 py-2 rounded-xl text-white font-semibold text-sm" style={{ backgroundColor: '#6B8E23' }}>
                <Save className="w-4 h-4 mr-1" /> Save
              </button>
              <button onClick={() => { setIsEditingIntro(false); setIntroText(dashboardIntro); }} className="flex items-center px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-semibold text-sm">
                <X className="w-4 h-4 mr-1" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
            {dashboardIntro || (isAdminAuthenticated ? <span className="text-gray-400 italic">No intro yet. Click the pencil to add one.</span> : null)}
          </p>
        )}
      </div>

      {/* ── NEXT HIKE CARD ── */}
      {upcomingHike ? (
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">Next Hike</p>
              <h2 className="text-2xl font-bold text-gray-800">{upcomingHike.name}</h2>
              <p className="text-gray-600 mt-1">
                {new Date(upcomingHike.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {upcomingHike.time && ` · ${upcomingHike.time}`}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-blue-50 rounded-2xl px-4 py-3">
                <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide">Countdown</p>
                <p className="text-2xl font-bold text-blue-700 font-mono">{countdown}</p>
              </div>
            </div>
          </div>
          {upcomingHike.location && (
            <div className="flex items-center text-gray-600 text-sm mb-4">
              <MapPin className="w-4 h-4 mr-2 text-blue-500" />
              {upcomingHike.location}
            </div>
          )}
          <div className="flex gap-3 text-sm mb-4">
            {upcomingHike.difficulty && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">{upcomingHike.difficulty}</span>
            )}
            {upcomingHike.distance && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{upcomingHike.distance}</span>
            )}
            {upcomingHike.duration && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{upcomingHike.duration}</span>
            )}
          </div>
          <button
            onClick={() => { setCurrentPage('hike-details'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="w-full py-3 rounded-2xl font-semibold text-white flex items-center justify-center"
            style={{ backgroundColor: '#6B8E23' }}
          >
            Hike Details <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
      ) : nextCalendarHike ? (
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#6B8E23' }} >Save the Date</p>
              <h2 className="text-2xl font-bold text-gray-800">{nextCalendarHike.hike}</h2>
              <p className="text-gray-600 mt-1">
                {new Date(nextCalendarHike.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              <div className="rounded-2xl px-4 py-3" style={{ backgroundColor: '#f5f7ee' }}>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B8E23' }}>Countdown</p>
                <p className="text-2xl font-bold font-mono" style={{ color: '#4a6015' }}>{countdown}</p>
              </div>
            </div>
          </div>
          {nextCalendarHike.prerequisites && (
            <p className="text-gray-600 text-sm mb-4">{nextCalendarHike.prerequisites}</p>
          )}
          <div className="rounded-2xl px-4 py-3 text-center" style={{ backgroundColor: '#f5f7ee' }}>
  <p className="text-sm font-semibold mb-3" style={{ color: '#4a6015' }}>Full hike details coming soon</p>
  {isAdminAuthenticated && (
    <button
      onClick={() => {
        const newHike = {
          name: nextCalendarHike.hike,
          date: nextCalendarHike.date,
          time: '',
          location: '',
          intro: '',
          whatToExpect: nextCalendarHike.prerequisites,
          difficulty: '',
          duration: '',
          distance: '',
          elevation: '',
          weather: '',
          meetingPoint: '',
          cost: '',
          postHikeManenos: '',
          lastWords: '',
          whatToBring: {}
        };
        setUpcomingHike(newHike);
        setCurrentPage('hike-details');
        setIsEditing(true); 
      }}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm"
    >
      Add Full Details
    </button>
  )}
</div>
        </div>
      ) : (
  <div className="glass rounded-3xl p-6 mb-6 text-center">
    <p className="text-gray-500 italic mb-4">No upcoming hikes scheduled yet. Check back soon!</p>
    {isAdminAuthenticated && (
      <button
        onClick={() => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const nextHike = hikeCalendar.find(h => new Date(h.date) >= today);
          const newHike = {
            name: nextHike?.hike || '',
            date: nextHike?.date || '',
            time: '',
            location: '',
            intro: '',
            whatToExpect: nextHike?.prerequisites || '',
            difficulty: '',
            duration: '',
            distance: '',
            elevation: '',
            weather: '',
            meetingPoint: '',
            cost: '',
            postHikeManenos: '',
            lastWords: '',
            whatToBring: {}
          };
          setUpcomingHike(newHike);
          setCurrentPage('hike-details');
          setIsEditing(true);
        }}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        + Add Upcoming Hike
      </button>
    )}
  </div>
)}

      {/* ── DAMAGE REPORT ── */}
      <div className="glass rounded-3xl p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">The Damage Report</h2>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">Sirimon Hikers · 2026</p>

        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{totalHikes}</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">Hikes</p>
            <p className="text-xs text-gray-400 mt-1">
              {totalHikes === 0 ? 'The adventure awaits.' : totalHikes === 1 ? 'And counting.' : 'and counting.'}
            </p>
          </div>
          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{totalKm > 0 ? totalKm.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—'}</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">Kilometres</p>
            <p className="text-xs text-gray-400 mt-1">
              {totalKm === 0 ? 'Boots are ready.' : 'hiked voluntarily. No one forced us.'}
            </p>
          </div>
          <div className="glass-dark rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-800">{totalElevation > 0 ? totalElevation.toLocaleString() : '—'}</p>
            <p className="text-xs text-gray-500 mt-1 font-semibold uppercase tracking-wide">Metres Up</p>
            <p className="text-xs text-gray-400 mt-1">
              {totalElevation === 0 ? 'Sky is the limit.' : `That's Mt. Kenya ${(totalElevation / 5199).toFixed(1)}x. Easy 🤪.`}
            </p>
          </div>
        </div>

        {/* Rotating stat carousel */}
        <CarouselStats />
        </div>
      {/* ── NOTICE BOARD ── */}
      {(noticeBoard.length > 0 || isAdminAuthenticated) && (
        <div className="glass rounded-3xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Notice Board</h2>
              <p className="text-xs text-gray-500">Updates from the group</p>
            </div>
            {isAdminAuthenticated && (
              <button
                onClick={() => setShowAddNotice(!showAddNotice)}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                {showAddNotice ? 'Cancel' : noticeBoard.length < 3 ? '+ Add' : 'Manage'}
              </button>
            )}
          </div>

          {/* Add notice form */}
          {isAdminAuthenticated && showAddNotice && (
            <div className="mb-4 border border-blue-200 rounded-2xl p-4 bg-blue-50">
              <p className="text-xs text-blue-600 font-semibold mb-3">
                {noticeBoard.length < 3 ? `Add Notice (${noticeBoard.length}/3 used)` : 'Delete a notice below to add a new one'}
              </p>
              {noticeBoard.length < 3 && (
                <>
                  <input
                    type="text"
                    placeholder="Notice title"
                    value={newNoticeTitle}
                    onChange={(e) => setNewNoticeTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 mb-2 text-sm"
                  />
                  <textarea
                    placeholder="Notice body"
                    value={newNoticeBody}
                    onChange={(e) => setNewNoticeBody(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 mb-2 text-sm"
                  />
                  <button
                    onClick={handleAddNotice}
                    className="w-full py-2 rounded-xl text-white font-semibold text-sm"
                    style={{ backgroundColor: '#6B8E23' }}
                  >
                    Post Notice
                  </button>
                </>
              )}
            </div>
          )}

          {/* Notices list */}
          {noticeBoard.length === 0 ? (
            <p className="text-gray-400 italic text-sm">No notices yet.</p>
          ) : (
            <div className="space-y-3">
              {noticeBoard.map((notice) => (
                <div key={notice.id} className="glass-dark rounded-2xl p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-sm">{notice.title}</h3>
                    {isAdminAuthenticated && (
                      <button onClick={() => deleteNotice(notice.id)} className="text-red-400 hover:text-red-600 ml-2 flex-shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1" style={{ whiteSpace: 'pre-wrap' }}>{notice.body}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notice.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── NAV BUTTONS ── */}
      <button
        onClick={() => { setCurrentPage('calendar'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="w-full glass text-trail-brown py-3 rounded-2xl hover:bg-gray-200 transition flex items-center justify-center mb-4"
      >
        View Full Year Calendar <ChevronRight className="w-5 h-5 ml-2" />
      </button>
      <button
        onClick={() => { setCurrentPage('completed'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        className="w-full glass text-trail-brown py-3 rounded-2xl hover:bg-gray-200 transition flex items-center justify-center"
      >
        View Completed Hikes <ChevronRight className="w-5 h-5 ml-2" />
      </button>
    </div>
  );
};
  const HikeDetailsPage = () => {
    const [formData, setFormData] = useState({ name: '', phone: '' });
    const allItems = { ...itemLabels, ...customItems };
    
    const handleSubmit = () => {
      if (formData.name && formData.phone) {
        handleRegister(formData.name, formData.phone);
        setFormData({ name: '', phone: '' });
      } else {
        alert('Please fill in all fields');
      }
    };

    const formattedDate = new Date(upcomingHike.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const selectedItems = Object.keys(allItems)
  .filter(key => upcomingHike.whatToBring[key])
  .map(key => allItems[key]);

if (!upcomingHike) {
  return (
    <div className="max-w-2xl mx-auto">
      <AdminLoginModal />
      <div className="mb-4">
        <button
          onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="text-white/90 hover:text-white font-semibold flex items-center"
        >
          ← Back to Dashboard
        </button>
      </div>
      <div className="glass rounded-3xl p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Upcoming Hike Details Yet</h2>
        <p className="text-gray-600 mb-6">Full details haven't been added yet. Check back soon!</p>
        {isAdminAuthenticated ? (
          <button
            onClick={() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const nextHike = hikeCalendar.find(h => new Date(h.date) >= today);
              const newHike = {
                name: nextHike?.hike || '',
                date: nextHike?.date || '',
                time: '',
                location: '',
                intro: '',
                whatToExpect: nextHike?.prerequisites || '',
                difficulty: '',
                duration: '',
                distance: '',
                elevation: '',
                weather: '',
                meetingPoint: '',
                cost: '',
                postHikeManenos: '',
                lastWords: '',
                whatToBring: {}
              };
              setUpcomingHike(newHike);
              setIsEditing(true);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Add Hike Details
          </button>
        ) : (
          <button
            onClick={() => setShowAdminLogin(true)}
            className="text-gray-400 hover:text-gray-600 flex items-center justify-center mx-auto"
          >
            <Lock className="w-5 h-5 mr-2" /> Admin Login
          </button>
        )}
      </div>
    </div>
  );
}
    
    return (
      <div className="max-w-2xl mx-auto">
  <AdminLoginModal />
  {isEditingItems && <EditItemsForm />}
  <div className="mb-4">
    <button
      onClick={() => { setCurrentPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      className="text-white/90 hover:text-white font-semibold flex items-center"
    >
      ← Back to Dashboard
    </button>
  </div>
        {isEditing ? (
          <EditHikeForm />
        ) : (
          <>
            <div className="glass rounded-3xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-800">{upcomingHike.name}</h1>
                <div className="flex gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {upcomingHike.difficulty}
                  </span>
                  {isAdminAuthenticated ? (
                    <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-700" title="Edit">
                      <Edit className="w-5 h-5" />
                    </button>
                  ) : (
                    <button onClick={() => setShowAdminLogin(true)} className="text-gray-600 hover:text-gray-700" title="Admin">
                      <Lock className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-3 mb-6">
  <div className="flex items-center text-gray-700">
    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
    <span>{formattedDate} at {upcomingHike.time}</span>
  </div>
  <div className="flex items-center text-gray-700">
    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
    <span><strong>Meeting Point:</strong> {upcomingHike.meetingPoint}</span>
  </div>
  <div className="flex items-center text-gray-700">
    <MapPin className="w-5 h-5 mr-3 text-blue-600" />
    <span><strong>Location:</strong> {upcomingHike.location}</span>
  </div>
  <div className="flex items-center text-gray-700">
    <Clock className="w-5 h-5 mr-3 text-blue-600" />
    <span>{upcomingHike.duration} • {upcomingHike.distance}</span>
  </div>
</div>

{upcomingHike.intro && (
  <div className="mb-6">
    <p className="text-gray-700 italic" style={{ whiteSpace: 'pre-wrap' }}>
      {upcomingHike.intro}
    </p>
  </div>
)}

<div className="mb-6">
  <h3 className="font-semibold text-gray-800 mb-2">What to Expect</h3>
  <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
    {upcomingHike.whatToExpect}
  </p>
</div>

<div className="mb-6 glass-dark p-4 rounded-2xl">
  <div className="grid grid-cols-4 gap-4 text-sm">
    <div>
      <span className="font-semibold text-gray-700">Difficulty:</span>
      <p className="text-gray-600">{upcomingHike.difficulty}</p>
    </div>
    <div>
      <span className="font-semibold text-gray-700">Distance:</span>
      <p className="text-gray-600">{upcomingHike.distance}</p>
    </div>
    <div>
      <span className="font-semibold text-gray-700">Duration:</span>
      <p className="text-gray-600">{upcomingHike.duration}</p>
    </div>
    <div>
      <span className="font-semibold text-gray-700">Elevation:</span>
      <p className="text-gray-600">{upcomingHike.elevation}</p>
    </div>
  </div>
</div>

<div className="mb-6">
  <h3 className="font-semibold text-gray-800 mb-2">Weather</h3>
  <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
    {upcomingHike.weather}
  </p>
</div>

<div className="glass-dark p-4 rounded-2xl mb-6">
  <h3 className="font-semibold text-gray-800 mb-1 flex items-center">
    <Info className="w-5 h-5 mr-2 text-blue-600" />
    Estimated Cost
  </h3>
  <p className="text-xs text-gray-500 italic mb-2">
    Final cost shared on the day. Covers access fees, guides, logistics, lunch, and all the invisible work that makes this feel effortless.
  </p>
  <p className="text-gray-700 font-semibold">{upcomingHike.cost}</p>
</div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">What to Bring:</h3>
                <ul className="space-y-2">
                  {selectedItems.map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-700">
                      <span className="text-blue-600 mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Post Hike Manenos</h3>
                <p className="text-gray-700">{upcomingHike.postHikeManenos}</p>
              </div>
              <div className="mb-6 glass-dark p-4 rounded-2xl border-l-4 border-forest-olive">
  <h3 className="font-semibold text-gray-800 mb-2">Last Words</h3>
  <p className="text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
    {upcomingHike.lastWords}
  </p>
</div>
              {isAdminAuthenticated && (
                <button
                  onClick={saveAsPDF}
                  className="w-full mb-4 bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 flex items-center justify-center"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Save as PDF
                </button>
              )}
              <button
  onClick={() => downloadSingleEvent(upcomingHike)}
  className="w-full mb-4 py-2 rounded-2xl font-semibold text-white hover:opacity-90 flex items-center justify-center"
  style={{ backgroundColor: '#6B8E23' }}
>
                <Download className="w-5 h-5 mr-2" />
                Add to My Calendar
              </button>
              {upcomingHike.registrationClosed ? (
  <div className="glass rounded-3xl p-6 mb-6 text-center">
    <h3 className="font-semibold text-gray-800 text-lg mb-2">Registration Closed</h3>
    <p className="text-gray-600">The bus is probably full, and other short stories!</p>
  </div>
) : (
  <div className="space-y-4">
    <h3 className="font-semibold text-gray-800 text-lg mb-3">Are you coming? Register here!</h3>
    <input
      type="text"
      placeholder="Your Name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="tel"
      placeholder="Phone Number"
      value={formData.phone}
      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      className="w-full px-4 py-2 glass rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={handleSubmit}
      className="w-full py-3 rounded-2xl font-semibold text-white hover:opacity-90"
      style={{ backgroundColor: '#6B8E23' }}
    >
      Register Now
    </button>
  </div>
)}
            </div>

            {/* ── REGISTERED HIKERS (ADMIN ONLY) ── */}
{isAdminAuthenticated && (
  <div className="glass rounded-3xl p-6 mb-6">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h3 className="font-semibold text-gray-800 text-lg">Registered Hikers</h3>
        <p className="text-sm text-gray-500">
          {registrations.length} registered • {registrations.filter(r => r.checked_in).length} checked in
        </p>
      </div>
    </div>

    {registrations.length === 0 ? (
      <p className="text-gray-400 italic text-sm">No registrations yet</p>
    ) : (
      <div className="space-y-2">
        {registrations.map((reg) => (
          <div key={reg.id} className="flex items-center justify-between glass-dark p-3 rounded-2xl">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={reg.checked_in || false}
                onChange={() => toggleCheckIn(reg.id, reg.checked_in)}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
              />
              <div>
                <p className="font-semibold text-gray-800">{reg.name}</p>
                <p className="text-xs text-gray-500">{reg.phone}</p>
              </div>
            </div>
            {reg.checked_in && reg.checked_in_at && (
  <span className="text-xs text-green-600 font-semibold">
    ✓ {new Date(reg.checked_in_at).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: 'Africa/Nairobi'
    })}
  </span>
)}
          </div>
        ))}
      </div>
    )}
  </div>
)}
            <button
  onClick={() => {
    setCurrentPage('calendar');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
    className="w-full glass text-trail-brown py-3 rounded-2xl hover:bg-gray-200 transition flex items-center justify-center"
>
              View Full Year Calendar
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </>
        )}
      </div>
    );
  };

  const CalendarPage = () => {
    return (
      <div className="max-w-2xl mx-auto">
        {isEditingCalendar ? (
          <EditCalendarForm />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-white/90 hover:text-white font-semibold flex items-center"
              >
                ← Back to Home
              </button>
              <div className="flex gap-2">
                {isAdminAuthenticated && (
                  <button
                    onClick={() => setIsEditingCalendar(true)}
                    className="text-blue-600 hover:text-blue-700"
                    title="Edit calendar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={downloadAllEvents}
                  className="bg-forest-olive text-white px-4 py-2 rounded-2xl font-semibold hover:brightness-90"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download All
                </button>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">2026 Hiking Calendar</h1>
            <div className="space-y-4">
              {hikeCalendar.map(hike => {
                const formattedDate = new Date(hike.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
                return (
                  <div key={hike.id} className="glass rounded-3xl p-5 hover:shadow-2xl transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{hike.hike}</h3>
                        <p className="text-blue-600 font-semibold">{formattedDate}</p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {hike.month}
                        </span>
                        <button
                          onClick={() => downloadSingleEvent(hike)}
                          className="text-forest-olive hover:text-forest-moss"
                          title="Add to calendar"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 glass-dark p-3 rounded-2xl border-l-4 border-forest-olive">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Details:</span> {hike.prerequisites}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 bg-blue-50 p-5 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800">Important Notes</h3>
                {isAdminAuthenticated && (
                  <button
                    onClick={() => setIsEditingNotes(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                    title="Edit notes"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                {importantNotes.map((note, index) => (
                  <li key={index}>• {note}</li>
                ))}
              </ul>
            </div>
          </>
        )}
        {isEditingNotes && <EditNotesModal />}
      </div>
    );
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
};

  return (
  <div className="min-h-screen py-8 px-4">
    <div className="max-w-4xl mx-auto mb-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-display font-bold text-white mb-2 drop-shadow-2xl">
          Sirimon Hikers
        </h1>
      </div>
    </div>
{currentPage === 'home' ? <DashboardPage /> : currentPage === 'hike-details' ? <HikeDetailsPage /> : currentPage === 'calendar' ? <CalendarPage /> : <CompletedHikesPage />}   
    <footer className="max-w-2xl mx-auto mt-12 text-center text-white/90 text-sm">
  <p>Questions? Contact your Sirimon Host. You know how!</p>
  <div className="mt-4 pb-4">
    {isAdminAuthenticated ? (
      <button
        onClick={() => setIsAdminAuthenticated(false)}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white transition-all"
        style={{ backgroundColor: '#6B8E23' }}
      >
        <Lock className="w-3 h-3" /> Admin · Logout
      </button>
    ) : (
      <button
        onClick={() => setShowAdminLogin(true)}
        className="text-white/30 hover:text-white/80 transition-opacity duration-300 text-lg"
        title="Admin login"
      >
        🔒
      </button>
    )}
  </div>
</footer>
    {isEditingCompletedHike && <EditCompletedHikeModal />}
  </div>
);
}
