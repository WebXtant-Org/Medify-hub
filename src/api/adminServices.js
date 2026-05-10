import { apiClient } from './apiClient'

export const studentService = {
  getAll: () => apiClient('/users?role=student'),
  getById: (id) => apiClient(`/users/${id}`),
  create: (data) => apiClient('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiClient(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiClient(`/users/${id}`, { method: 'DELETE' })
}

export const courseService = {
  getAll: () => apiClient('/courses'),
  getById: (id) => apiClient(`/courses/${id}`),
  create: (data) => apiClient('/courses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiClient(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiClient(`/courses/${id}`, { method: 'DELETE' })
}

export const batchService = {
  getAll: () => apiClient('/batches'),
  getById: (id) => apiClient(`/batches/${id}`),
  create: (data) => apiClient('/batches', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiClient(`/batches/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiClient(`/batches/${id}`, { method: 'DELETE' })
}

export const paymentService = {
  getAll: () => apiClient('/payments'),
  create: (data) => apiClient('/payments', { method: 'POST', body: JSON.stringify(data) })
}

export const facultyService = {
  getAll: () => apiClient('/users?role=faculty'),
  create: (data) => apiClient('/users', { method: 'POST', body: JSON.stringify({ ...data, role: 'faculty' }) }),
  update: (id, data) => apiClient(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiClient(`/users/${id}`, { method: 'DELETE' })
}

export const testService = {
  getAll: () => apiClient('/tests'),
  create: (data) => apiClient('/tests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiClient(`/tests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiClient(`/tests/${id}`, { method: 'DELETE' })
}

export const logService = {
  getActivity: () => apiClient('/logs/activity'),
  getAudit: () => apiClient('/logs/audit')
}

export const reportService = {
  getStats: () => apiClient('/reports/stats'),
  getCharts: () => apiClient('/reports/charts')
}

export const notificationService = {
  getAll: () => apiClient('/notifications'),
  send: (data) => apiClient('/notifications', { method: 'POST', body: JSON.stringify(data) })
}

export const settingsService = {
  get: () => apiClient('/settings'),
  update: (data) => apiClient('/settings', { method: 'PUT', body: JSON.stringify(data) })
}

export const materialService = {
  getAll: () => apiClient('/materials'),
  getById: (id) => apiClient(`/materials/${id}`),
  create: (formData) => apiClient('/materials', { 
    method: 'POST', 
    body: formData 
  }),
  update: (id, data) => apiClient(`/materials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiClient(`/materials/${id}`, { method: 'DELETE' })
}
