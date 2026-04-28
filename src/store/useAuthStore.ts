import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'ADMIN' | 'BMC' | null;

interface AuthState {
  isAdmin: boolean;
  userRole: UserRole;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAdmin: false,
      userRole: null,
      login: (email, password) => {
        if (email === 'admin@gmail.com' && password === 'admin123') {
          set({ isAdmin: true, userRole: 'ADMIN' });
          return true;
        }
        if (email === 'bmc@gmail.com' && password === 'bmc123') {
          set({ isAdmin: true, userRole: 'BMC' });
          return true;
        }
        return false;
      },
      logout: () => set({ isAdmin: false, userRole: null }),
    }),
    {
      name: 'ciclo-auth-storage',
    }
  )
);
