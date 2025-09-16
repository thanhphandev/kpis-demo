'use client';

import { useAuthStore } from '@/lib/store/auth';

class APIClient {
  private baseURL = '/api';

  private async request(endpoint: string, options: RequestInit = {}) {
    const { accessToken } = useAuthStore.getState();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // KPI endpoints
  async getKPIs(params?: any) {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/kpis${query}`);
  }

  async createKPI(kpiData: any) {
    return this.request('/kpis', {
      method: 'POST',
      body: JSON.stringify(kpiData),
    });
  }

  async updateKPI(id: string, updates: any) {
    return this.request(`/kpis/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteKPI(id: string) {
    return this.request(`/kpis/${id}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updates: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Department endpoints
  async getDepartments() {
    return this.request('/departments');
  }

  async createDepartment(departmentData: any) {
    return this.request('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
  }

  // Dashboard endpoints
  async getDashboardData() {
    return this.request('/dashboard');
  }

  // Notifications endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }
}

export const apiClient = new APIClient();