import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Info, ChevronRight, Download, Edit, Save, X, Lock, FileText } from 'lucide-react';

const ADMIN_PASSWORD = "hiking2026";

const itemLabels = {
  water: "At least 2 liters of water", snacks: "Snacks", lunch: "Packed lunch", sunscreen: "Sunscreen",
  hat: "Hat/Cap", hikingShoes: "Comfortable hiking shoes", camera: "Camera (optional)", rainJacket: "Rain jacket",
  firstAid: "Personal first aid kit", powerBank: "Power bank"
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

  const defaultUpcomingHike = {
    id: 1, name: "Ngong Hills Trail", date: "2026-02-15", time: "7:00 AM",
    location: "Ngong Hills, Kajiado County",
    intro: "Join us for an incredible adventure through one of Kenya's most iconic hiking destinations!",
    whatToExpect: "A beautiful trail through the Ngong Hills with stunning views of the Great Rift Valley.",
    difficulty: "Moderate", duration: "4-5 hours", distance: "12 km",
    weather: "Cool morning temperatures (15-20C), warming up to 25C by midday. Bring layers.",
    meetingPoint: "Java House, Karen", cost: "KES 500 (transport)",
    postHikeManenos: "Lunch at a local nyama choma spot. Optional group photos at the summit.",
    lastWords: "This is a moderately challenging hike suitable for beginners with basic fitness. Stay hydrated!",
    whatToBring: { water: true, snacks: true, lunch: true, sunscreen: true, hat: true, hikingShoes: true, camera: false, rainJacket: false, firstAid: false, powerBank: false }
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

  const [importantNotes, setImportantNotes] = useState([
    "Dates may change due to weather conditions",
    "Register early for international trips and multi-day hikes",
    "WhatsApp group link will be shared upon registration",
    "Contact us for group discounts (5+ people)"
  ]);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [hikeRes, calRes, itemsRes, notesRes] = await Promise.all([
        window.storage.get('upcoming-hike'), window.storage.get('hike-calendar'), window.storage.get('custom-items'), window.storage.get('important-notes')
      ]);
      setUpcomingHike(hikeRes?.value ? JSON.parse(hikeRes.value) : defaultUpcomingHike);
      setHikeCalendar(calRes?.value ? JSON.parse(calRes.value) : defaultCalendar);
      if (itemsRes?.value) setCustomItems(JSON.parse(itemsRes.value));
      if (notesRes?.value) setImportantNotes(JSON.parse(notesRes.value));
    } catch (e) {
      setUpcomingHike(defaultUpcomingHike);
      setHikeCalendar(defaultCalendar);
    }
    setIsLoading(false);
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true); setShowAdminLogin(false); setAdminPassword(''); setIsEditing(true);
    } else {
      alert('Incorrect password'); setAdminPassword('');
    }
  };

  const saveUpcomingHike = async (data) => {
    try {
      await window.storage.set('upcoming-hike', JSON.stringify(data));
      setUpcomingHike(data); alert('Saved!'); setIsEditing(false);
    } catch (e) { alert('Error saving'); }
  };

  const saveCalendar = async (data) => {
    try {
      await window.storage.set('hike-calendar', JSON.stringify(data));
      setHikeCalendar(data); alert('Calendar saved!'); setIsEditingCalendar(false);
    } catch (e) { alert('Error'); }
  };

  const saveCustomItems = async (items) => {
    try {
      await window.storage.set('custom-items', JSON.stringify(items));
      setCustomItems(items); alert('Items saved!'); setIsEditingItems(false);
    } catch (e) { alert('Error'); }
  };

  const saveImportantNotes = async (notes) => {
    try {
      await window.storage.set('important-notes', JSON.stringify(notes));
      setImportantNotes(notes); alert('Notes saved!'); setIsEditingNotes(false);
    } catch (e) { alert('Error'); }
  };

  const saveAsPDF = () => {
    const allItems = { ...itemLabels, ...customItems };
    const w = window.open('', '_blank');
    const date = new Date(upcomingHike.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const items = Object.entries(upcomingHike.whatToBring).filter(([_, c]) => c).map(([k, _]) => allItems[k] || k);
    w.document.write(`<!DOCTYPE html><html><head><title>${upcomingHike.name}</title><style>body{font-family:Arial;max-width:800px;margin:40px auto;padding:20px;line-height:1.6}h1{color:#1e40af}h2{color:#2563eb;margin-top:30px}.header{background:#eff6ff;padding:20px;border-radius:8px;margin-bottom:30px}.label{font-weight:bold}</style></head><body><h1>Sirimon Hikers</h1><div class="header"><h1>${upcomingHike.name}</h1><p><span class="label">Date:</span> ${date}</p><p><span class="label">Time:</span> ${upcomingHike.time}</p><p><span class="label">Location:</span> ${upcomingHike.location}</p><p><span class="label">Meeting:</span> ${upcomingHike.meetingPoint}</p><p><span class="label">Cost:</span> ${upcomingHike.cost}</p></div>${upcomingHike.intro ? `<p><em>${upcomingHike.intro}</em></p>` : ''}<h2>What to Expect</h2><p>${upcomingHike.whatToExpect}</p><h2>Details</h2><p><span class="label">Difficulty:</span> ${upcomingHike.difficulty}<br><span class="label">Duration:</span> ${upcomingHike.duration}<br><span class="label">Distance:</span> ${upcomingHike.distance}</p><h2>Weather</h2><p>${upcomingHike.weather}</p><h2>What to Bring</h2><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul><h2>Post Hike Manenos</h2><p>${upcomingHike.postHikeManenos}</p><h2>Last Words</h2><p>${upcomingHike.lastWords}</p></body></html>`);
    w.document.close(); w.print();
  };

  const generateICS = (h) => {
    const start = new Date(h.date + 'T' + (h.time || '07:00'));
    const end = new Date(start.getTime() + 21600000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Sirimon Hikers//EN\r\nBEGIN:VEVENT\r\nUID:${h.id}@sirimonhikers.com\r\nDTSTAMP:${fmt(new Date())}\r\nDTSTART:${fmt(start)}\r\nDTEND:${fmt(end)}\r\nSUMMARY:${h.hike || h.name}\r\nDESCRIPTION:${h.prerequisites || h.whatToExpect || ''}\r\nLOCATION:${h.location || ''}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  };

  const downloadSingleEvent = (h) => {
    const blob = new Blob([generateICS(h)], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${(h.hike || h.name).replace(/[^a-z0-9]/gi, '_')}.ics`;
    a.click(); URL.revokeObjectURL(url);
  };

  const downloadAllEvents = () => {
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const evts = hikeCalendar.map(h => {
      const s = new Date(h.date + 'T07:00');
      const e = new Date(s.getTime() + 21600000);
      return `BEGIN:VEVENT\r\nUID:${h.id}@sirimonhikers.com\r\nDTSTAMP:${fmt(new Date())}\r\nDTSTART:${fmt(s)}\r\nDTEND:${fmt(e)}\r\nSUMMARY:${h.hike}\r\nDESCRIPTION:${h.prerequisites}\r\nEND:VEVENT`;
    }).join('\r\n');
    const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Sirimon Hikers//EN\r\n${evts}\r\nEND:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'hiking_calendar_2026.ics';
    a.click(); URL.revokeObjectURL(url);
  };

  const handleRegister = (n, p) => { if (n && p) alert(`Registration successful! You're signed up for ${upcomingHike.name}. We'll contact you at ${p}`); };

  const AdminLoginModal = () => !showAdminLogin ? null : (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Admin Login</h3>
          <button onClick={() => { setShowAdminLogin(false); setAdminPassword(''); }} className="text-gray-600 hover:text-gray-800"><X className="w-6 h-6" /></button>
        </div>
        <input type="password" placeholder="Enter admin password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4" />
        <button onClick={handleAdminLogin} className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Login</button>
      </div>
    </div>
  );

  const EditItemsForm = () => {
    const [items, setItems] = useState({ ...customItems });
    const [newKey, setNewKey] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const add = () => { if (newKey && newLabel) { setItems({ ...items, [newKey.toLowerCase().replace(/\s+/g, '')]: newLabel }); setNewKey(''); setNewLabel(''); } };
    const rem = (k) => { const n = { ...items }; delete n[k]; setItems(n); };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Manage What to Bring Items</h3>
            <button onClick={() => setIsEditingItems(false)} className="text-gray-600"><X className="w-6 h-6" /></button>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Default Items</h4>
            <div className="grid grid-cols-2 gap-2">{Object.entries(itemLabels).map(([k, l]) => <div key={k} className="bg-gray-50 p-2 rounded text-sm">{l}</div>)}</div>
          </div>
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Custom Items</h4>
            {Object.keys(items).length === 0 ? <p className="text-sm text-gray-500 italic">No custom items</p> : <div className="space-y-2">{Object.entries(items).map(([k, l]) => <div key={k} className="flex items-center justify-between bg-blue-50 p-2 rounded"><span className="text-sm">{l}</span><button onClick={() => rem(k)} className="text-red-600"><X className="w-4 h-4" /></button></div>)}</div>}
          </div>
          <div className="mb-6 border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Add New Item</h4>
            <input type="text" placeholder="Item name" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-3" />
            <input type="text" placeholder="Description" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} className="w-full px-4 py-2 border rounded-lg mb-3" />
            <button onClick={add} className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Add</button>
          </div>
          <button onClick={() => saveCustomItems(items)} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center"><Save className="w-5 h-5 mr-2" />Save</button>
        </div>
      </div>
    );
  };

  const EditCalendarForm = () => {
    const [cal, setCal] = useState([...hikeCalendar]);
    const upd = (i, f, v) => { const u = [...cal]; u[i] = { ...u[i], [f]: v }; setCal(u); };
    const add = () => setCal([...cal, { id: cal.length + 1, month: "", hike: "", date: "", prerequisites: "" }]);
    const rem = (i) => setCal(cal.filter((_, idx) => idx !== i));
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Calendar</h2>
          <button onClick={() => setIsEditingCalendar(false)} className="text-gray-600"><X className="w-6 h-6" /></button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {cal.map((h, i) => (
            <div key={i} className="border p-4 rounded-lg space-y-3">
              <div className="flex justify-between"><h3 className="font-semibold">Hike {i + 1}</h3><button onClick={() => rem(i)} className="text-red-600"><X className="w-5 h-5" /></button></div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Month" value={h.month} onChange={(e) => upd(i, 'month', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
                <input type="date" value={h.date} onChange={(e) => upd(i, 'date', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
              </div>
              <input type="text" placeholder="Hike name" value={h.hike} onChange={(e) => upd(i, 'hike', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
              <textarea placeholder="Prerequisites" value={h.prerequisites} onChange={(e) => upd(i, 'prerequisites', e.target.value)} rows="2" className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          ))}
        </div>
        <button onClick={add} className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg font-semibold">+ Add Hike</button>
        <button onClick={() => saveCalendar(cal)} className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center"><Save className="w-5 h-5 mr-2" />Save</button>
      </div>
    );
  };

  const EditHikeForm = () => {
    const [ed, setEd] = useState({ ...upcomingHike });
    const allItems = { ...itemLabels, ...customItems };
    const chk = (i) => setEd({ ...ed, whatToBring: { ...ed.whatToBring, [i]: !ed.whatToBring[i] } });
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Hike</h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-600"><X className="w-6 h-6" /></button>
        </div>
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold mb-1">Hike Name</label><input type="text" value={ed.name} onChange={(e) => setEd({ ...ed, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1">Date</label><input type="date" value={ed.date} onChange={(e) => setEd({ ...ed, date: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-semibold mb-1">Time</label><input type="text" value={ed.time} onChange={(e) => setEd({ ...ed, time: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold mb-1">Location</label><input type="text" value={ed.location} onChange={(e) => setEd({ ...ed, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-semibold mb-1">Introduction</label><textarea value={ed.intro} onChange={(e) => setEd({ ...ed, intro: e.target.value })} rows="2" className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-semibold mb-1">What to Expect</label><textarea value={ed.whatToExpect} onChange={(e) => setEd({ ...ed, whatToExpect: e.target.value })} rows="3" className="w-full px-4 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-semibold mb-1">Difficulty</label><select value={ed.difficulty} onChange={(e) => setEd({ ...ed, difficulty: e.target.value })} className="w-full px-4 py-2 border rounded-lg"><option>Easy</option><option>Moderate</option><option>Hard</option></select></div>
            <div><label className="block text-sm font-semibold mb-1">Duration</label><input type="text" value={ed.duration} onChange={(e) => setEd({ ...ed, duration: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-semibold mb-1">Distance</label><input type="text" value={ed.distance} onChange={(e) => setEd({ ...ed, distance: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold mb-1">Weather</label><textarea value={ed.weather} onChange={(e) => setEd({ ...ed, weather: e.target.value })} rows="2" className="w-full px-4 py-2 border rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-semibold mb-1">Meeting Point</label><input type="text" value={ed.meetingPoint} onChange={(e) => setEd({ ...ed, meetingPoint: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
            <div><label className="block text-sm font-semibold mb-1">Cost</label><input type="text" value={ed.cost} onChange={(e) => setEd({ ...ed, cost: e.target.value })} className="w-full px-4 py-2 border rounded-lg" /></div>
          </div>
          <div><label className="block text-sm font-semibold mb-1">Post Hike Manenos</label><textarea value={ed.postHikeManenos} onChange={(e) => setEd({ ...ed, postHikeManenos: e.target.value })} rows="2" className="w-full px-4 py-2 border rounded-lg" /></div>
          <div><label className="block text-sm font-semibold mb-1">Last Words</label><textarea value={ed.lastWords} onChange={(e) => setEd({ ...ed, lastWords: e.target.value })} rows="2" className="w-full px-4 py-2 border rounded-lg" /></div>
          <div>
            <label className="block text-sm font-semibold mb-2">What to Bring</label>
            <div className="grid grid-cols-2 gap-3">{Object.keys(allItems).map(i => <label key={i} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={ed.whatToBring[i] || false} onChange={() => chk(i)} className="w-4 h-4" /><span className="text-sm">{allItems[i]}</span></label>)}</div>
            <button onClick={() => setIsEditingItems(true)}
