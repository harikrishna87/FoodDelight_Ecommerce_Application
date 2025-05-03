interface SuccessMessageProps {
  show: boolean;
  onHide: () => void;
  countdownValue: number;
}

export default function SuccessMessage({ show, onHide, countdownValue }: SuccessMessageProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onHide}></div>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10 text-center">
        <div className="success-icon-container mb-4">
          <div className="success-icon flex items-center justify-center h-16 w-16 rounded-full bg-green-500 mx-auto">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Order Placed Successfully!
        </h3>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your delicious food will be prepared shortly.
        </p>
        
        <button 
          onClick={onHide}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition-colors duration-200"
        >
          Continue Shopping
        </button>
        
        <div className="mt-4">
          <small className="text-gray-500">
            This window will close in {countdownValue} seconds
          </small>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        
        .success-icon {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}