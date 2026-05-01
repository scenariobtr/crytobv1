"use client";

import { User } from "@/data/mockUsers";

export const authService = {
  login: (username: string, users: User[]): User | null => {
    const user = users.find(u => u.username === username);
    if (user) {
      localStorage.setItem("current_user_id", user.id);
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem("current_user_id");
  },

  getCurrentSession: (users: User[]): User | null => {
    const id = localStorage.getItem("current_user_id");
    return users.find(u => u.id === id) || null;
  }
};
