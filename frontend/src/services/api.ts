import axios from 'axios';
import type {
  RFP,
  Vendor,
  Proposal,
  ProposalComparison,
  CreateRFPRequest,
  CreateRFPResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// RFP API
export const rfpAPI = {
  create: async (data: CreateRFPRequest): Promise<CreateRFPResponse> => {
    const response = await api.post<CreateRFPResponse>('/rfps', data);
    return response.data;
  },

  getAll: async (): Promise<{ rfps: RFP[] }> => {
    const response = await api.get('/rfps');
    return response.data;
  },

  getById: async (id: string): Promise<{ rfp: RFP; vendors: any[]; proposals: Proposal[] }> => {
    const response = await api.get(`/rfps/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/rfps/${id}`);
  },
};

// Vendor API
export const vendorAPI = {
  create: async (data: Partial<Vendor>): Promise<{ vendor: Vendor }> => {
    const response = await api.post('/vendors', data);
    return response.data;
  },

  getAll: async (): Promise<{ vendors: Vendor[] }> => {
    const response = await api.get('/vendors');
    return response.data;
  },

  getById: async (id: string): Promise<{ vendor: Vendor }> => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Vendor>): Promise<{ vendor: Vendor }> => {
    const response = await api.put(`/vendors/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/vendors/${id}`);
  },

  sendRFP: async (rfpId: string, vendorIds: string[]): Promise<void> => {
    await api.post('/rfps/send', { rfpId, vendorIds });
  },
};

// Proposal API
export const proposalAPI = {
  getByRFP: async (rfpId: string): Promise<{ proposals: Proposal[] }> => {
    const response = await api.get(`/proposals/rfp/${rfpId}`);
    return response.data;
  },

  getById: async (id: string): Promise<{ proposal: Proposal }> => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },

  compare: async (rfpId: string): Promise<ProposalComparison> => {
    const response = await api.get(`/proposals/compare/${rfpId}`);
    return response.data;
  },

  checkNew: async (): Promise<void> => {
    await api.post('/proposals/check');
  },
};

export default api;
