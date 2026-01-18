import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Info, ChevronRight, Download, Edit, Save, X, Lock, FileText } from 'lucide-react';

const ADMIN_PASSWORD = "hiking2026";

const itemLabels = {
  water: "At least 2 liters of water",
  snacks: "Snacks",
  lunch: "Packed lunch",
  sunscreen: "Sunscreen",
  hat: "Hat/Cap",
  hikingShoes: "Comfortable hiking shoes",
  camera: "Camera (optional)",
  rainJacket: "Rain jacket",
  firstAid: "Personal first aid kit",
  powerBank: "Power bank"
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
  const [importantNotes, setImportantNotes] = useState([
    "Dates may change due to weather conditions",
    "Register early for international trips and multi-day hikes",
    "WhatsApp group link will be shared upon registration",
    "Contact us for group discounts (5+ people)"
  ]);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const defaultUpcomingHike = {
    id: 1,
    name: "Ngong Hills Trail",
    date: "2026-02-15",
    time: "7:00 AM",
    location: "Ngong Hills, Kajiado County",
    intro: "Join us for an incredible adventure through one of Kenya's most iconic hiking destinations!",
    whatToExpect: "A beautiful trail through the Ngong Hills with stunning views of the Great Rift Valley.",
    difficulty: "Moderate",
    duration: "4-5 hours",
    distance: "12 km",
    weather: "Cool morning temperatures (15-20C), warming up to 25C by midday. Bring layers.",
    meetingPoint: "Java House, Karen",
    cost: "KES 500 (transport)",
    postHikeManenos: "Lunch at a local nyama choma spot. Optional group photos at the summit.",
    lastWords: "This is a moderately challenging hike suitable for beginners with basic fitness. Stay hydrated!",
    whatToBring: {
      water: true,
      snacks: true,
      lunch: true,
      sunscreen: true,
      hat: true,
      hikingShoes: true,
      camera: false,
      rainJacket: false,
      firstAid: false,
      powerBank: false
    }
  };

  const defaultCalendar = [
    { id: 1, month: "February", hike: "Ngong Hills Trail", date: "2026-02-15", prerequisites: "None - suitable for beginners" },
    { id: 2, month: "March", hike: "Mt. Longonot", date: "2026-03-20", prerequisites: "Good fitness level required" },
    { id: 3, month: "April", hike: "Karura Forest", date: "2026-04-17", prerequisites: "Family-friendly, easy trail" },
    { id: 4, month: "May", hike: "Hell's Gate National Park", date: "2026-05-15", prerequisites: "Bike rental available" },
    { id: 5, month: "June", hike: "Elephant Hill, Aberdares", date: "2026-06-19", prerequisites: "Cold weather gear needed" },
    { id: 6, month: "July", hike: "Lukenya Hills", date: "2026-07-24", prerequisites: "Rock climbing option available" },
    { id: 7, month: "August", hike: "Mt. Kenya", date: "2026-08-14", prerequisites: "Multi-day trek - register by July 1st" },
    { id: 8, month: "September", hike: "Oldonyo Sabuk", date: "2026-09-20", prerequisites: "Wildlife present - stay in groups" },
    { id: 9, month: "October", hike: "Cape Town: Table Mountain", date: "2026-10-10", prerequisites: "INTERNATIONAL - Register by Aug 15th" },
    { id: 10, month: "November", hike: "Chyulu Hills", date: "2026-11-21", prerequisites: "Remote location - full day trip" },
    { id: 11, month: "December", hike: "Year-End Hike TBD", date: "2026-12-12", prerequisites: "Location to be announced" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
  try {
    const hikeData = localStorage.getItem('upcoming-hike');
    const calendarData = localStorage.getItem('hike-calendar');
    const itemsData = localStorage.getItem('custom-items');
    const notesData = localStorage.getItem('important-notes');
    
    setUpcomingHike(hikeData ? JSON.parse(hikeData) : defaultUpcomingHike);
    setHikeCalendar(calendarData ? JSON.parse(calendarData) : defaultCalendar);
    if (itemsData) setCustomItems(JSON.parse(itemsData));
    if (notesData) setImportantNotes(JSON.parse(notesData));
  } catch (error) {
    setUpcomingHike(defaultUpcomingHike);
    setHikeCalendar(defaultCalendar);
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

  const saveUpcomingHike = (data) => {
  try {
    localStorage.setItem('upcoming-hike', JSON.stringify(data));
    setUpcomingHike(data);
    alert('Saved!');
    setIsEditing(false);
  } catch (e) {
    alert('Error saving');
  }
};

  const saveCalendar = (data) => {
  try {
    localStorage.setItem('hike-calendar', JSON.stringify(data));
    setHikeCalendar(data);
    alert('Calendar saved!');
    setIsEditingCalendar(false);
  } catch (e) {
    alert('Error');
  }
};

  const saveCustomItems = (items) => {
  try {
    localStorage.setItem('custom-items', JSON.stringify(items));
    setCustomItems(items);
    alert('Items saved!');
    setIsEditingItems(false);
  } catch (e) {
    alert('Error');
  }
};

  const saveImportantNotes = (notes) => {
  try {
    localStorage.setItem('important-notes', JSON.stringify(notes));
    setImportantNotes(notes);
    alert('Notes saved!');
    setIsEditingNotes(false);
  } catch (e) {
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
    const selectedItems = Object.entries(upcomingHike.whatToBring)
      .filter(([_, checked]) => checked)
      .map(([key, _]) => allItems[key] || key);

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
    const startDate = new Date(hike.date + 'T' + (hike.time || '07:00'));
    const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);
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
    const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const events = hikeCalendar.map(hike => {
      const startDate = new Date(hike.date + 'T07:00');
      const endDate = new Date(startDate.getTime() + 6 * 60 * 60 * 1000);
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
      const response = await fetch('https://script.google.com/macros/s/AKfycby8AieCDSF_tbrP3j_4qsSRc675XqTIhrFXOqGgYgZ5qtGOXTEZnRTBAASREvjZeMtb/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          phone: phone,
          hike: upcomingHike.name,
          date: upcomingHike.date,
          timestamp: new Date().toISOString()
        })
      });
      
      const result = await response.json();
      console.log('Registration result:', result);
      
      if (result.result === 'success') {
        alert(`✅ Registration successful! You're signed up for ${upcomingHike.name}. We'll contact you at ${phone}`);
      } else {
        alert(`Registration received! You're signed up for ${upcomingHike.name}. We'll contact you at ${phone}`);
      }
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
        <button onClick={() => saveCalendar(calendarData)} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center">
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
                <option>Easy</option>
                <option>Moderate</option>
                <option>Kinda Challenging But We Will Overcome</option>
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
            className="w-full bg-forest-green text-white py-3 rounded-2xl hover:bg-forest-olive font-semibold hover:bg-blue-700 flex items-center justify-center"
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
            className="w-full bg-forest-green text-white py-3 rounded-2xl hover:bg-forest-olive font-semibold hover:bg-blue-700 flex items-center justify-center"
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

    const selectedItems = Object.entries(upcomingHike.whatToBring)
      .filter(([_, checked]) => checked)
      .map(([key, _]) => allItems[key] || key);

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
                  <p className="text-gray-700 italic">{upcomingHike.intro}</p>
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
                className="w-full mb-4 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
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
                        <span className="font-semibold">Prerequisites:</span> {hike.prerequisites}
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
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
    {currentPage === 'home' ? <HomePage /> : <CalendarPage />}
    <footer className="max-w-2xl mx-auto mt-12 text-center text-white/90 text-sm">
      <p>Questions? Contact Kui. You know how!</p>
    </footer>
  </div>
);
}
