import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  User, 
  Phone, 
  Calendar, 
  IndianRupee,
  FileText,
  Calculator
} from 'lucide-react';
import { useQuotations } from '../../contexts/QuotationContext';
import ImageUpload from '../../components/ImageUpload';

interface QuotationItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  notes?: string;
}

interface QuotationFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  validUntil: string;
  items: QuotationItem[];
  terms: string;
  notes: string;
}

const CreateQuotation: React.FC = () => {
  const navigate = useNavigate();
  const { addQuotation } = useQuotations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [quotationData, setQuotationData] = useState<QuotationFormData | null>(null);
  const [createdQuotationId, setCreatedQuotationId] = useState<string>('');

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<QuotationFormData>({
    defaultValues: {
      items: [{ description: '', quantity: 1, unitPrice: 0, amount: 0, notes: '' }],
      terms: `• This quotation is valid for 15 days from the date of issue
• 50% advance payment required to confirm booking
• Balance payment due before travel date
• Prices are subject to availability at the time of booking
• Cancellation charges as per our policy
• All rates are inclusive of GST`,
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');

  // Calculate total amount
  const calculateTotal = () => {
    return watchedItems.reduce((total, item) => total + (item.amount || 0), 0);
  };

  // Update item amount when quantity or unit price changes
  const updateItemAmount = (index: number, field: 'quantity' | 'unitPrice', value: number) => {
    const currentItem = watchedItems[index];
    const quantity = field === 'quantity' ? value : currentItem.quantity;
    const unitPrice = field === 'unitPrice' ? value : currentItem.unitPrice;
    const amount = quantity * unitPrice;
    
    setValue(`items.${index}.${field}`, value);
    setValue(`items.${index}.amount`, amount);
  };

  const addItem = () => {
    append({ description: '', quantity: 1, unitPrice: 0, amount: 0, notes: '' });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: QuotationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create the quotation
      const quotationId = addQuotation({
        customerId: `CUST${String(Date.now()).slice(-6)}`,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        validUntil: data.validUntil,
        totalAmount: calculateTotal(),
        items: data.items,
        terms: data.terms,
        notes: data.notes
      });
      
      // Store quotation data for WhatsApp sending
      setQuotationData({ ...data });
      setCreatedQuotationId(quotationId);
      setShowWhatsAppModal(true);

    } catch (error) {
      alert('Error creating quotation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendQuotationViaWhatsApp = (whatsappNumber: string) => {
    if (!quotationData) return;

    const totalAmount = calculateTotal();

    const quotationMessage = `*QUOTATION FROM ALI TOURS & TRAVELS*

📋 *Quotation ID:* ${createdQuotationId}
👤 *Customer:* ${quotationData.customerName}
📅 *Date:* ${new Date().toLocaleDateString()}
⏰ *Valid Until:* ${new Date(quotationData.validUntil).toLocaleDateString()}

*QUOTATION DETAILS:*
${quotationData.items.map((item, index) => 
  `${index + 1}. ${item.description}
   Qty: ${item.quantity} | Rate: ₹${item.unitPrice.toLocaleString()} | Amount: ₹${item.amount.toLocaleString()}${item.notes ? `\n   Note: ${item.notes}` : ''}`
).join('\n\n')}

*TOTAL AMOUNT: ₹${totalAmount.toLocaleString()}*

*Terms & Conditions:*
${quotationData.terms.split('\n').map(term => term.trim()).filter(term => term).join('\n')}

${quotationData.notes ? `*Additional Notes:*\n${quotationData.notes}\n\n` : ''}For any queries or to confirm this quotation, please contact us:
📞 +91 78691-47222
📧 info@alitourstravels.in

Thank you for choosing Ali Tours & Travels! 🏝️`;

    const encodedMessage = encodeURIComponent(quotationMessage);
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const whatsappURL = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    setShowWhatsAppModal(false);
    
    // Navigate back to quotations list
    navigate('/admin/quotations');
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/quotations')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Create New Quotation</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            {/* Customer Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <User size={20} className="mr-2 text-primary-600" />
                Customer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Customer Name *</label>
                  <input
                    type="text"
                    className={`input ${errors.customerName ? 'border-red-500' : ''}`}
                    placeholder="Enter customer name"
                    {...register('customerName', { required: 'Customer name is required' })}
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Phone Number *</label>
                  <input
                    type="tel"
                    className={`input ${errors.customerPhone ? 'border-red-500' : ''}`}
                    placeholder="+91 9876543210"
                    {...register('customerPhone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[+]?[0-9\s-()]+$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                  />
                  {errors.customerPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="customer@example.com"
                    {...register('customerEmail')}
                  />
                </div>

                <div>
                  <label className="label flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    className={`input ${errors.validUntil ? 'border-red-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                    {...register('validUntil', { required: 'Validity date is required' })}
                  />
                  {errors.validUntil && (
                    <p className="text-red-500 text-sm mt-1">{errors.validUntil.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quotation Items */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <FileText size={20} className="mr-2 text-primary-600" />
                  Quotation Items
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="btn btn-outline py-2 px-4 flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Item
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="label">Description *</label>
                        <input
                          type="text"
                          className="input"
                          placeholder="e.g., Andaman Explorer Package (5 Days)"
                          {...register(`items.${index}.description`, { required: true })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="label">Quantity *</label>
                        <input
                          type="number"
                          min="1"
                          className="input"
                          {...register(`items.${index}.quantity`, { 
                            required: true,
                            min: 1,
                            onChange: (e) => updateItemAmount(index, 'quantity', parseInt(e.target.value) || 0)
                          })}
                        />
                      </div>

                      <div>
                        <label className="label">Unit Price (₹) *</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="input"
                          {...register(`items.${index}.unitPrice`, { 
                            required: true,
                            min: 0,
                            onChange: (e) => updateItemAmount(index, 'unitPrice', parseFloat(e.target.value) || 0)
                          })}
                        />
                      </div>

                      <div>
                        <label className="label">Amount (₹)</label>
                        <input
                          type="number"
                          className="input bg-gray-50"
                          {...register(`items.${index}.amount`)}
                          readOnly
                        />
                      </div>
                    </div>

                    <div>
                      <label className="label">Item Notes</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Additional notes for this item"
                        {...register(`items.${index}.notes`)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Amount */}
              <div className="mt-6 bg-primary-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold flex items-center">
                    <Calculator size={20} className="mr-2 text-primary-600" />
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
              <textarea
                className="input h-32"
                placeholder="Enter terms and conditions..."
                {...register('terms')}
              />
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
              <textarea
                className="input h-24"
                placeholder="Any additional notes or special instructions..."
                {...register('notes')}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Make sure all required fields are filled before creating the quotation
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/quotations')}
                  className="btn btn-outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center"
                  disabled={isSubmitting || calculateTotal() === 0}
                >
                  {isSubmitting ? (
                    'Creating Quotation...'
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Create Quotation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* WhatsApp Send Modal */}
      {showWhatsAppModal && quotationData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="bg-green-600 text-white px-6 py-4">
              <h3 className="text-xl font-semibold">Quotation Created Successfully!</h3>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Your quotation has been created and added to the quotation management system. Would you like to send it via WhatsApp?
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p><strong>Quotation ID:</strong> {createdQuotationId}</p>
                  <p><strong>Customer:</strong> {quotationData.customerName}</p>
                  <p><strong>Total Amount:</strong> ₹{calculateTotal().toLocaleString()}</p>
                  <p><strong>Valid Until:</strong> {new Date(quotationData.validUntil).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="label">WhatsApp Number</label>
                  <input
                    type="tel"
                    className="input"
                    defaultValue={quotationData.customerPhone}
                    id="whatsapp-number"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowWhatsAppModal(false);
                    navigate('/admin/quotations');
                  }}
                  className="btn btn-outline flex-1"
                >
                  Skip for Now
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('whatsapp-number') as HTMLInputElement;
                    sendQuotationViaWhatsApp(input.value);
                  }}
                  className="btn bg-green-600 text-white hover:bg-green-700 flex-1"
                >
                  <Send size={16} className="mr-2" />
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuotation;