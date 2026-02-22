import { storage } from './storage'

const HISTORY_TOKENS_KEY = 'history-tokens'
const HISTORY_WALLETS_KEY = 'history-wallets'
const MAX_TOKENS = 30
const MAX_WALLETS = 20

export type HistoryTokenEntry = {
  type: 'token'
  mint: string
  timestamp: number
}

export type HistoryWalletEntry = {
  type: 'wallet'
  address: string
  timestamp: number
}

export type HistoryEntry = HistoryTokenEntry | HistoryWalletEntry

export function addTokenToHistory(mint: string): void {
  const existing = getTokenHistory()
  const filtered = existing.filter((e) => e.mint !== mint)
  const updated: HistoryTokenEntry[] = [{ type: 'token' as const, mint, timestamp: Date.now() }, ...filtered].slice(0, MAX_TOKENS)
  storage.setItem(HISTORY_TOKENS_KEY, JSON.stringify(updated))
}

export function addWalletToHistory(address: string): void {
  const existing = getWalletHistory()
  const filtered = existing.filter((e) => e.address !== address)
  const updated: HistoryWalletEntry[] = [{ type: 'wallet' as const, address, timestamp: Date.now() }, ...filtered].slice(0, MAX_WALLETS)
  storage.setItem(HISTORY_WALLETS_KEY, JSON.stringify(updated))
}

export function getTokenHistory(): HistoryTokenEntry[] {
  const raw = storage.getItem(HISTORY_TOKENS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function getWalletHistory(): HistoryWalletEntry[] {
  const raw = storage.getItem(HISTORY_WALLETS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function clearHistory(): void {
  storage.removeItem(HISTORY_TOKENS_KEY)
  storage.removeItem(HISTORY_WALLETS_KEY)
}
