import type { MarketingCampaign } from "../types";

const STORAGE_KEY = "fake_campaigns_v1";

interface CampaignFilters {
  q: string;
  status: string;
}

function loadCampaigns(): MarketingCampaign[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveCampaigns(campaigns: MarketingCampaign[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
}

function generateId(): string {
  return `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function listCampaigns(
  filters: CampaignFilters
): Promise<MarketingCampaign[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaigns = loadCampaigns();
      let filtered = campaigns;

      // Filter by search query
      if (filters.q) {
        const query = filters.q.toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.code.toLowerCase().includes(query) ||
            c.name.toLowerCase().includes(query)
        );
      }

      // Filter by status
      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((c) => c.status === filters.status);
      }

      resolve(filtered);
    }, 100);
  });
}

export function getCampaign(id: string): Promise<MarketingCampaign | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaigns = loadCampaigns();
      const campaign = campaigns.find((c) => c.id === id);
      resolve(campaign || null);
    }, 100);
  });
}

export function deleteCampaign(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaigns = loadCampaigns();
      const filtered = campaigns.filter((c) => c.id !== id);
      saveCampaigns(filtered);
      resolve(true);
    }, 100);
  });
}

export function upsertCampaign(
  campaign: Partial<MarketingCampaign> & { id?: string }
): Promise<MarketingCampaign> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaigns = loadCampaigns();

      if (campaign.id) {
        // Update existing campaign
        const index = campaigns.findIndex((c) => c.id === campaign.id);
        if (index !== -1) {
          campaigns[index] = {
            ...campaigns[index],
            ...campaign,
            updatedAt: new Date().toISOString(),
          };
        } else {
          resolve(campaigns[0]); // Fallback
          return;
        }
      } else {
        // Create new campaign
        const newCampaign: MarketingCampaign = {
          id: generateId(),
          code: campaign.code || "",
          name: campaign.name || "",
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          cost: campaign.cost || 0,
          revenue: campaign.revenue || 0,
          conversionRate: campaign.conversionRate || 0,
          status: campaign.status || "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        campaigns.unshift(newCampaign);
      }

      saveCampaigns(campaigns);
      const saved = campaigns.find(
        (c) => c.id === (campaign.id || campaigns[0]?.id)
      );
      resolve(saved!);
    }, 100);
  });
}
