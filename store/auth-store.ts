import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
	email: string;
	name: string;
	role: "admin" | "user";
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	logout: () => void;
	checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	login: async (email, password) => {
		// Mock authentication - in a real app this would call an API
		// For demo purposes, accept any email ending in @hscgroup.org or admin credentials
		if (
			(email === "admin@hscgroup.org" && password === "admin") ||
			email.endsWith("@hscgroup.org") // Allow generic access for checking
		) {
			const user: User = {
				email,
				name: "Admin User",
				role: "admin",
			};

			// Set cookie that expires in 1 day
			Cookies.set("auth_token", "mock-jwt-token", { expires: 1 });
			Cookies.set("user_info", JSON.stringify(user), { expires: 1 });

			set({ user, isAuthenticated: true });
			return true;
		}
		return false;
	},
	logout: () => {
		Cookies.remove("auth_token");
		Cookies.remove("user_info");
		set({ user: null, isAuthenticated: false });
	},
	checkAuth: () => {
		const token = Cookies.get("auth_token");
		const userInfo = Cookies.get("user_info");

		if (token && userInfo) {
			try {
				set({
					isAuthenticated: true,
					user: JSON.parse(userInfo),
					isLoading: false,
				});
			} catch (e) {
				set({ isAuthenticated: false, user: null, isLoading: false });
			}
		} else {
			set({ isAuthenticated: false, user: null, isLoading: false });
		}
	},
}));
