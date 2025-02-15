import { create } from "zustand";

export const useMainStore = create(set => ({
  user: null,
  setUser: user => {
    set({ user: user });
  },

  isMenuOpen: false,
  toggleMenu: status => {
    set({ isMenuOpen: status });
  },

  views: null,
  setViews: count => {
    set({ views: count });
  }
}));
