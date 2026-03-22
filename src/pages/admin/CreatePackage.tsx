import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { usePackages } from '../../contexts/PackageContext';
import { 
  MapPin, 
  Clock, 
  Users, 
  IndianRupee, 
  Image, 
  List, 
  Star, 
  CheckCircle, 
  XCircle,
  Plus,
  Trash2,
  Calendar,
  Hotel,
  Utensils,
  Camera,
  Save,
  ArrowLeft
} from 'lucide-react';
import ImageUpload from '../../components/ImageUpload';
import MultiImageUpload from '../../components/MultiImageUpload';

interface ItineraryDay {
  title: string;
  description: string;
  activities: string[];
  meals: string;
  accommodation: string;
  image: string;
  notes: string;
}

interface AccommodationDetails {
  name: string;
  description: string;
  amenities: string[];
}

interface PackageFormData {
  name: string;
  destination: string;
  description: string;
  duration: number;
  maxGuests: number;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  gallery: string[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  itinerary: ItineraryDay[];
  accommodation: AccommodationDetails[];
}

const CreatePackage: React.FC = () => {
  const { addPackage } = usePackages();
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<PackageFormData>({
    defaultValues: {
      gallery: [''],
      highlights: [''],
      includes: [''],
      excludes: [''],
      itinerary: [{
        title: '',
        description: '',
        activities: [''],
        meals: '',
        accommodation: '',
        image: '',
        notes: ''
      }],
      accommodation: [{
        name: '',
        description: '',
        amenities: ['']
      }]
    }
  });

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control,
    name: 'gallery'
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: 'highlights'
  });

  const { fields: includeFields, append: appendInclude, remove: removeInclude } = useFieldArray({
    control,
    name: 'includes'
  });

  const { fields: excludeFields, append: appendExclude, remove: removeExclude } = useFieldArray({
    control,
    name: 'excludes'
  });

  const { fields: itineraryFields, append: appendItinerary, remove: removeItinerary } = useFieldArray({
    control,
    name: 'itinerary'
  });

  const { fields: accommodationFields, append: appendAccommodation, remove: removeAccommodation } = useFieldArray({
    control,
    name: 'accommodation'
  });

  const watchPrice = watch('price');
  const watchOriginalPrice = watch('originalPrice');

  // Calculate discount automatically
  React.useEffect(() => {
    if (watchPrice && watchOriginalPrice && watchOriginalPrice > watchPrice) {
      const discountPercent = Math.round(((watchOriginalPrice - watchPrice) / watchOriginalPrice) * 100);
      setValue('discount', discountPercent);
    }
  }, [watchPrice, watchOriginalPrice, setValue]);

  const onSubmit = async (data: PackageFormData) => {
    setIsSubmitting(true);
    try {
      // Process the form data to match PackageType structure
      const processedData = {
        ...data,
        image: mainImage || data.image,
        gallery: galleryImages.length > 0 ? galleryImages : data.gallery.filter(url => url.trim() !== ''),
        highlights: data.highlights.filter(highlight => highlight.trim() !== ''),
        includes: data.includes.filter(include => include.trim() !== ''),
        excludes: data.excludes.filter(exclude => exclude.trim() !== ''),
        itinerary: data.itinerary.map(day => ({
          ...day,
          activities: day.activities[0] ? day.activities[0].split('\n').filter(activity => activity.trim() !== '') : []
        })),
        accommodation: data.accommodation.map(hotel => ({
          ...hotel,
          amenities: hotel.amenities[0] ? hotel.amenities[0].split('\n').filter(amenity => amenity.trim() !== '') : []
        }))
      };
      
      // Add the package using context
      const packageId = addPackage(processedData);
      
      // Show success message with package ID
      alert(`Package created successfully! Package ID: ${packageId}`);
      navigate('/admin/packages');
    } catch (error) {
      alert('Error creating package. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <List size={16} /> },
    { id: 'pricing', label: 'Pricing', icon: <IndianRupee size={16} /> },
    { id: 'media', label: 'Images', icon: <Image size={16} /> },
    { id: 'features', label: 'Features', icon: <Star size={16} /> },
    { id: 'itinerary', label: 'Itinerary', icon: <Calendar size={16} /> },
    { id: 'accommodation', label: 'Hotels', icon: <Hotel size={16} /> }
  ];

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/packages')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Create New Tour Package</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Basic Package Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label flex items-center">
                      <List size={16} className="mr-2 text-gray-500" />
                      Package Name *
                    </label>
                    <input
                      type="text"
                      className={`input ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="e.g., Andaman Explorer Package"
                      {...register('name', { required: 'Package name is required' })}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-500" />
                      Destination *
                    </label>
                    <input
                      type="text"
                      className={`input ${errors.destination ? 'border-red-500' : ''}`}
                      placeholder="e.g., Port Blair, Andaman & Nicobar Islands"
                      {...register('destination', { required: 'Destination is required' })}
                    />
                    {errors.destination && (
                      <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label">Package Description *</label>
                  <textarea
                    className={`input h-32 ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Describe your tour package in detail. What makes it special? What experiences will travelers have?"
                    {...register('description', { required: 'Description is required' })}
                  ></textarea>
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label flex items-center">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      Duration (Days) *
                    </label>
                    <input
                      type="number"
                      className={`input ${errors.duration ? 'border-red-500' : ''}`}
                      min="1"
                      placeholder="e.g., 5"
                      {...register('duration', { 
                        required: 'Duration is required',
                        min: { value: 1, message: 'Duration must be at least 1 day' }
                      })}
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label flex items-center">
                      <Users size={16} className="mr-2 text-gray-500" />
                      Maximum Guests *
                    </label>
                    <input
                      type="number"
                      className={`input ${errors.maxGuests ? 'border-red-500' : ''}`}
                      min="1"
                      placeholder="e.g., 12"
                      {...register('maxGuests', { 
                        required: 'Maximum guests is required',
                        min: { value: 1, message: 'Must allow at least 1 guest' }
                      })}
                    />
                    {errors.maxGuests && (
                      <p className="text-red-500 text-sm mt-1">{errors.maxGuests.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Package Pricing</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="label flex items-center">
                      <IndianRupee size={16} className="mr-2 text-gray-500" />
                      Current Price (₹) *
                    </label>
                    <input
                      type="number"
                      className={`input ${errors.price ? 'border-red-500' : ''}`}
                      min="0"
                      placeholder="e.g., 25000"
                      {...register('price', { 
                        required: 'Price is required',
                        min: { value: 0, message: 'Price cannot be negative' }
                      })}
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="label">Original Price (₹)</label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      placeholder="e.g., 30000"
                      {...register('originalPrice')}
                    />
                    <p className="text-sm text-gray-500 mt-1">Leave empty if no discount</p>
                  </div>

                  <div>
                    <label className="label">Discount (%)</label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      max="100"
                      placeholder="Auto-calculated"
                      {...register('discount')}
                      readOnly
                    />
                    <p className="text-sm text-gray-500 mt-1">Auto-calculated from prices</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Price Preview</h4>
                  <div className="flex items-center space-x-4">
                    {watchOriginalPrice && watchOriginalPrice > watchPrice && (
                      <span className="text-gray-500 line-through">₹{watchOriginalPrice?.toLocaleString()}</span>
                    )}
                    <span className="text-2xl font-bold text-primary-600">₹{watchPrice?.toLocaleString() || '0'}</span>
                    {watch('discount') > 0 && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                        {watch('discount')}% OFF
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">per person</p>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-4">Package Images</h3>
                
                <ImageUpload
                  label="Main Package Image"
                  onImageUpload={setMainImage}
                  currentImage={mainImage}
                  required
                />
                <input
                  type="hidden"
                  {...register('image', { required: !mainImage })}
                  value={mainImage}
                />

                <MultiImageUpload
                  label="Gallery Images"
                  onImagesChange={setGalleryImages}
                  currentImages={galleryImages}
                  maxImages={10}
                />
                
                {/* Hidden inputs for form validation */}
                {galleryImages.map((image, index) => (
                  <input
                    key={index}
                    type="hidden"
                    {...register(`gallery.${index}` as const)}
                    value={image}
                  />
                ))}
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="space-y-8">
                <h3 className="text-lg font-semibold mb-4">Package Features</h3>
                
                {/* Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0 flex items-center">
                      <Star size={16} className="mr-2 text-gray-500" />
                      Package Highlights *
                    </label>
                    <button
                      type="button"
                      onClick={() => appendHighlight('')}
                      className="btn btn-outline py-2 px-3 text-sm flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Highlight
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {highlightFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <input
                          type="text"
                          className="input flex-1"
                          placeholder="e.g., Visit pristine beaches of Havelock Island"
                          {...register(`highlights.${index}` as const, { required: 'Highlight is required' })}
                        />
                        {highlightFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeHighlight(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Includes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0 flex items-center">
                      <CheckCircle size={16} className="mr-2 text-gray-500" />
                      Package Includes *
                    </label>
                    <button
                      type="button"
                      onClick={() => appendInclude('')}
                      className="btn btn-outline py-2 px-3 text-sm flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Inclusion
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {includeFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <input
                          type="text"
                          className="input flex-1"
                          placeholder="e.g., Accommodation in 3-star hotels"
                          {...register(`includes.${index}` as const, { required: 'Inclusion is required' })}
                        />
                        {includeFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeInclude(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Excludes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0 flex items-center">
                      <XCircle size={16} className="mr-2 text-gray-500" />
                      Package Excludes *
                    </label>
                    <button
                      type="button"
                      onClick={() => appendExclude('')}
                      className="btn btn-outline py-2 px-3 text-sm flex items-center"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Exclusion
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {excludeFields.map((field, index) => (
                      <div key={field.id} className="flex items-center space-x-3">
                        <input
                          type="text"
                          className="input flex-1"
                          placeholder="e.g., Airfare to/from destination"
                          {...register(`excludes.${index}` as const, { required: 'Exclusion is required' })}
                        />
                        {excludeFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExclude(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Day-by-Day Itinerary</h3>
                  <button
                    type="button"
                    onClick={() => appendItinerary({
                      title: '',
                      description: '',
                      activities: [''],
                      meals: '',
                      accommodation: '',
                      image: '',
                      notes: ''
                    })}
                    className="btn btn-outline py-2 px-3 text-sm flex items-center"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Day
                  </button>
                </div>

                <div className="space-y-6">
                  {itineraryFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium">Day {index + 1}</h4>
                        {itineraryFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItinerary(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="label">Day Title *</label>
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g., Arrival in Port Blair"
                            {...register(`itinerary.${index}.title` as const, { required: true })}
                          />
                        </div>
                        <div>
                          <label className="label">Day Image URL</label>
                          <ImageUpload
                            label=""
                            onImageUpload={(imageUrl) => setValue(`itinerary.${index}.image`, imageUrl)}
                            currentImage={watch(`itinerary.${index}.image`)}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="label">Description *</label>
                        <textarea
                          className="input h-24"
                          placeholder="Describe what happens on this day..."
                          {...register(`itinerary.${index}.description` as const, { required: true })}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="label flex items-center">
                            <Utensils size={16} className="mr-2 text-gray-500" />
                            Meals Included
                          </label>
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g., Breakfast, Lunch, Dinner"
                            {...register(`itinerary.${index}.meals` as const)}
                          />
                        </div>
                        <div>
                          <label className="label flex items-center">
                            <Hotel size={16} className="mr-2 text-gray-500" />
                            Accommodation
                          </label>
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g., Hotel Sea Shell, Port Blair"
                            {...register(`itinerary.${index}.accommodation` as const)}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="label">Activities (one per line)</label>
                        <textarea
                          className="input h-20"
                          placeholder="Airport pickup&#10;City tour&#10;Cellular Jail visit"
                          {...register(`itinerary.${index}.activities.0` as const)}
                        ></textarea>
                      </div>

                      <div>
                        <label className="label">Special Notes</label>
                        <textarea
                          className="input h-16"
                          placeholder="Any special notes for this day..."
                          {...register(`itinerary.${index}.notes` as const)}
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accommodation Tab */}
            {activeTab === 'accommodation' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Accommodation Details</h3>
                  <button
                    type="button"
                    onClick={() => appendAccommodation({
                      name: '',
                      description: '',
                      amenities: ['']
                    })}
                    className="btn btn-outline py-2 px-3 text-sm flex items-center"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Hotel
                  </button>
                </div>

                <div className="space-y-6">
                  {accommodationFields.map((field, index) => (
                    <div key={field.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-medium flex items-center">
                          <Hotel size={20} className="mr-2 text-primary-600" />
                          Hotel {index + 1}
                        </h4>
                        {accommodationFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAccommodation(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="label">Hotel Name *</label>
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g., Hotel Sea Shell"
                            {...register(`accommodation.${index}.name` as const, { required: true })}
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="label">Hotel Description *</label>
                        <textarea
                          className="input h-24"
                          placeholder="Describe the hotel, its location, and what makes it special..."
                          {...register(`accommodation.${index}.description` as const, { required: true })}
                        ></textarea>
                      </div>

                      <div>
                        <label className="label">Amenities (one per line)</label>
                        <textarea
                          className="input h-20"
                          placeholder="Free Wi-Fi&#10;Swimming Pool&#10;Restaurant&#10;Room Service&#10;Air Conditioning"
                          {...register(`accommodation.${index}.amenities.0` as const)}
                        ></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Make sure all required fields are filled before saving
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/packages')}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Creating Package...'
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Create Package
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePackage;