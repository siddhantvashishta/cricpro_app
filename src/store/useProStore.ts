import { create } from 'zustand';

export type ProPlan = 'monthly' | 'annual' | null;

interface ProState {
  isPro: boolean;
  plan: ProPlan;
  planLabel: string;
  upgradeToPro: (plan: ProPlan) => void;
  downgradeToFree: () => void;
}

export const useProStore = create<ProState>((set) => ({
  isPro: false,
  plan: null,
  planLabel: '',

  upgradeToPro: (selectedPlan: ProPlan) => {
    const label = selectedPlan === 'annual' ? 'Pro Annual' : selectedPlan === 'monthly' ? 'Pro Monthly' : '';
    set({
      plan: selectedPlan,
      isPro: selectedPlan !== null,
      planLabel: label,
    });
  },

  downgradeToFree: () => set({
    plan: null,
    isPro: false,
    planLabel: '',
  }),
}));
