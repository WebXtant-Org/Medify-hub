import React from 'react'

import { toast } from 'react-toastify'

export const showToast = (message, type = 'success') => {
  const options = {
    icon: type === 'success' ? <span>👏</span> : type === 'error' ? <span>❌</span> : <span>ℹ️</span>,
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  }

  if (type === 'error') {
    toast.error(message, options)
  } else {
    toast(message, options)
  }
}
