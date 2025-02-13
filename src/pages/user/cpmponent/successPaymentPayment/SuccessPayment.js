import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



function SuccessPayment() {
  const navigate = useNavigate();
  useEffect(() => {
    const paymentId=localStorage.getItem('paymentId')
    exportBill(paymentId)
    
    }, [])

const exportBill = async (paymentId) => {
  try {
      const response = await fetch(`${process.env.REACT_APP_BACS_URL}/payment?paymentId=${paymentId}&format=pdf`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
      });

      if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          // Download the bill directly
          const a = document.createElement('a');
          a.href = url;
          a.download = `bill_${paymentId}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          // Clean up the URL object
          window.URL.revokeObjectURL(url);
      } else {
          throw new Error('Failed to fetch the PDF');
      }
  } catch (error) {
      console.error("Error exporting bill:", error);
  }
};

const handleBackToHome = () => {
  navigate('/User'); // Navigate to the home page
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
      <p className="text-gray-700 mb-6">Thank you for your purchase. Your payment was successful.</p>
      <button
        onClick={handleBackToHome}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Back to Home
      </button>
    </div>
  </div>
  )
}

export default SuccessPayment