import React from 'react';
import { IndianRupee } from 'lucide-react';
import { useInvoices } from '../contexts/InvoiceContext';
import { useAuth } from '../contexts/AuthContext';

interface PaymentButtonProps {
  amount: number;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: any) => void;
  booking?: any;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  booking
}) => {
  const { generateInvoice } = useInvoices();
  const { user } = useAuth();
  
  const handlePayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: import.meta.env.VITE_MERCHANT_NAME,
      description: `Payment for Order ${orderId}`,
      order_id: orderId,
      handler: (response: any) => {
        // Generate invoice after successful payment
        if (booking && user) {
          generateInvoice(booking, user);
        }
        onSuccess(response);
      },
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      notes: {
        address: "Ali Tours & Travels, Bilaspur"
      },
      theme: {
        color: "#0369A1"
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <button
      onClick={handlePayment}
      className="btn btn-primary w-full flex items-center justify-center"
    >
      <IndianRupee size={18} className="mr-2" />
      Pay ₹{amount.toLocaleString()}
    </button>
  );
};

export default PaymentButton;