import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const getShows = () => api.get('/shows');
export const getShowSeats = (id: number) => api.get(`/shows/${id}/seats`);
export const createShow = (data: { name: string; startTime: string; totalSeats: number }) => api.post('/admin/shows', data);
export const bookSeats = (showId: number, data: { userId: string; seatIds: number[] }) => api.post(`/shows/${showId}/book`, data);
