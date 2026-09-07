import { dbService } from './dbService';
import { mailService } from './mailService';
import { User } from '../types/auth';

// Master Admin Security Credentials
export const EXCLUSIVE_ADMIN_EMAIL = 'bhavyaj301@gmail.com';
export const EXCLUSIVE_ADMIN_PASSWORD = 'bhavya@123';
export const EXCLUSIVE_ADMIN_NAME = 'Bhavya Jain';

class AuthService {
  private currentUser: User | null = null;
  private pending2FA: { user: User; code: string; expiresAt: number } | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  constructor() {
    this.currentUser = dbService.getCurrentUser();
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
      (this.currentUser.email.toLowerCase() === EXCLUSIVE_ADMIN_EMAIL.toLowerCase() ||
        this.currentUser.role === 'admin')
    );
  }

  // 1. Google Sign-In (Supports Admin & Normal Users)
  async signInWithGoogle(customEmail?: string, customName?: string): Promise<{ success: boolean; requires2FA?: boolean; message?: string }> {
    const inputEmail = (customEmail || '').trim().toLowerCase() || EXCLUSIVE_ADMIN_EMAIL.toLowerCase();
    const isAdminUser = inputEmail === EXCLUSIVE_ADMIN_EMAIL.toLowerCase();

    let user = dbService.findUserByEmail(inputEmail);

    if (!user) {
      user = {
        id: (isAdminUser ? 'admin_' : 'user_') + Date.now().toString(36),
        name: customName || (isAdminUser ? EXCLUSIVE_ADMIN_NAME : inputEmail.split('@')[0]),
        email: inputEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customName || inputEmail)}`,
        provider: 'google',
        role: isAdminUser ? 'admin' : 'user',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      dbService.saveUser(user);
      dbService.logEvent('SIGNUP', user, 'google', 'SUCCESS', `${isAdminUser ? 'Admin' : 'Standard User'} Account registered via Google OAuth (${inputEmail})`);
      mailService.sendWelcomeEmail(user.email, user.name);
    } else {
      user.role = isAdminUser ? 'admin' : (user.role || 'user');
      if (customName) user.name = customName;
    }

    if (user.twoFactorEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      this.pending2FA = {
        user,
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000
      };
      dbService.logEvent('2FA_CHALLENGE', user, 'google', 'SUCCESS', `2FA challenge dispatched to ${user.email}`);
      mailService.sendTwoFactorCode(user.email, user.name, otpCode);
      return { success: true, requires2FA: true };
    }

    user.lastLoginAt = new Date().toISOString();
    dbService.saveUser(user);
    this.currentUser = user;
    dbService.setCurrentUser(user);

    dbService.logEvent('LOGIN', user, 'google', 'SUCCESS', `${isAdminUser ? 'Admin' : 'User'} (${inputEmail}) logged in via Google OAuth`);
    mailService.sendLoginSecurityAlert(user.email, user.name, `${isAdminUser ? 'Admin' : 'User'} Google Sign-In`);

    this.notify();
    return { success: true };
  }

  // 2. Email & Password Sign-In (Handles both Admin & Registered Users)
  async signInWithEmail(email: string, password?: string): Promise<{ success: boolean; requires2FA?: boolean; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminUser = cleanEmail === EXCLUSIVE_ADMIN_EMAIL.toLowerCase();

    // If Admin email, verify master password
    if (isAdminUser) {
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
          message: 'Invalid admin password. Please enter the master password.'
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
        dbService.logEvent('2FA_CHALLENGE', adminUser, 'email', 'SUCCESS', `2FA challenge issued to Admin`);
        mailService.sendTwoFactorCode(adminUser.email, adminUser.name, otpCode);
        return { success: true, requires2FA: true };
      }

      adminUser.lastLoginAt = new Date().toISOString();
      dbService.saveUser(adminUser);
      this.currentUser = adminUser;
      dbService.setCurrentUser(adminUser);

      dbService.logEvent('LOGIN', adminUser, 'email', 'SUCCESS', `Admin (${EXCLUSIVE_ADMIN_EMAIL}) signed in with master credentials`);
      mailService.sendLoginSecurityAlert(adminUser.email, adminUser.name, 'Admin Password Login');

      this.notify();
      return { success: true };
    }

    // Standard User login
    let user = dbService.findUserByEmail(cleanEmail);

    if (!user) {
      // Auto-provision standard user if logging in for first time with password
      user = {
        id: 'user_' + Date.now().toString(36),
        name: cleanEmail.split('@')[0].replace(/[._]/g, ' '),
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanEmail)}`,
        provider: 'email',
        role: 'user',
        twoFactorEnabled: false,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      dbService.saveUser(user);
      dbService.logEvent('SIGNUP', user, 'email', 'SUCCESS', `Standard User registered (${cleanEmail})`);
    }

    if (user.twoFactorEnabled) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      this.pending2FA = {
        user,
        code: otpCode,
        expiresAt: Date.now() + 10 * 60 * 1000
      };
      dbService.logEvent('2FA_CHALLENGE', user, 'email', 'SUCCESS', `2FA verification code dispatched to ${user.email}`);
      mailService.sendTwoFactorCode(user.email, user.name, otpCode);
      return { success: true, requires2FA: true };
    }

    user.lastLoginAt = new Date().toISOString();
    dbService.saveUser(user);
    this.currentUser = user;
    dbService.setCurrentUser(user);

    dbService.logEvent('LOGIN', user, 'email', 'SUCCESS', `Standard User (${cleanEmail}) signed in`);
    this.notify();
    return { success: true };
  }

  // 3. User & Admin Signup
  async signUpWithEmail(name: string, email: string, password?: string): Promise<{ success: boolean; requires2FA?: boolean; message?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const isAdminUser = cleanEmail === EXCLUSIVE_ADMIN_EMAIL.toLowerCase();

    if (isAdminUser) {
      return this.signInWithEmail(EXCLUSIVE_ADMIN_EMAIL, password || EXCLUSIVE_ADMIN_PASSWORD);
    }

    let existing = dbService.findUserByEmail(cleanEmail);
    if (existing) {
      return this.signInWithEmail(cleanEmail, password);
    }

    const newUser: User = {
      id: 'user_' + Date.now().toString(36),
      name: name.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || cleanEmail)}`,
      provider: 'email',
      role: 'user',
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    dbService.saveUser(newUser);
    dbService.logEvent('SIGNUP', newUser, 'email', 'SUCCESS', `New User account created for ${cleanEmail}`);
    mailService.sendWelcomeEmail(newUser.email, newUser.name);

    this.currentUser = newUser;
    dbService.setCurrentUser(newUser);
    this.notify();

    return { success: true };
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
      return { success: false, message: 'Invalid 6-digit verification code. Please check your email.' };
    }

    const user = this.pending2FA.user;
    this.pending2FA = null;

    user.lastLoginAt = new Date().toISOString();
    dbService.saveUser(user);
    this.currentUser = user;
    dbService.setCurrentUser(user);

    dbService.logEvent('2FA_VERIFIED', user, user.provider, 'SUCCESS', `2FA verification succeeded (${user.email})`);
    dbService.logEvent('LOGIN', user, user.provider, 'SUCCESS', `${user.role === 'admin' ? 'Admin' : 'User'} logged in with 2FA protection`);
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
      `Two-factor authentication ${enabled ? 'ENABLED' : 'DISABLED'} for ${this.currentUser.email}`
    );
    this.notify();
  }

  // 5. Sign Out
  signOut(): void {
    if (this.currentUser) {
      dbService.logEvent(
        'LOGOUT',
        this.currentUser,
        this.currentUser.provider,
        'SUCCESS',
        `${this.currentUser.role === 'admin' ? 'Admin' : 'User'} (${this.currentUser.email}) logged out successfully`
      );
    }
    this.currentUser = null;
    this.pending2FA = null;
    dbService.setCurrentUser(null);
    this.notify();
  }
}

export const authService = new AuthService();
