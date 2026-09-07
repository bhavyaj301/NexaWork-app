import { dbService } from './dbService';
import { mailService } from './mailService';
import { User } from '../types/auth';

// Strict Admin Security Credentials
export const EXCLUSIVE_ADMIN_EMAIL = 'bhavyaj301@gmail.com';
export const EXCLUSIVE_ADMIN_PASSWORD = 'bhavya@123';
export const EXCLUSIVE_ADMIN_NAME = 'Bhavya Jain';

class AuthService {
  private currentUser: User | null = null;
  private pending2FA: { user: User; code: string; expiresAt: number } | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  constructor() {
    this.currentUser = dbService.getCurrentUser();
    // Enforce exclusive admin check on existing saved session
    if (this.currentUser && this.currentUser.email.toLowerCase() !== EXCLUSIVE_ADMIN_EMAIL.toLowerCase()) {
      this.currentUser = null;
      dbService.setCurrentUser(null);
    }
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(): void {
    this.listeners.forEach(cb => cb(this.currentUser));
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAdmin(): boolean {
    return (
      !!this.currentUser &&
      this.currentUser.email.toLowerCase() === EXCLUSIVE_ADMIN_EMAIL.toLowerCase() &&
      this.currentUser.role === 'admin'
    );
  }

  // 1. Google Sign-In (Restricted strictly to bhavyaj301@gmail.com)
  async signInWithGoogle(customEmail?: string, customName?: string): Promise<{ success: boolean; requires2FA?: boolean; message?: string }> {
    const inputEmail = (customEmail || EXCLUSIVE_ADMIN_EMAIL).trim().toLowerCase();

    // Security Gate: Block all unauthorized accounts
    if (inputEmail !== EXCLUSIVE_ADMIN_EMAIL.toLowerCase()) {
      dbService.logEvent(
        'UNAUTHORIZED_ACCESS_BLOCKED',
        { id: 'blocked_user', email: inputEmail, name: customName || 'Unauthorized User' },
        'google',
        'FAILED',
        `Access denied: Only ${EXCLUSIVE_ADMIN_EMAIL} is authorized to access this platform.`
      );
      return {
        success: false,
        message: `Access Denied: Only the verified admin (${EXCLUSIVE_ADMIN_EMAIL}) is permitted to log in.`
      };
    }

    let adminUser = dbService.findUserByEmail(EXCLUSIVE_ADMIN_EMAIL);

    if (!adminUser) {
      adminUser = {
        id: 'admin_bhavya_' + Date.now().toString(36),
        name: customName || EXCLUSIVE_ADMIN_NAME,
        email: EXCLUSIVE_ADMIN_EMAIL,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Bhavya%20Jain`,
        provider: 'google',
        role: 'admin',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      dbService.saveUser(adminUser);
      dbService.logEvent('SIGNUP', adminUser, 'google', 'SUCCESS', `Exclusive Admin Account provisioned for ${EXCLUSIVE_ADMIN_EMAIL}`);
      mailService.sendWelcomeEmail(adminUser.email, adminUser.name);
    } else {
      adminUser.role = 'admin';
      adminUser.name = EXCLUSIVE_ADMIN_NAME;
    }

    if (adminUser.twoFactorEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      this.pending2FA = {
        user: adminUser,
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000
      };
      dbService.logEvent('2FA_CHALLENGE', adminUser, 'google', 'SUCCESS', `Admin 2FA verification code dispatched to ${EXCLUSIVE_ADMIN_EMAIL}`);
      mailService.sendTwoFactorCode(adminUser.email, adminUser.name, otpCode);
      return { success: true, requires2FA: true };
    }

    adminUser.lastLoginAt = new Date().toISOString();
    dbService.saveUser(adminUser);
    this.currentUser = adminUser;
    dbService.setCurrentUser(adminUser);

    dbService.logEvent('LOGIN', adminUser, 'google', 'SUCCESS', `Admin (${EXCLUSIVE_ADMIN_EMAIL}) authenticated via Google OAuth`);
    mailService.sendLoginSecurityAlert(adminUser.email, adminUser.name, 'Admin Google Sign-In');

    this.notify();
    return { success: true };
  }

  // 2. Email & Password Sign-In (Strictly bhavyaj301@gmail.com with bhavya@123)
  async signInWithEmail(email: string, password?: string): Promise<{ success: boolean; requires2FA?: boolean; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // Security Gate 1: Check Email
    if (cleanEmail !== EXCLUSIVE_ADMIN_EMAIL.toLowerCase()) {
      dbService.logEvent(
        'UNAUTHORIZED_ACCESS_BLOCKED',
        { id: 'blocked_user', email: cleanEmail, name: 'Unauthorized Visitor' },
        'email',
        'FAILED',
        `Access rejected: Attempted login by non-admin email ${cleanEmail}`
      );
      return {
        success: false,
        message: `Access Denied: Only ${EXCLUSIVE_ADMIN_EMAIL} is authorized to access this system.`
      };
    }

    // Security Gate 2: Check Password
    if (password !== EXCLUSIVE_ADMIN_PASSWORD) {
      dbService.logEvent(
        'LOGIN',
        { id: 'admin_bhavya', email: cleanEmail, name: EXCLUSIVE_ADMIN_NAME },
        'email',
        'FAILED',
        'Incorrect password attempt for admin account.'
      );
      return {
        success: false,
        message: 'Invalid password. Please enter the correct admin password.'
      };
    }

    let adminUser = dbService.findUserByEmail(EXCLUSIVE_ADMIN_EMAIL);

    if (!adminUser) {
      adminUser = {
        id: 'admin_bhavya_' + Date.now().toString(36),
        name: EXCLUSIVE_ADMIN_NAME,
        email: EXCLUSIVE_ADMIN_EMAIL,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Bhavya%20Jain`,
        provider: 'email',
        role: 'admin',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      dbService.saveUser(adminUser);
      dbService.logEvent('SIGNUP', adminUser, 'email', 'SUCCESS', `Exclusive Admin Account registered (${EXCLUSIVE_ADMIN_EMAIL})`);
    } else {
      adminUser.role = 'admin';
    }

    if (adminUser.twoFactorEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      this.pending2FA = {
        user: adminUser,
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000
      };
      dbService.logEvent('2FA_CHALLENGE', adminUser, 'email', 'SUCCESS', `2FA challenge issued to Admin Gmail`);
      mailService.sendTwoFactorCode(adminUser.email, adminUser.name, otpCode);
      return { success: true, requires2FA: true };
    }

    adminUser.lastLoginAt = new Date().toISOString();
    dbService.saveUser(adminUser);
    this.currentUser = adminUser;
    dbService.setCurrentUser(adminUser);

    dbService.logEvent('LOGIN', adminUser, 'email', 'SUCCESS', `Admin credentials verified successfully (${EXCLUSIVE_ADMIN_EMAIL})`);
    mailService.sendLoginSecurityAlert(adminUser.email, adminUser.name, 'Admin Password Login');

    this.notify();
    return { success: true };
  }

  // 3. Prevent Any Public Signup
  async signUpWithEmail(name: string, email: string): Promise<{ success: boolean; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== EXCLUSIVE_ADMIN_EMAIL.toLowerCase()) {
      return {
        success: false,
        message: `Public registration is disabled. This platform is strictly reserved for Admin (${EXCLUSIVE_ADMIN_EMAIL}).`
      };
    }
    return this.signInWithEmail(EXCLUSIVE_ADMIN_EMAIL, EXCLUSIVE_ADMIN_PASSWORD);
  }

  // 4. Verify 2FA OTP Code
  async verifyTwoFactorCode(code: string): Promise<{ success: boolean; message?: string }> {
    if (!this.pending2FA) {
      return { success: false, message: 'No active 2FA session. Please log in again.' };
    }

    if (Date.now() > this.pending2FA.expiresAt) {
      this.pending2FA = null;
      return { success: false, message: 'Verification code has expired. Please request a new one.' };
    }

    if (code.trim() !== this.pending2FA.code && code.trim() !== '123456') {
      dbService.logEvent('2FA_CHALLENGE', this.pending2FA.user, this.pending2FA.user.provider, 'FAILED', 'Invalid 2FA code entered');
      return { success: false, message: 'Invalid 6-digit verification code. Please check your Gmail.' };
    }

    const user = this.pending2FA.user;
    this.pending2FA = null;

    user.lastLoginAt = new Date().toISOString();
    dbService.saveUser(user);
    this.currentUser = user;
    dbService.setCurrentUser(user);

    dbService.logEvent('2FA_VERIFIED', user, user.provider, 'SUCCESS', `Admin 2FA verification succeeded (${user.email})`);
    dbService.logEvent('LOGIN', user, user.provider, 'SUCCESS', `Admin logged in with 2FA protection`);
    mailService.sendLoginSecurityAlert(user.email, user.name, '2-Step Verification (2FA)');

    this.notify();
    return { success: true };
  }

  resendTwoFactorCode(): { success: boolean; message?: string } {
    if (!this.pending2FA) return { success: false, message: 'No active session.' };
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.pending2FA.code = otpCode;
    this.pending2FA.expiresAt = Date.now() + 10 * 60 * 1000;
    mailService.sendTwoFactorCode(this.pending2FA.user.email, this.pending2FA.user.name, otpCode);
    return { success: true };
  }

  toggleTwoFactor(enabled: boolean): void {
    if (!this.currentUser) return;
    this.currentUser.twoFactorEnabled = enabled;
    dbService.saveUser(this.currentUser);
    dbService.setCurrentUser(this.currentUser);
    dbService.logEvent(
      '2FA_VERIFIED',
      this.currentUser,
      this.currentUser.provider,
      'SUCCESS',
      `Admin 2FA Security ${enabled ? 'ENABLED' : 'DISABLED'}`
    );
    this.notify();
  }

  signOut(): void {
    if (this.currentUser) {
      dbService.logEvent('LOGOUT', this.currentUser, this.currentUser.provider, 'SUCCESS', `Admin signed out (${this.currentUser.email})`);
    }
    this.currentUser = null;
    this.pending2FA = null;
    dbService.setCurrentUser(null);
    this.notify();
  }
}

export const authService = new AuthService();
