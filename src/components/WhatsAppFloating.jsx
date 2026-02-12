import React from 'react'
import './WhatsAppFloating.css'

const WhatsAppFloating = ({ phone, message = "Hi! I'm interested in your courses." }) => {
  const sanitizedPhone = (phone || '').replace(/[^\d]/g, '')
  const href =
    sanitizedPhone.length > 0
      ? `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`
      : 'https://wa.me/'

  return (
    <a
      className="whatsapp-floating"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg
        className="whatsapp-floating__icon"
        viewBox="0 0 32 32"
        role="img"
        aria-hidden="true"
      >
        <path
          d="M16 2.5C8.55 2.5 2.5 8.55 2.5 16c0 2.6.73 5.03 2 7.1L3 29l6.08-1.55A13.4 13.4 0 0 0 16 29.5c7.45 0 13.5-6.05 13.5-13.5S23.45 2.5 16 2.5Zm0 24.4c-2.12 0-4.1-.62-5.76-1.69l-.41-.25-3.6.91.96-3.5-.27-.44A10.86 10.86 0 0 1 5.2 16C5.2 9.98 9.98 5.2 16 5.2c6.02 0 10.8 4.78 10.8 10.8 0 6.02-4.78 10.9-10.8 10.9Zm6.26-7.69c-.34-.17-2.01-.99-2.32-1.1-.31-.12-.54-.17-.77.17-.22.34-.88 1.1-1.08 1.32-.2.22-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.7-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.22-.34.34-.57.11-.22.06-.42-.03-.6-.08-.17-.77-1.85-1.06-2.53-.28-.67-.56-.58-.77-.6l-.66-.01c-.22 0-.6.08-.91.42-.31.34-1.2 1.17-1.2 2.86 0 1.69 1.23 3.32 1.4 3.55.17.22 2.42 3.7 5.86 5.19.82.35 1.45.56 1.95.72.82.26 1.56.22 2.15.13.66-.1 2.01-.82 2.29-1.61.28-.79.28-1.47.2-1.61-.09-.14-.31-.22-.65-.39Z"
          fill="currentColor"
        />
      </svg>
    </a>
  )
}

export default WhatsAppFloating
