import { create } from "zustand";

export const useMainStore = create(set => ({
  user: null,
  toggleMenuStatus: false,

  setUser: user => {
    set({ userData: user });
  },
  toggleMenu: status => {
    set({ toggleMenuStatus: status });
  }
}));
