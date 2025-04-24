"use client"

import { useEffect } from "react"

export function Modal({ isOpen, onClose,  positionTop, title, children }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50" onClick={onClose} />

      {/* Modal */}
      <div className={`fixed ${positionTop} left-[550px]  w-full max-w-[425px] bg-white rounded-lg shadow-lg z-60 p-6`}>
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {children}

        {/* Close button */}
        <button onClick={onClose} className="absolute cursor-pointer right-4 top-4 text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </>
  )
}

