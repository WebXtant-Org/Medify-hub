import React from 'react'

import { toast } from 'react-toastify'

export const showToast = (message, type = 'success', extraOptions = {}) => {
  const options = {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...extraOptions
  }

  if (type === 'error') {
    toast.error(message, options)
  } else if (type === 'warning') {
    toast.warning(message, options)
  } else if (type === 'info') {
    toast.info(message, options)
  } else {
    toast.success(message, options)
  }
}
