export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email' | 'guest';
  twoFactorEnabled: boolean;
  role: 'admin' | 'user';
  createdAt: string;
  lastLoginAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  event: 'LOGIN' | 'LOGOUT' | 'SIGNUP' | '2FA_CHALLENGE' | '2FA_VERIFIED' | 'PASSWORD_RESET' | 'UNAUTHORIZED_ACCESS_BLOCKED';
  provider: 'google' | 'email' | 'guest';
  status: 'SUCCESS' | 'FAILED';
  ipAddress: string;
  device: string;
  browser: string;
  timestamp: string;
  details?: string;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  category: 'SECURITY' | '2FA_CODE' | 'WELCOME' | 'TREND_ALERT';
  body: string;
  sentAt: string;
  isRead: boolean;
  status: 'DELIVERED' | 'SENT';
}
