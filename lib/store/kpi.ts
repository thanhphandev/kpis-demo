'use client';

import { create } from 'zustand';

interface KPI {
  _id: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
  assignedTo: any;
  departmentId: any;
  createdBy: any;
  category?: string;
  completionPercentage: number;
  history: any[];
  createdAt: string;
  updatedAt: string;
}

interface KPIState {
  kpis: KPI[];
  selectedKPI: KPI | null;
  isLoading: boolean;
  filters: {
    status?: string;
    priority?: string;
    department?: string;
    assignedTo?: string;
  };
  setKPIs: (kpis: KPI[]) => void;
  addKPI: (kpi: KPI) => void;
  updateKPI: (id: string, updates: Partial<KPI>) => void;
  deleteKPI: (id: string) => void;
  setSelectedKPI: (kpi: KPI | null) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: any) => void;
  getFilteredKPIs: () => KPI[];
}

export const useKPIStore = create<KPIState>((set, get) => ({
  kpis: [],
  selectedKPI: null,
  isLoading: false,
  filters: {},
  
  setKPIs: (kpis) => set({ kpis }),
  
  addKPI: (kpi) => set((state) => ({ kpis: [...state.kpis, kpi] })),
  
  updateKPI: (id, updates) =>
    set((state) => ({
      kpis: state.kpis.map((kpi) => (kpi._id === id ? { ...kpi, ...updates } : kpi)),
    })),
    
  deleteKPI: (id) =>
    set((state) => ({
      kpis: state.kpis.filter((kpi) => kpi._id !== id),
    })),
    
  setSelectedKPI: (kpi) => set({ selectedKPI: kpi }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setFilters: (filters) => set({ filters }),
  
  getFilteredKPIs: () => {
    const { kpis, filters } = get();
    return kpis.filter((kpi) => {
      if (filters.status && kpi.status !== filters.status) return false;
      if (filters.priority && kpi.priority !== filters.priority) return false;
      if (filters.department && kpi.departmentId._id !== filters.department) return false;
      if (filters.assignedTo && kpi.assignedTo._id !== filters.assignedTo) return false;
      return true;
    });
  },
}));