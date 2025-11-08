import api from './api'

// Auth
export const sendOTP = (phone) => api.post('/auth/send-otp', { phone })
export const verifyUser = (payload) => api.post('/auth/verify', payload)

// Farmer
export const farmerSummary = () => api.get('/farmer/dashboard/summary')
export const farmerNearby = (lng, lat, distance) => api.get('/farmer/nearby', { params: { lng, lat, distance } })
export const farmerStore = (params) => api.get('/farmer/store', { params })
export const farmerWeather = (params) => api.get('/farmer/weather', { params })
export const farmerPricePrediction = (params) => api.get('/farmer/price-prediction', { params })
export const listSchemes = (params) => api.get('/schemes', { params })

// Supplier
export const supplierSummary = () => api.get('/supplier/dashboard/summary')
export const listMyProducts = (params) => api.get('/products/me', { params })
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)
export const listAnnouncements = (audience) => api.get('/announcements', { params: { audience } })
export const sponsorListMine = () => api.get('/sponsor/me')
export const sponsorCreate = (data) => api.post('/sponsor', data)
export const sponsorUpdate = (id, data) => api.put(`/sponsor/${id}`, data)
export const sponsorDelete = (id) => api.delete(`/sponsor/${id}`)
export const supplierProfile = () => api.get('/supplier/me')
export const updateSupplierProfile = (data) => api.put('/supplier/me', data)
export const supplierCompany = () => api.get('/supplier/company')
export const updateSupplierCompany = (data) => api.put('/supplier/company', data)

// Messages
export const createMessage = (data) => api.post('/messages', data)
export const listThreads = (params) => api.get('/messages/threads', { params })
export const getThread = (threadId, params) => api.get(`/messages/thread/${threadId}`, { params })
export const markMessageRead = (id) => api.patch(`/messages/${id}/read`)

// Admin
export const adminOverview = () => api.get('/admin/overview')
export const adminFarmers = (params) => api.get('/admin/farmers', { params })
export const adminCompanies = (params) => api.get('/admin/companies', { params })
export const adminUpdateCompanyStatus = (id, status) => api.patch(`/admin/companies/${id}/status`, { status })
export const adminProducts = (params) => api.get('/admin/products', { params })
export const adminUpdateProductStatus = (id, status) => api.patch(`/admin/products/${id}/status`, { status })
export const adminPendingLands = () => api.get('/admin/lands/pending')
export const adminReviewLand = (id, action, note) => api.post(`/admin/lands/${id}/review`, { action, note })
export const adminReports = (params) => api.get('/admin/reports', { params })
export const adminCreateAnnouncement = (data) => api.post('/announcements/admin', data)
export const adminUpdateAnnouncement = (id, data) => api.put(`/announcements/admin/${id}`, data)
export const adminDeleteAnnouncement = (id) => api.delete(`/announcements/admin/${id}`)
export const adminCreateScheme = (data) => api.post('/schemes/admin', data)
export const adminUpdateScheme = (id, data) => api.put(`/schemes/admin/${id}`, data)
export const adminDeleteScheme = (id) => api.delete(`/schemes/admin/${id}`)
