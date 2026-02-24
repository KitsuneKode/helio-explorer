import { TokenMetadata } from '@/types'
import { getAllTokenMetadataFromJupiter, getAllTokenMetadataFromHelius } from '../solana'
import { storage } from '../storage'
import type { Network } from '@/context/network-context'

type Config = { mints: string[]; network: Network; heliusRpcUrl?: string }

const getFromCache = (mint: string): TokenMetadata | null => {
  try {
    const item = storage.getItem(mint)
    return item ? (JSON.parse(item) as TokenMetadata) : null
  } catch {
    console.log('Error parsing cache item for mint:', mint)
    return null
  }
}

const getMetaDataAndMissingKeysFromCache = (mints: string[], network: Network) => {
  return mints.reduce(
    (acc, mint) => {
      const mintWithNetworkSuffix = `${mint}-${network}`
      const cached = storage.contains(mintWithNetworkSuffix)
        ? getFromCache(mintWithNetworkSuffix)
        : null

      if (cached) {
        acc.present.set(mint, cached)
      } else {
        acc.missing.push(mintWithNetworkSuffix)
      }

      return acc
    },
    { present: new Map<string, TokenMetadata>(), missing: [] as string[] },
  )
}

export const getMetaDataFromCacheOrFetch = async (config: Config) => {
  const { mints, network, heliusRpcUrl } = config
  const { present, missing } = getMetaDataAndMissingKeysFromCache(mints, network)

  console.log(network, present, missing)

  if (missing.length !== 0) {
    // On devnet, skip Helius DAS fetch if no Helius URL — return cache only
    if (network === 'devnet' && !heliusRpcUrl) return present

    const metadata =
      network === 'devnet'
        ? await getAllTokenMetadataFromHelius(buildMints(missing), heliusRpcUrl!)
        : await getAllTokenMetadataFromJupiter(buildMints(missing))
    if (!metadata) return present

    metadata.forEach((meta, mint) => {
      const mintWithNetworkSuffix = `${mint}-${network}`
      storage.setItem(mintWithNetworkSuffix, JSON.stringify(meta))
      present.set(mint, meta)
    })
  }

  return present
}

function buildMints(missing: string[]): string[] {
  return missing.map((msng) => msng.split('-')[0])
}
