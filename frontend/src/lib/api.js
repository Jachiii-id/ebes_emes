import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const apiService = {
  // Devices
  getDevices: () => 
    api.get('/devices').then(res => res.data),

  getDevice: (deviceId) => 
    api.get(`/devices/${deviceId}`).then(res => res.data),

  calibrateSensor: (deviceId) => 
    api.post(`/calibrate/${deviceId}`).then(res => res.data),

  // Air Data
  getAllAirData: () => 
    api.get(`/data/air`).then(res => res.data),

  getAirData: (deviceId) => 
    api.get(`/data/air/${deviceId}`).then(res => res.data),

  getLatestAirData: (deviceId) => 
    api.get(`/data/air/${deviceId}/latest`).then(res => res.data),

  // GPS Data
  getAllGpsData: () => 
    api.get(`/data/gps`).then(res => res.data),

  getGpsData: (deviceId) => 
    api.get(`/data/gps/${deviceId}`).then(res => res.data),

  getLatestGpsData: (deviceId) => 
    api.get(`/data/gps/${deviceId}/latest`).then(res => res.data),
};
