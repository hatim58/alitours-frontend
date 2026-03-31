import React, { useState } from 'react';
import { useSlideshow } from '../../contexts/SlideshowContext';
import { Trash2, Plus, ChevronUp, ChevronDown, Edit, X } from 'lucide-react';
import { SlideType } from '../../types';

interface SlideFormData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  type: 'package' | 'offer' | 'promotion';
  packageId?: string;
  offerDetails?: {
    originalPrice?: number;
    discountPrice?: number;
    discountPercentage?: number;
    validUntil?: string;
  };
}

const initialForm: SlideFormData = {
  title: '',
  subtitle: '',
  description: '',
  image: '',
  buttonText: '',
  buttonLink: '/packages',
  isActive: true,
  order: 0,
  type: 'package',
  packageId: undefined,
  offerDetails: undefined
};

const SlideshowManager: React.FC = () => {
  const { slides, addSlide, updateSlide, deleteSlide, reorderSlides } = useSlideshow();
  const [form, setForm] = useState<SlideFormData>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.subtitle || !form.description || !form.image || !form.buttonText || !form.buttonLink) {
      setMessage('Please fill all required fields.');
      return;
    }

    const payload: Omit<SlideType, 'id' | 'createdAt' | 'updatedAt'> = {
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      image: form.image,
      buttonText: form.buttonText,
      buttonLink: form.buttonLink,
      isActive: form.isActive,
      order: form.order || slides.length + 1,
      type: form.type,
      packageId: form.packageId,
      offerDetails: form.offerDetails ? { ...form.offerDetails } : undefined
    };

    if (editingId) {
      updateSlide(editingId, { ...payload });
      setMessage('Slide updated successfully.');
    } else {
      addSlide(payload);
      setMessage('Slide added successfully.');
    }

    resetForm();
    setTimeout(() => setMessage(null), 2500);
  };

  const onEdit = (id: string) => {
    const slide = slides.find(s => s.id === id);
    if (!slide) return;
    setEditingId(id);
    setForm({
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: slide.image,
      buttonText: slide.buttonText,
      buttonLink: slide.buttonLink,
      isActive: slide.isActive,
      order: slide.order,
      type: slide.type,
      packageId: slide.packageId,
      offerDetails: slide.offerDetails
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onMove = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= slides.length) return;
    const reordered = [...slides];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;
    reorderSlides(reordered);
  };

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Slideshow Manager</h1>
        <p className="text-sm text-gray-600">Use this panel to add, edit, activate/deactivate and reorder homepage slides.</p>
      </div>

      <form onSubmit={onSubmit} className="bg-white shadow-sm rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input value={form.title} onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Slide title" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
            <input value={form.subtitle} onChange={(e) => setForm(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Slide subtitle" required />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2" placeholder="Slide description" rows={3} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2" placeholder="https://..." required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Button Text</label>
            <input value={form.buttonText} onChange={(e) => setForm(prev => ({ ...prev, buttonText: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2" placeholder="e.g., Explore Kashmir" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Button Link</label>
            <input value={form.buttonLink} onChange={(e) => setForm(prev => ({ ...prev, buttonLink: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2" placeholder="/packages/your-package" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Order</label>
            <input type="number" value={form.order} min={1} onChange={(e) => setForm(prev => ({ ...prev, order: Number(e.target.value) }))} className="w-full border border-gray-300 rounded-lg p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value as 'package' | 'offer' | 'promotion' }))}
              className="w-full border border-gray-300 rounded-lg p-2"
            >
              <option value="package">Package</option>
              <option value="offer">Offer</option>
              <option value="promotion">Promotion</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="slide-active"
              checked={form.isActive}
              onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
              type="checkbox"
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
            <label htmlFor="slide-active" className="text-sm">Active on home</label>
          </div>

          <div className="flex items-center gap-2">
            <button type="submit" className="btn btn-primary px-4 py-2 flex items-center gap-2">
              <Plus size={16} />
              {editingId ? 'Update slide' : 'Add slide'}
            </button>
            <button type="button" className="btn btn-outline px-4 py-2" onClick={resetForm}>
              <X size={16} /> Reset
            </button>
          </div>
        </div>

        {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
      </form>

      {slides.length === 0 ? (
        <p className="text-gray-500">No slides configured yet.</p>
      ) : (
        <div className="space-y-3">
          {slides
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((slide, index) => (
              <div key={slide.id} className="bg-white p-4 border rounded-lg shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm font-bold">#{slide.order} - {slide.title}</p>
                  <p className="text-xs text-gray-600">{slide.subtitle}</p>
                  <p className="text-sm mt-1">{slide.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{slide.isActive ? 'Active' : 'Inactive'} · {slide.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => onMove(index, -1)} className="btn btn-secondary p-2" title="Move up">
                    <ChevronUp size={16} />
                  </button>
                  <button type="button" onClick={() => onMove(index, 1)} className="btn btn-secondary p-2" title="Move down">
                    <ChevronDown size={16} />
                  </button>
                  <button type="button" onClick={() => onEdit(slide.id)} className="btn btn-outline p-2" title="Edit slide">
                    <Edit size={16} />
                  </button>
                  <button type="button" onClick={() => deleteSlide(slide.id)} className="btn btn-danger p-2" title="Delete slide">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SlideshowManager;
