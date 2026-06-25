import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const EditItemsForm = ({ customItems, setIsEditingItems, saveCustomItems, itemLabels }) => {
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

export default EditItemsForm;
