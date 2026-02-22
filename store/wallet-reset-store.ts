import { create } from 'zustand'

type WalletResetState = {
  resetCount: number
  triggerReset: () => void
}

export const useWalletResetStore = create<WalletResetState>()((set) => ({
  resetCount: 0,
  triggerReset: () => set((s) => ({ resetCount: s.resetCount + 1 })),
}))
