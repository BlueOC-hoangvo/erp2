import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, unwrap } from "@/lib/api";

export type AuthUser = {
  id: number | string;
  email: string;
  fullName?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  permissions: string[];
  isLoading: boolean;
  // Auth methods
  login: (credentials: LoginInput) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  hydrateMe: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  setPermissions: (perms: string[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      permissions: [],
      isLoading: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setPermissions: (permissions) => set({ permissions }),
      setLoading: (loading) => set({ isLoading: loading }),

      login: async (credentials: LoginInput) => {
        set({ isLoading: true });
        try {
          const response = await unwrap<AuthResponse>(
            api.post("/auth/login", credentials)
          );
          const { accessToken, refreshToken, user } = response.data;
          set({ 
            accessToken, 
            refreshToken, 
            user, 
            permissions: [],
            isLoading: false 
          });
          
          // After successful login, hydrate user info
          await useAuthStore.getState().hydrateMe();
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      refresh: async () => {
        const currentRefreshToken = useAuthStore.getState().refreshToken;
        if (!currentRefreshToken) {
          throw new Error("No refresh token available");
        }

        try {
          const response = await unwrap<{ accessToken: string; refreshToken: string }>(
            api.post("/auth/refresh", { refreshToken: currentRefreshToken })
          );
          const { accessToken, refreshToken } = response.data;
          set({ accessToken, refreshToken });
        } catch (error) {
          // Refresh failed, logout
          useAuthStore.getState().logout();
          throw error;
        }
      },

      logout: async () => {
        try {
          const refreshToken = useAuthStore.getState().refreshToken;
          if (refreshToken) {
            await api.post("/auth/logout", { refreshToken });
          }
        } catch (error) {
          // Ignore logout errors
          console.warn("Logout request failed:", error);
        } finally {
          set({
            accessToken: null,
            refreshToken: null,
            user: null,
            permissions: [],
            isLoading: false,
          });
        }
      },

      hydrateMe: async () => {
        const { accessToken } = useAuthStore.getState();
        
        // Only try to get user info if we have an access token
        if (!accessToken) {
          console.log("No access token found, skipping hydrateMe");
          return;
        }

        try {
          const me = await unwrap(api.get("/me"));
          set({ user: me.data as any });

          // /me/permissions (nếu backend có)
          try {
            const perms = await unwrap<string[]>(api.get("/me/permissions"));
            set({ permissions: perms.data || [] });
          } catch {
            // optional
            set({ permissions: [] });
          }
        } catch (error: any) {
          // If /me fails with 401, clear auth state
          if (error?.response?.status === 401) {
            console.log("Token expired or invalid, clearing auth state");
            set({
              accessToken: null,
              refreshToken: null,
              user: null,
              permissions: [],
            });
          } else {
            console.warn("hydrateMe failed:", error);
          }
        }
      },
    }),
    {
      name: "erp-auth",
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
        permissions: s.permissions,
      }),
    }
  )
);
