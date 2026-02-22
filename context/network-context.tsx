import { createContext, useContext, useMemo, useState } from 'react'
import { createSolanaRpc } from '@solana/kit'
import config from '@/config'
import { storage } from '@/lib/storage'

export type Network = 'mainnet' | 'devnet'

const RPC_URLS: Record<Network, string> = {
  mainnet: config.EXPO_PUBLIC_MAIN_NET_RPC_URL,
  devnet: config.EXPO_PUBLIC_DEV_NET_RPC_URL,
}

const CUSTOM_RPC_KEY = 'custom-rpc-url'

type NetworkContextValue = {
  network: Network
  rpc: ReturnType<typeof createSolanaRpc>
  toggleNetwork: () => void
  customRpcUrl: string
  setCustomRpcUrl: (url: string) => void
}

const NetworkContext = createContext<NetworkContextValue | null>(null)

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [network, setNetwork] = useState<Network>('mainnet')
  const [customRpcUrl, setCustomRpcUrlState] = useState<string>(
    () => storage.getItem(CUSTOM_RPC_KEY) ?? '',
  )

  const effectiveUrl = customRpcUrl || RPC_URLS[network]
  const rpc = useMemo(() => createSolanaRpc(effectiveUrl), [effectiveUrl])

  const toggleNetwork = () => {
    setNetwork((prev) => (prev === 'mainnet' ? 'devnet' : 'mainnet'))
  }

  const setCustomRpcUrl = (url: string) => {
    const trimmed = url.trim()
    if (trimmed) {
      storage.setItem(CUSTOM_RPC_KEY, trimmed)
    } else {
      storage.removeItem(CUSTOM_RPC_KEY)
    }
    setCustomRpcUrlState(trimmed)
  }

  return (
    <NetworkContext.Provider value={{ network, rpc, toggleNetwork, customRpcUrl, setCustomRpcUrl }}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const ctx = useContext(NetworkContext)
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider')
  return ctx
}
