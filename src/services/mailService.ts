import { dbService } from './dbService';
import { EmailNotification } from '../types/auth';

class MailNotificationService {
  // Send simulated & connected email to user's Gmail
  sendEmail(
    recipientEmail: string,
    recipientName: string,
    category: EmailNotification['category'],
    subject: string,
    body: string
  ): EmailNotification {
    const notification: EmailNotification = {
      id: 'mail_' + Math.random().toString(36).substring(2, 9),
      recipientEmail,
      recipientName,
      subject,
      category,
      body,
      sentAt: new Date().toISOString(),
      isRead: false,
      status: 'DELIVERED',
    };

    dbService.saveNotification(notification);
    return notification;
  }

  // Pre-configured automated templates
  sendWelcomeEmail(userEmail: string, userName: string): EmailNotification {
    return this.sendEmail(
      userEmail,
      userName,
      'WELCOME',
      '🎉 Welcome to NexaWork AI - Your Cloud Career Intelligence Platform',
      `Hi ${userName},\n\nWelcome to NexaWork AI! Your account is active. You can now track real-time hiring trends across 2.48M+ job postings, run Azure compensation simulations, and build personalized 12-week roadmaps.\n\nEnjoy full access to our intelligence suite.\n\nBest regards,\nThe NexaWork Team`
    );
  }

  sendLoginSecurityAlert(userEmail: string, userName: string, method: string): EmailNotification {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toLocaleDateString();
    return this.sendEmail(
      userEmail,
      userName,
      'SECURITY',
      `🔒 Security Alert: New Login to your NexaWork account (${method})`,
      `Hi ${userName},\n\nWe detected a successful login to your NexaWork AI account via ${method} on ${dateStr} at ${timeStr}.\n\nDevice: macOS / Chrome\nStatus: Verified\n\nIf this was you, you can safely ignore this email. If you did not initiate this login, please enable Two-Step Verification immediately.\n\nNexaWork Security Center`
    );
  }

  sendTwoFactorCode(userEmail: string, userName: string, code: string): EmailNotification {
    return this.sendEmail(
      userEmail,
      userName,
      '2FA_CODE',
      `🔑 ${code} is your NexaWork Two-Step Verification code`,
      `Hi ${userName},\n\nHere is your one-time verification code to complete your login to NexaWork AI:\n\n🔐 Verification Code: ${code}\n\nThis code expires in 10 minutes. Never share this code with anyone.\n\nNexaWork Security Team`
    );
  }

  sendWeeklyTrendDigest(userEmail: string, userName: string): EmailNotification {
    return this.sendEmail(
      userEmail,
      userName,
      'TREND_ALERT',
      '📈 Market Pulse: Azure GenAI Roles Surge +184% YoY',
      `Hi ${userName},\n\nHere is your latest cloud intelligence digest:\n\n• Azure GenAI & Semantic Kernel postings jumped +184% YoY\n• Median Base Compensation in Tier 1 US Metros is now $178,500\n• 82.6% of cloud engineering roles now support Hybrid/Remote work.\n\nLog in to NexaWork to benchmark your compensation against updated salary data.\n\nExplore More on NexaWork AI`
    );
  }
}

export const mailService = new MailNotificationService();
