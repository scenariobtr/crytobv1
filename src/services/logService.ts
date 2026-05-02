import type { User } from "@/data/mockUsers";
import type { Thread } from "@/modules/market/service";

export type LoggedUser = User & {
  phone?: string;
  displayName?: string;
  avatar?: string;
  joinedAt?: string;
};

export const logService = {
  async initUser(username: string, data: LoggedUser) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, action: 'INIT', data }),
      });
    } catch (error) {
      console.error('Failed to init user log:', error);
    }
  },

  async logTransaction(username: string, type: string, amount: number, detail: string) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          action: 'TRANSACTION',
          data: { type, amount, detail },
        }),
      });
    } catch (error) {
      console.error('Failed to log transaction:', error);
    }
  },

  async logLogin(username: string, ip: string = '127.0.0.1') {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          action: 'LOGIN',
          data: { ip },
        }),
      });
    } catch (error) {
      console.error('Failed to log login:', error);
    }
  },

  async logMarketCreation(username: string, marketData: Thread): Promise<boolean> {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          action: 'MARKET_CREATE',
          data: marketData,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to log market creation:', error);
      return false;
    }
  },

  async getMarkets(): Promise<Thread[]> {
    try {
      const response = await fetch('/api/logs?markets=true', { cache: 'no-store' });
      if (!response.ok) return [];
      const data: unknown = await response.json();
      if (!data || typeof data !== 'object' || !Array.isArray((data as { markets?: unknown }).markets)) return [];
      return (data as { markets: Thread[] }).markets;
    } catch (error) {
      console.error('Failed to get markets:', error);
      return [];
    }
  },

  async verifyUser(username: string): Promise<LoggedUser | null> {
    try {
      const response = await fetch(`/api/logs?username=${username}&verify=true`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.userData || null;
    } catch (error) {
      console.error('Failed to verify user:', error);
      return null;
    }
  },

  async getAllUsers(): Promise<LoggedUser[]> {
    try {
      const response = await fetch('/api/logs?all_users=true');
      if (!response.ok) return [];
      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Failed to get all users:', error);
      return [];
    }
  },

  async getUserLog(username: string): Promise<string | null> {
    try {
      const response = await fetch(`/api/logs?username=${username}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Failed to get user log:', error);
      return null;
    }
  }
};
