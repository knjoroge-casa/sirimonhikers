import React, { useState, useEffect } from 'react';
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

  const defaultUpcomingHike = {
    name: "Ngong Hills Trail",
    date: "2026-02-15",
    time: "7:00 AM",
    location: "Ngong Hills, Kajiado County",
    intro: "Join us for an incredible adventure through one of Kenya's most iconic hiking destinations!",
    what_to_expect: "A beautiful trail through the Ngong Hills with stunning views of the Great Rift Valley.",
    difficulty: "Moderate",
    duration: "4-5 hours",
    distance: "12 km",
    weather: "Cool morning temperatures (15-20C), warming up to 25C by midday. Bring layers.",
    meeting_point: "Java House, Karen",
    cost: "KES 500 (transport)",
    post_hike_manenos: "Lunch at a local nyama choma spot. Optional group photos at the summit.",
    last_words: "This is a moderately challenging hike suitable for beginners with basic fitness. Stay hydrated!",
    what_to_bring: ["hikeBag", "hikeBoots", "pants", "top", "thermals", "layers", "water", "hikePoles", "snacks", "salts", "sunscreen", "hat", "mittens", "buff", "gaiters", "clothesChange", "socksShoes", "camera", "rainJacket", "firstAid", "powerBank", "identification", "medIns", "trashBag", "personalStuff", "attitude", "petho"]
  };

  const defaultCalendar = [
    { month: "February", hike: "Ngong Hills Trail", date: "2026-02-15", prerequisites: "None - suitable for beginners" },
    { month: "March", hike: "Mt. Longonot", date: "2026-03-20", prerequisites: "Good fitness level required" },
    { month: "April", hike: "Karura Forest", date: "2026-04-17", prerequisites: "Family-friendly, easy trail" },
    { month: "May", hike: "Hell's Gate National Park", date: "2026-05-15", prerequisites: "Bike rental available" },
    { month: "June", hike: "Elephant Hill, Aberdares", date: "2026-06-19", prerequisites: "Cold weather gear needed" },
    { month: "July", hike: "Lukenya Hills", date: "2026-07-24", prerequisites: "Rock climbing option available" },
    { month: "August", hike: "Mt. Kenya", date: "2026-08-14", prerequisites: "Multi-day trek - register by July 1st" },
    { month: "September", hike: "Oldonyo Sabuk", date: "2026-09-20", prerequisites: "Wildlife present - stay in groups" },
    { month: "October", hike: "Cape Town: Table Mountain", date: "2026-10-10", prerequisites: "INTERNATIONAL - Register by Aug 15th" },
    { month: "November", hike: "Chyulu Hills", date: "2026-11-21", prerequisites: "Remote location - full day trip" },
    { month: "December", hike: "Year-End Hike TBD", date: "2026-12-12", prerequisites: "Location to be announced" }
  ];

  const defaultNotes = [
    "Dates may change due to weather conditions",
    "Register early for international trips and multi-day hikes",
    "WhatsApp group link will be shared upon registration",
    "Contact us for group discounts (5+ people)"
  ];

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
          ...hikeData,
          whatToExpect: hikeData.what_to_expect,
          meetingPoint: hikeData.meeting_point,
          postHikeManenos: hikeData.post_hike_manenos,
          lastWords: hikeData.last_words,
          whatToBring: hikeData.what_to_bring || {}
        });
      } else {
        // Insert default if nothing exists
        await supabase.from('upcoming_hike').insert([defaultUpcomingHike]);
        setUpcomingHike(defaultUpcomingHike);
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
        // Insert default calendar
        await supabase.from('hike_calendar').insert(defaultCalendar);
        setHikeCalendar(defaultCalendar);
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
        // Insert default notes
        const notesToInsert = defaultNotes.map((note, index) => ({
          note,
          order_index: index
        }));
        await supabase.from('important_notes').insert(notesToInsert);
        setImportantNotes(defaultNotes);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setUpcomingHike(defaultUpcomingHike);
      setHikeCalendar(defaultCalendar);
      setImportantNotes(defaultNotes);
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
      // First delete all existing hikes
      await supabase.from('upcoming_hike').delete().neq('id', 0);
      
      // Insert new hike
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
        weather: data.weather,
        meeting_point: data.meetingPoint,
        cost: data.cost,
        post_hike_manenos: data.postHikeManenos,
        last_words: data.lastWords,
        what_to_bring: data.whatToBring
      };

      const { error } = await supabase.from('upcoming_hike').insert([hikeToSave]);
      
      if (error) throw error;
      
      setUpcomingHike(data);
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
    <div class="info-row"><span class="label">Location:</span> ${upcomingHike.location}</div>
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
      // Use GET to avoid CORS issues
      const params = new URLSearchParams({
        name: name,
        phone: phone,
        hike: upcomingHike.name,
        date: upcomingHike.date,
        timestamp: new Date().toISOString()
      });
      
      const url = `https://script.google.com/macros/s/AKfycbwRfnt-uXbPJH7InEiWOHs9VQ3ZCzhvOMrFCC8P3RkCqDg69ru1pmrdlGkosJBlvWHB/exec?${params.toString()}`;
      
      const response = await fetch(url, { 
        method: 'GET',
        mode: 'no-cors'
      });
      
      // With no-cors, we can't read the response, so just show success
      alert(`✅ Registration successful! You're signed up for ${upcomingHike.name}. We'll contact you at ${phone}`);
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Registration received! You're signed up for ${upcomingHike.name}. We'll contact you at ${phone}`);
    }
  }
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={editData.location}
              onChange={(e) => setEditData({ ...editData, location: e.target.value })}
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
          <div className="grid grid-cols-3 gap-4">
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Distance</label>
              <input
                type="text"
                value={editData.distance}
                onChange={(e) => setEditData({ ...editData, distance: e.target.value })}
                placeholder="12 km"
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
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Cost</label>
              <input
                type="text"
                value={editData.cost}
                onChange={(e) => setEditData({ ...editData, cost: e.target.value })}
                placeholder="KES 500"
                className="w-full px-4 py-2 glass rounded-2xl border-0"
              />
            </div>
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

  const HomePage = () => {
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

    return (
      <div className="max-w-2xl mx-auto">
        <AdminLoginModal />
        {isEditingItems && <EditItemsForm />}
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
                  <span>{upcomingHike.location}</span>
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
                <p className="text-gray-700">{upcomingHike.whatToExpect}</p>
              </div>
              <div className="mb-6 glass-dark p-4 rounded-2xl">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">Difficulty:</span>
                    <p className="text-gray-600">{upcomingHike.difficulty}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Duration:</span>
                    <p className="text-gray-600">{upcomingHike.duration}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Distance:</span>
                    <p className="text-gray-600">{upcomingHike.distance}</p>
                  </div>
                </div>
              </div>
              <div className="glass-dark p-4 rounded-2xl mb-6">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  Meeting Point
                </h3>
                <p className="text-gray-700">{upcomingHike.meetingPoint}</p>
                <p className="text-gray-700 mt-2 font-semibold">Cost: {upcomingHike.cost}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Weather</h3>
                <p className="text-gray-700">{upcomingHike.weather}</p>
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
                <p className="text-gray-700">{upcomingHike.lastWords}</p>
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
            </div>
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
    {currentPage === 'home' ? <HomePage /> : <CalendarPage />}
    <footer className="max-w-2xl mx-auto mt-12 text-center text-white/90 text-sm">
      <p>Questions? Contact your Sirimon Host. You know how!</p>
    </footer>
  </div>
);
}
