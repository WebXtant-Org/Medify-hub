const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

export const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
  const headers = {
    ...options.headers
  }
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized (logout)
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      
      throw new Error(data.message || 'Something went wrong')
    }


    return data
  } catch (error) {
    console.error('API Call Error:', error)
    throw error
  }
}
