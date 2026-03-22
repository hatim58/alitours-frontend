import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Quotation, QuotationItem, Customer } from '../../types/management';
import { Calendar, FileText, Download, MessageCircle } from 'lucide-react';
import { generateQuotationPDF } from '../../utils/quotationPDF';

interface QuotationFormProps {
  onSubmit: (data: Partial<Quotation>) => void;
  customers: Customer[];
  quotation?: Quotation;
  isSubmitting?: boolean;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ onSubmit, customers, quotation, isSubmitting }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: quotation || {}
  });

  const formData = watch();
  const total = formData.totalAmount || 0;

  const handleGeneratePDF = () => {
    if (!formData.customerId) {
      alert('Please select a customer first');
      return;
    }
    const customer = customers.find(c => c.id === formData.customerId);
    if (customer) {
      generateQuotationPDF(formData, customer);
    }
  };

  const handleSendWhatsApp = () => {
    if (!formData.customerId) {
      alert('Please select a customer first');
      return;
    }

    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return;

    const message = `🌍 *ALI TOURS & TRAVELS*
📦 *Quotation Details*

📘 *Package Name:* ${formData.packageName || 'N/A'}
🗺️ *Tour Route:* ${formData.tourRoute || 'N/A'}
🕒 *Duration:* ${formData.duration || 'N/A'}
👨‍👩‍👧‍👦 *No. of Travellers:* ${formData.noOfTravellers || 'N/A'}
📅 *Travel Date:* ${formData.travelDate ? new Date(formData.travelDate).toLocaleDateString() : 'N/A'}

✅ *Inclusions:*
${formData.packageInclusion || 'N/A'}

❌ *Exclusions:*
${formData.packageExclusion || 'N/A'}

📝 *Note:*
${formData.note || 'N/A'}

💰 *Advance Policy:*
${formData.advancePolicy || 'N/A'}

❗ *Cancellation Policy:*
${formData.cancellationPolicy || 'N/A'}

💰 *Total Amount:* ₹${total.toLocaleString()}

Thank you for choosing *Ali Tours & Travels*!
📞 +91 9111917200 | ✉️ info@alitourstravels.in
🏢 SN3, Bohra Complex, Lane in Hirazy Sales, Jwali Nala, Telipara Road, Bilaspur`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Customer</label>
          <select
            className={`input ${errors.customerId ? 'border-red-500' : ''}`}
            {...register('customerId', { required: 'Please select a customer' })}
          >
            <option value="">Select Customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name} ({customer.phone})
              </option>
            ))}
          </select>
          {errors.customerId && (
            <p className="text-red-500 text-sm mt-1">{errors.customerId.message}</p>
          )}
        </div>

        <div>
          <label className="label flex items-center">
            <Calendar size={16} className="mr-2" />
            Valid Until
          </label>
          <input
            type="date"
            className={`input ${errors.validUntil ? 'border-red-500' : ''}`}
            {...register('validUntil', { required: 'Validity date is required' })}
          />
          {errors.validUntil && (
            <p className="text-red-500 text-sm mt-1">{errors.validUntil.message}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-4">Tour Package Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Package Name</label>
            <input
              type="text"
              className={`input ${errors.packageName ? 'border-red-500' : ''}`}
              {...register('packageName', { required: 'Package name is required' })}
              placeholder="e.g., Taj Mahal Tour"
            />
            {errors.packageName && (
              <p className="text-red-500 text-sm mt-1">{errors.packageName.message}</p>
            )}
          </div>

          <div>
            <label className="label">Tour Route</label>
            <input
              type="text"
              className={`input ${errors.tourRoute ? 'border-red-500' : ''}`}
              {...register('tourRoute', { required: 'Tour route is required' })}
              placeholder="e.g., Delhi - Agra - Mathura"
            />
            {errors.tourRoute && (
              <p className="text-red-500 text-sm mt-1">{errors.tourRoute.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="label">Duration</label>
            <input
              type="text"
              className={`input ${errors.duration ? 'border-red-500' : ''}`}
              {...register('duration', { required: 'Duration is required' })}
              placeholder="e.g., 5 Days / 4 Nights"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <label className="label">No. of Travellers</label>
            <input
              type="number"
              className={`input ${errors.noOfTravellers ? 'border-red-500' : ''}`}
              {...register('noOfTravellers', { required: 'Number of travellers is required' })}
              placeholder="4"
              min="1"
            />
            {errors.noOfTravellers && (
              <p className="text-red-500 text-sm mt-1">{errors.noOfTravellers.message}</p>
            )}
          </div>

          <div>
            <label className="label flex items-center">
              <Calendar size={16} className="mr-2" />
              Travel Date
            </label>
            <input
              type="date"
              className={`input ${errors.travelDate ? 'border-red-500' : ''}`}
              {...register('travelDate', { required: 'Travel date is required' })}
            />
            {errors.travelDate && (
              <p className="text-red-500 text-sm mt-1">{errors.travelDate.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="label">Package Inclusions</label>
            <textarea
              className={`input ${errors.packageInclusion ? 'border-red-500' : ''}`}
              rows={3}
              {...register('packageInclusion', { required: 'Package inclusions are required' })}
              placeholder="List what's included (e.g., accommodation, meals, transportation, sightseeing)"
            />
            {errors.packageInclusion && (
              <p className="text-red-500 text-sm mt-1">{errors.packageInclusion.message}</p>
            )}
          </div>

          <div>
            <label className="label">Package Exclusions</label>
            <textarea
              className={`input ${errors.packageExclusion ? 'border-red-500' : ''}`}
              rows={3}
              {...register('packageExclusion', { required: 'Package exclusions are required' })}
              placeholder="List what's not included (e.g., travel insurance, personal expenses, tips)"
            />
            {errors.packageExclusion && (
              <p className="text-red-500 text-sm mt-1">{errors.packageExclusion.message}</p>
            )}
          </div>

          <div>
            <label className="label">Additional Notes</label>
            <textarea
              className="input"
              rows={2}
              {...register('note')}
              placeholder="Any additional information or special requests"
            />
          </div>

          <div>
            <label className="label">Advance Policy</label>
            <textarea
              className={`input ${errors.advancePolicy ? 'border-red-500' : ''}`}
              rows={2}
              {...register('advancePolicy', { required: 'Advance policy is required' })}
              placeholder="e.g., 25% advance required at the time of booking"
            />
            {errors.advancePolicy && (
              <p className="text-red-500 text-sm mt-1">{errors.advancePolicy.message}</p>
            )}
          </div>

          <div>
            <label className="label">Cancellation Policy</label>
            <textarea
              className={`input ${errors.cancellationPolicy ? 'border-red-500' : ''}`}
              rows={2}
              {...register('cancellationPolicy', { required: 'Cancellation policy is required' })}
              placeholder="e.g., Full refund if cancelled 30 days before travel"
            />
            {errors.cancellationPolicy && (
              <p className="text-red-500 text-sm mt-1">{errors.cancellationPolicy.message}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="label flex items-center">
          <FileText size={16} className="mr-2" />
          Total Amount
        </label>
        <input
          type="number"
          className="input"
          {...register('totalAmount')}
          placeholder="0"
          step="0.01"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : quotation ? 'Update Quotation' : 'Create Quotation'}
        </button>

        <button
          type="button"
          onClick={handleGeneratePDF}
          className="btn btn-outline flex items-center justify-center gap-2 px-4"
          title="Generate PDF"
        >
          <Download size={18} />
          PDF
        </button>

        <button
          type="button"
          onClick={handleSendWhatsApp}
          className="btn btn-outline flex items-center justify-center gap-2 px-4 text-green-600 border-green-600 hover:bg-green-50"
          title="Send via WhatsApp"
        >
          <MessageCircle size={18} />
          WhatsApp
        </button>
      </div>
    </form>
  );
};

export default QuotationForm;