import { User, AuditLog, EmailNotification } from '../types/auth';
import initialDatabaseData from '../data/database.json';

const STORAGE_KEYS = {
  USERS: 'nexawork_db_users',
  AUDIT_LOGS: 'nexawork_db_audit_logs',
  NOTIFICATIONS: 'nexawork_db_notifications',
  CURRENT_USER: 'nexawork_current_user',
};

export interface LocalDatabaseSchema {
  version: string;
  name: string;
  updatedAt: string;
  users: User[];
  audit_logs: AuditLog[];
  notifications: EmailNotification[];
}

class DatabaseService {
  constructor() {
    this.seedFromLocalFile();
  }

  // Seed default dataset from src/data/database.json if not present
  private seedFromLocalFile(): void {
    try {
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialDatabaseData.users || []));
      }
      if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
        localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(initialDatabaseData.audit_logs || []));
      }
      if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialDatabaseData.notifications || []));
      }
    } catch (e) {
      console.warn('Database initialization warning:', e);
    }
  }

  // Helper to read storage
  private getItem<T>(key: string, defaultVal: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  // Helper to persist storage & sync directly to src/data/database.json file via API
  private setItem<T>(key: string, val: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      this.syncToProjectDatabaseFile();
    } catch (e) {
      console.error('Error saving to DB:', e);
    }
  }

  // Write the full database state directly into src/data/database.json
  public async syncToProjectDatabaseFile(): Promise<void> {
    try {
      const payload: LocalDatabaseSchema = {
        version: '1.0.0',
        name: 'NexaWork Local Project Database',
        updatedAt: new Date().toISOString(),
        users: this.getUsers(),
        audit_logs: this.getAuditLogs(),
        notifications: this.getNotifications()
      };

      if (typeof window !== 'undefined') {
        await fetch('/api/sync-database', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});
      }
    } catch (e) {
      // Fallback silent sync
    }
  }

  // ── 1. USERS COLLECTION ──
  getUsers(): User[] {
    return this.getItem<User[]>(STORAGE_KEYS.USERS, (initialDatabaseData.users as User[]) || []);
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (index >= 0) {
      users[index] = { ...users[index], ...user };
    } else {
      users.unshift(user);
    }
    this.setItem(STORAGE_KEYS.USERS, users);
  }

  findUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  // ── 2. AUDIT LOGS (LOGIN, LOGOUT, 2FA, UNAUTHORIZED ATTEMPTS) ──
  getAuditLogs(): AuditLog[] {
    return this.getItem<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, (initialDatabaseData.audit_logs as AuditLog[]) || []);
  }

  logEvent(
    event: AuditLog['event'],
    user: { id: string; email: string; name: string },
    provider: AuditLog['provider'],
    status: AuditLog['status'] = 'SUCCESS',
    details?: string
  ): AuditLog {
    const logs = this.getAuditLogs();
    
    // Auto-detect browser/device metadata
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Server';
    let browser = 'Chrome (macOS)';
    if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';

    const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);
    const device = isMobile ? 'Mobile Device' : 'Apple Mac / Desktop';

    const newLog: AuditLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      event,
      provider,
      status,
      ipAddress: '127.0.0.1',
      device,
      browser,
      timestamp: new Date().toISOString(),
      details
    };

    logs.unshift(newLog);
    // Persist and write to database.json
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 150));
    return newLog;
  }

  clearAuditLogs(): void {
    this.setItem(STORAGE_KEYS.AUDIT_LOGS, []);
  }

  // ── 3. NOTIFICATIONS ──
  getNotifications(): EmailNotification[] {
    return this.getItem<EmailNotification[]>(STORAGE_KEYS.NOTIFICATIONS, (initialDatabaseData.notifications as EmailNotification[]) || []);
  }

  saveNotification(notification: EmailNotification): void {
    const list = this.getNotifications();
    list.unshift(notification);
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  markNotificationAsRead(id: string): void {
    const list = this.getNotifications().map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.setItem(STORAGE_KEYS.NOTIFICATIONS, list);
  }

  // ── 4. CURRENT AUTH SESSION ──
  getCurrentUser(): User | null {
    return this.getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
}

export const dbService = new DatabaseService();
