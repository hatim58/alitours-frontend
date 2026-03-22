import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown,
  Image,
  Save,
  X,
  Calendar,
  Tag,
  Link as LinkIcon
} from 'lucide-react';
import { useSlideshow } from '../../contexts/SlideshowContext';
import { usePackages } from '../../contexts/PackageContext';
import ImageUpload from '../../components/ImageUpload';

const AdminSlideshow: React.FC = () => {
  const { slides, addSlide, updateSlide, deleteSlide } = useSlideshow();
  const { packages } = usePackages();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [slideImage, setSlideImage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    type: 'package' as 'package' | 'offer' | 'promotion',
    packageId: '',
    isActive: true,
    order: slides.length + 1,
    offerDetails: {
      originalPrice: '',
      discountPrice: '',
      discountPercentage: '',
      validUntil: ''
    }
  });

  const openForm = (slideId?: string) => {
    if (slideId) {
      const slide = slides.find(s => s.id === slideId);
      if (slide) {
        setFormData({
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          image: '',
          buttonText: slide.buttonText,
          buttonLink: slide.buttonLink,
          type: slide.type,
          packageId: slide.packageId || '',
          isActive: slide.isActive,
          order: slide.order,
          offerDetails: {
            originalPrice: slide.offerDetails?.originalPrice?.toString() || '',
            discountPrice: slide.offerDetails?.discountPrice?.toString() || '',
            discountPercentage: slide.offerDetails?.discountPercentage?.toString() || '',
            validUntil: slide.offerDetails?.validUntil || ''
          }
        });
        setSlideImage('');
        setSlideImage(slide.image);
        setEditingSlide(slideId);
      }
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: '',
        buttonText: '',
        buttonLink: '',
        type: 'package',
        packageId: '',
        isActive: true,
        order: slides.length + 1,
        offerDetails: {
          originalPrice: '',
          discountPrice: '',
          discountPercentage: '',
          validUntil: ''
        }
      });
      setEditingSlide(null);
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingSlide(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const slideData = {
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      image: slideImage || formData.image,
      buttonText: formData.buttonText,
      buttonLink: formData.buttonLink,
      type: formData.type,
      packageId: formData.packageId || undefined,
      isActive: formData.isActive,
      order: formData.order,
      offerDetails: formData.type === 'offer' ? {
        originalPrice: formData.offerDetails.originalPrice ? parseFloat(formData.offerDetails.originalPrice) : undefined,
        discountPrice: formData.offerDetails.discountPrice ? parseFloat(formData.offerDetails.discountPrice) : undefined,
        discountPercentage: formData.offerDetails.discountPercentage ? parseInt(formData.offerDetails.discountPercentage) : undefined,
        validUntil: formData.offerDetails.validUntil || undefined
      } : undefined
    };

    if (editingSlide) {
      updateSlide(editingSlide, slideData);
    } else {
      addSlide(slideData);
    }

    closeForm();
  };

  const toggleSlideStatus = (slideId: string, isActive: boolean) => {
    updateSlide(slideId, { isActive });
  };

  const moveSlide = (slideId: string, direction: 'up' | 'down') => {
    const slide = slides.find(s => s.id === slideId);
    if (!slide) return;

    const newOrder = direction === 'up' ? slide.order - 1 : slide.order + 1;
    const otherSlide = slides.find(s => s.order === newOrder);

    if (otherSlide) {
      updateSlide(slideId, { order: newOrder });
      updateSlide(otherSlide.id, { order: slide.order });
    }
  };

  const sortedSlides = [...slides].sort((a, b) => a.order - b.order);

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Slideshow Management</h1>
        <button
          onClick={() => openForm()}
          className="btn btn-primary flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add New Slide
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Slides</p>
              <h3 className="text-2xl font-bold">{slides.length}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Image size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Active Slides</p>
              <h3 className="text-2xl font-bold">
                {slides.filter(s => s.isActive).length}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Eye size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Offers</p>
              <h3 className="text-2xl font-bold">
                {slides.filter(s => s.type === 'offer').length}
              </h3>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Tag size={20} className="text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slide
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSlides.map((slide) => (
                <tr key={slide.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{slide.order}</span>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => moveSlide(slide.id, 'up')}
                          disabled={slide.order === 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => moveSlide(slide.id, 'down')}
                          disabled={slide.order === slides.length}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="h-12 w-20 rounded object-cover mr-4" 
                      />
                      <div>
                        <div className="font-medium text-gray-900">{slide.title}</div>
                        <div className="text-sm text-gray-500">{slide.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      slide.type === 'offer' ? 'bg-red-100 text-red-800' :
                      slide.type === 'package' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {slide.type.charAt(0).toUpperCase() + slide.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleSlideStatus(slide.id, !slide.isActive)}
                      className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        slide.isActive 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {slide.isActive ? <Eye size={14} className="mr-1" /> : <EyeOff size={14} className="mr-1" />}
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openForm(slide.id)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      title="Edit Slide"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteSlide(slide.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Slide"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-primary-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {editingSlide ? 'Edit Slide' : 'Add New Slide'}
              </h3>
              <button onClick={closeForm} className="text-white hover:text-primary-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Slide Title *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="label">Subtitle</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea
                  className="input h-24"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>

              <div>
                <ImageUpload
                  label="Slide Image"
                  onImageUpload={setSlideImage}
                  currentImage={slideImage}
                  required
                />
                <input
                  type="hidden"
                  value={slideImage}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
              </div>

              {/* Button Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Button Text *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="label flex items-center">
                    <LinkIcon size={16} className="mr-2" />
                    Button Link *
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                    placeholder="/packages or /booking"
                    required
                  />
                </div>
              </div>

              {/* Type and Package Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Slide Type *</label>
                  <select
                    className="input"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="package">Package</option>
                    <option value="offer">Offer</option>
                    <option value="promotion">Promotion</option>
                  </select>
                </div>
                {formData.type === 'package' && (
                  <div>
                    <label className="label">Related Package</label>
                    <select
                      className="input"
                      value={formData.packageId}
                      onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                    >
                      <option value="">Select Package</option>
                      {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Offer Details */}
              {formData.type === 'offer' && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-4">Offer Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="label">Discount %</label>
                      <input
                        type="number"
                        className="input"
                        value={formData.offerDetails.discountPercentage}
                        onChange={(e) => setFormData({
                          ...formData, 
                          offerDetails: {...formData.offerDetails, discountPercentage: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label className="label">Original Price</label>
                      <input
                        type="number"
                        className="input"
                        value={formData.offerDetails.originalPrice}
                        onChange={(e) => setFormData({
                          ...formData, 
                          offerDetails: {...formData.offerDetails, originalPrice: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <label className="label flex items-center">
                        <Calendar size={16} className="mr-2" />
                        Valid Until
                      </label>
                      <input
                        type="date"
                        className="input"
                        value={formData.offerDetails.validUntil}
                        onChange={(e) => setFormData({
                          ...formData, 
                          offerDetails: {...formData.offerDetails, validUntil: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Display Order</label>
                  <input
                    type="number"
                    className="input"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active (visible on website)
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  {editingSlide ? 'Update Slide' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSlideshow;