export type ThemeMode = 'dark' | 'light' | 'midnight';
export type SubscriptionTier = 'starter' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  badge?: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}
