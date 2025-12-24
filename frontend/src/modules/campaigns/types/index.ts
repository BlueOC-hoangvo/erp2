export type CampaignStatus = "active" | "paused" | "completed" | "cancelled";

export type MarketingCampaign = {
  id: string;
  code: string;
  name: string;
  startDate?: string;
  endDate?: string;
  cost: number;
  revenue: number;
  conversionRate?: number; // %
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
};
