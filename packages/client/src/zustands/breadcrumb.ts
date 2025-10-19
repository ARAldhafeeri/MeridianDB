import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface BreadCrumbState {
  base: string;
  extra: string[];
  setExtra: (extra: string[]) => void;
}

export const useBreadCrumbs = create<BreadCrumbState>()(
  persist(
    (set) => ({
      base: "admin",
      extra: [],
      setExtra: (extra: string[]) => set({ extra: extra }),
    }),
    {
      name: "breadcrupms-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
