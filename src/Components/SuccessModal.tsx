import React from 'react';
import { CheckCircle, ShoppingBag } from 'lucide-react';

interface SuccessModalProps {
  show: boolean;
  onHide: () => void;
  countdownValue: number;
}

export default function SuccessModal({ show, onHide, countdownValue }: SuccessModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 rounded-full p-4 inline-flex items-center justify-center">
              <CheckCircle className="text-white" size={32} />
            </div>
          </div>
          
          <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: 'Times New Roman, serif' }}>
            Order Placed Successfully!
          </h3>
          
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Times New Roman, serif' }}>
            Thank you for your order. We've received your payment and will start 
            preparing your delicious food right away.
          </p>
          
          <button 
            onClick={onHide}
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 flex items-center justify-center mx-auto"
            style={{ fontFamily: 'Times New Roman, serif' }}
          >
            <ShoppingBag className="mr-2" size={20} />
            <span>Continue Shopping</span>
          </button>
          
          <div className="mt-4">
            <small className="text-gray-500 italic" style={{ fontFamily: 'Times New Roman, serif' }}>
              This window will close in {countdownValue} seconds
            </small>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(22, 163, 74, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
          }
        }
        
        .bg-green-600 {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}