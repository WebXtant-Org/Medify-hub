import { apiClient } from './apiClient'

export const studentTestService = {
  getTestDetails: (id) => apiClient(`/tests/${id}`),
  getQuestions: (id) => apiClient(`/tests/${id}/questions`),
  saveAnswer: (data) => apiClient('/answers', { method: 'POST', body: JSON.stringify(data) }),
  submitTest: (data) => apiClient('/tests/submit', { method: 'POST', body: JSON.stringify(data) })
}

export const studentService = {
  getProfile: () => apiClient('/auth/me'),
  getMaterials: () => apiClient('/materials'),
  getMaterialById: (id) => apiClient(`/materials/${id}`)
}

export const folderService = {
  getAll: (courseId) => apiClient(courseId ? `/folders?courseId=${courseId}` : '/folders'),
  create: (data) => apiClient('/folders', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
