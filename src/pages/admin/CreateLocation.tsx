import React, { useState } from 'react';
import { MapPin, Save, Trash2, Edit2, X, Check } from 'lucide-react';
import { useLocations } from '../../contexts/LocationContext';

const CreateLocation: React.FC = () => {
  const { locations, addLocation, deleteLocation, updateLocation } = useLocations();

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: '',
    description: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ name: '', slug: '', image: '', description: '' });

  const generateSlug = (name: string) =>
    name.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({ ...formData, name: newName, slug: generateSlug(newName) });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug || !formData.image) {
      alert('Please fill out all required fields.');
      return;
    }

    addLocation({
      name: formData.name,
      slug: formData.slug,
      image: formData.image,
      description: formData.description
    });

    setFormData({ name: '', slug: '', image: '', description: '' });
    setSuccessMsg('Location created successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const startEdit = (loc: { id: string; name: string; slug: string; image: string; description?: string }) => {
    setEditingId(loc.id);
    setEditData({ name: loc.name, slug: loc.slug, image: loc.image, description: loc.description || '' });
  };

  const saveEdit = () => {
    if (editingId) {
      updateLocation(editingId, editData);
      setEditingId(null);
    }
  };

  return (
    <div className="fade-in space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manage Locations</h1>
        <p className="text-gray-500 mt-1">Add new destinations and manage existing ones.</p>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <MapPin size={20} className="text-primary-600" />
          Add New Location
        </h2>

        {successMsg && (
          <div className="mb-4 flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-3 rounded-lg">
            <Check size={18} />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. Andaman Islands"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (URL) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="e.g. andaman-islands"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL *
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {formData.image && (
            <div className="rounded-xl overflow-hidden border border-gray-200 h-40 w-full max-w-xs bg-gray-50">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/400x200?text=Invalid+URL';
                }}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
              placeholder="Brief description of the location..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save size={16} />
              Save Location
            </button>
          </div>
        </form>
      </div>

      {/* Existing Locations */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Existing Locations ({locations.length})
          </h2>
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <MapPin size={40} className="mx-auto mb-3 opacity-40" />
            <p>No locations created yet.</p>
          </div>
        ) : (
          <div className="divide-y">
            {locations.map((loc) => (
              <div key={loc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  <img
                    src={loc.image}
                    alt={loc.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/100?text=?';
                    }}
                  />
                </div>

                {editingId === loc.id ? (
                  /* Inline Edit Mode */
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Name"
                    />
                    <input
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      value={editData.slug}
                      onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                      placeholder="Slug"
                    />
                    <input
                      className="px-2 py-1 border border-gray-300 rounded text-sm md:col-span-2"
                      value={editData.image}
                      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      placeholder="Image URL"
                    />
                    <input
                      className="px-2 py-1 border border-gray-300 rounded text-sm md:col-span-2"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      placeholder="Description"
                    />
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{loc.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">/locations/{loc.slug}</p>
                    {loc.description && (
                      <p className="text-sm text-gray-500 truncate mt-0.5">{loc.description}</p>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {editingId === loc.id ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Save"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(loc)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${loc.name}"?`)) {
                            deleteLocation(loc.id);
                          }
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLocation;
