export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Member {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  joinedAt: string;
  leftAt?: string;
  cookerOrder: number;
  canCook: boolean;
  avatar?: string;
  notes?: string;
}

export interface MemberMealEntry {
  memberId: string | Member;
  breakfast: number;
  lunch: number;
  dinner: number;
  totalMeals: number;
  note?: string;
}

export interface MealDay {
  _id: string;
  date: string;
  elements: string[];
  entries: MemberMealEntry[];
  notes?: string;
  isLocked: boolean;
}

export interface MealElement {
  _id: string;
  name: string;
  category?: string;
  isActive: boolean;
  usageCount: number;
}

export interface CookerConfig {
  _id: string;
  termDays: number;
  memberOrder: (string | Member)[];
  rotationStartDate: string;
  currentIndex: number;
  autoRotate: boolean;
}

export interface CookingHistory {
  _id: string;
  date: string;
  memberId: string | Member;
  source: 'auto' | 'manual';
  note?: string;
  swappedWith?: string | Member;
}

export interface CookingPreview {
  date: string;
  memberId: string;
  memberName: string;
  source: string;
}

export interface Purchase {
  _id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  paidByMemberId?: string | Member;
  note?: string;
  items: string[];
  receiptUrl?: string;
  isVerified: boolean;
}

export type AdjustmentType = 'payment' | 'credit' | 'debit' | 'settlement';

export interface Adjustment {
  _id: string;
  date: string;
  memberId: string | Member;
  amount: number;
  type: AdjustmentType;
  note?: string;
  referenceId?: string;
  relatedMemberId?: string | Member;
  isVoided: boolean;
  voidedAt?: string;
  voidReason?: string;
}

export interface MemberDueSummary {
  memberId: string;
  memberName: string;
  totalMeals: number;
  mealCost: number;
  purchasesPaid: number;
  payments: number;
  credits: number;
  debits: number;
  totalAdjusted: number;
  grossDue: number;
  netDue: number;
  cookingDays: number;
}

export interface DueSummaryReport {
  period: { from: string; to: string };
  totalPurchases: number;
  totalMeals: number;
  mealRate: number;
  members: MemberDueSummary[];
  totalDue: number;
  totalPaid: number;
  balance: number;
}

export interface DateRange {
  from: string;
  to: string;
}
