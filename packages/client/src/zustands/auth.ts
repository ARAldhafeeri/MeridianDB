import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  // Add other properties from your JWT payload
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setUserFromToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      clearUser: () => set({ user: null }),
      setUserFromToken: (token: string) => {
        try {
          const decodedUser = jwtDecode<User>(token);
          set({ user: decodedUser });
        } catch (error) {
          set({ user: null });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
