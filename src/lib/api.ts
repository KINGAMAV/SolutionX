import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token management
export const setAuthToken = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
  localStorage.removeItem('authToken');
};

// Restore token on page load
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

// API endpoints
export const apiEndpoints = {
  // Auth
  signup: (data: any) => apiClient.post('/auth/signup', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),

  // Resident
  getDashboard: () => apiClient.get('/resident/dashboard'),
  getOrders: () => apiClient.get('/resident/orders'),
  getOrderById: (id: string) => apiClient.get(`/resident/orders/${id}`),
  createOrder: (data: any) => apiClient.post('/resident/orders', data),
  getArtisans: () => apiClient.get('/resident/artisans'),
  requestArtisan: (data: any) => apiClient.post('/resident/artisans/request', data),
  getArtisanRequests: () => apiClient.get('/resident/artisans/requests'),
  getProfile: () => apiClient.get('/resident/profile'),
  updateProfile: (data: any) => apiClient.put('/resident/profile', data),

  // Shop
  getShopProducts: (shopId: string) => apiClient.get(`/shop/products/${shopId}`),
  getShopOrders: () => apiClient.get('/shop/orders'),
  updateOrderStatus: (orderId: string, status: string) =>
    apiClient.put(`/shop/orders/${orderId}`, { status }),

  // Courier
  getAvailableMissions: () => apiClient.get('/courier/missions'),
  acceptMission: (missionId: string) => apiClient.post(`/courier/missions/${missionId}/accept`),
  updateLocation: (lat: number, lng: number) =>
    apiClient.post('/courier/location', { lat, lng }),
};

export default apiClient;
