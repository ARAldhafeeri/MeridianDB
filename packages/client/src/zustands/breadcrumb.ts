import { create } from "zustand";

export interface BreadCrumbState {
  base: string;
  extra: string[];
  setExtra: (extra: string[]) => void;
}

export const useBreadCrumbs = create<BreadCrumbState>((set) => ({
  base: "/",
  extra: [],
  setExtra: (extra: string[]) => set({ extra: extra }),
}));
