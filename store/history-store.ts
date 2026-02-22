import { create } from 'zustand'
import {
  type HistoryTokenEntry,
  type HistoryWalletEntry,
  getTokenHistory,
  getWalletHistory,
  addTokenToHistory,
  addWalletToHistory,
  clearHistory,
} from '@/lib/history'

type HistoryState = {
  tokens: HistoryTokenEntry[]
  wallets: HistoryWalletEntry[]
  trackToken: (mint: string) => void
  trackWallet: (address: string) => void
  clearAll: () => void
}

export const useHistoryStore = create<HistoryState>()((set) => ({
  tokens: getTokenHistory(),
  wallets: getWalletHistory(),

  trackToken: (mint) => {
    addTokenToHistory(mint)
    set({ tokens: getTokenHistory() })
  },

  trackWallet: (address) => {
    addWalletToHistory(address)
    set({ wallets: getWalletHistory() })
  },

  clearAll: () => {
    clearHistory()
    set({ tokens: [], wallets: [] })
  },
}))
