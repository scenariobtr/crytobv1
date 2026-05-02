"use client";

import { User } from "@/data/mockUsers";

export const authService = {
  login: (username: string, users: User[]): User | null => {
    try {
      const user = users.find(u => u.username === username);
      if (user) {
        localStorage.setItem("current_user_id", user.id);
        return user;
      }
    } catch (err) {
      console.warn("Login storage error:", err);
    }
    return null;
  },

  logout: () => {
    try {
      localStorage.removeItem("current_user_id");
    } catch (err) {
      console.warn("Logout storage error:", err);
    }
  },

  getCurrentSession: (users: User[]): User | null => {
    try {
      const id = localStorage.getItem("current_user_id");
      return users.find(u => u.id === id) || null;
    } catch (err) {
      console.warn("Get session storage error:", err);
      return null;
    }
  }
};
