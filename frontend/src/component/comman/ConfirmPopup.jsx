
import React from "react";

function ConfirmPopup({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[90%] max-w-sm rounded-xl bg-white p-6 shadow-xl">
        
        <h2 className="text-xl font-semibold text-gray-800">
          Confirm Logout
        </h2>

        <p className="mt-3 text-gray-600">
          Are you sure you want to logout?
        </p>

        <div className="mt-6 flex justify-end  gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-4 py-2 text-white text-center hover:bg-red-600"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default ConfirmPopup;

