import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

// Define the user type based on your JWT payload
interface User {
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
  clearUser: () => set({ user: null }),
  setUserFromToken: (token: string) => {
    try {
      const decodedUser = jwtDecode<User>(token);
      set({ user: decodedUser });
    } catch (error) {
      console.error("Invalid token:", error);
      set({ user: null });
    }
  },
}));
