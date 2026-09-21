import { create } from 'zustand';

interface NegocioUIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useNegocioStore = create<NegocioUIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
