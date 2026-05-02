"use client";

import { User } from "@/data/mockUsers";

const SESSION_USER_ID_KEY = "current_user_id";
const SESSION_USER_PROFILE_KEY = "current_user_profile";

const readStoredUser = (): User | null => {
  try {
    const storedProfile = localStorage.getItem(SESSION_USER_PROFILE_KEY);
    if (!storedProfile) return null;
    return JSON.parse(storedProfile) as User;
  } catch (err) {
    console.warn("Stored session profile is unavailable:", err);
    return null;
  }
};

export const authService = {
  login: (username: string, users: User[]): User | null => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return null;

    try {
      localStorage.setItem(SESSION_USER_ID_KEY, user.id);
      localStorage.setItem(SESSION_USER_PROFILE_KEY, JSON.stringify(user));
    } catch (err) {
      console.warn("Login storage error:", err);
    }

    return user;
  },

  logout: () => {
    try {
      localStorage.removeItem(SESSION_USER_ID_KEY);
      localStorage.removeItem(SESSION_USER_PROFILE_KEY);
    } catch (err) {
      console.warn("Logout storage error:", err);
    }
  },

  getCurrentSession: (users: User[]): User | null => {
    try {
      const id = localStorage.getItem(SESSION_USER_ID_KEY);
      const matchedMockUser = users.find(u => u.id === id);
      if (matchedMockUser) return matchedMockUser;

      const storedUser = readStoredUser();
      return storedUser && storedUser.id === id ? storedUser : null;
    } catch (err) {
      console.warn("Get session storage error:", err);
      return readStoredUser();
    }
  }
};
