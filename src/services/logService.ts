export const logService = {
  async initUser(username: string, data: any) {
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

  async logMarketCreation(username: string, marketData: any) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          action: 'MARKET_CREATE',
          data: marketData,
        }),
      });
    } catch (error) {
      console.error('Failed to log market creation:', error);
    }
  },

  async verifyUser(username: string): Promise<any | null> {
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

  async getAllUsers(): Promise<any[]> {
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
