import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { watchlistStorage } from '@/lib/storage'

const WATCHLIST_KEY = 'watchlist'

type WatchlistState = {
  watchlist: string[]
  isFavorite: (address: string) => boolean
  addToWatchlist: (address: string) => void
  removeFromWatchlist: (address: string) => void
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],

      isFavorite: (address) => get().watchlist.includes(address),

      addToWatchlist: (address) => {
        const next = [...get().watchlist, address]
        set({ watchlist: next })
      },

      removeFromWatchlist: (address) => {
        const next = get().watchlist.filter((a) => a !== address)
        set({ watchlist: next })
      },
    }),
    {
      name: 'watchlist-storage',
      storage: createJSONStorage(() => watchlistStorage),
    },
  ),
)
