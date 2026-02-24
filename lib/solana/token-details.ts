// Fetches rich single-token data from the Jupiter Tokens API.
// Returns metadata, social links, AND market data in a single call.

import { Network } from '@/context/network-context'
import { PeriodStats, TokenJupiterDetail } from '@/types'
import axios from 'axios'

const EMPTY_PERIOD: null = null

const EMPTY_DETAIL: TokenJupiterDetail = {
  name: null,
  symbol: null,
  logoURI: null,
  decimals: null,
  tags: [],
  description: null,
  website: null,
  twitter: null,
  discord: null,
  coingeckoId: null,
  priceUsd: null,
  fdv: null,
  mcap: null,
  liquidity: null,
  stats5m: EMPTY_PERIOD,
  stats1h: EMPTY_PERIOD,
  stats6h: EMPTY_PERIOD,
  stats24h: EMPTY_PERIOD,
}

function parsePeriodStats(raw: any): PeriodStats | null {
  if (!raw || typeof raw !== 'object') return null
  return {
    priceChange: raw.priceChange ?? null,
    buyVolume: raw.buyVolume ?? null,
    sellVolume: raw.sellVolume ?? null,
    numBuys: raw.numBuys ?? null,
    numSells: raw.numSells ?? null,
  }
}

async function fetchFromHelius(
  mint: string,
  rpcUrl: string,
): Promise<TokenJupiterDetail> {
  const { data } = await axios.post(
    rpcUrl,
    {
      jsonrpc: '2.0',
      id: 'helio',
      method: 'getAsset',
      params: { id: mint, options: { showFungible: true } },
    },
    { headers: { 'Content-Type': 'application/json' } },
  )

  const asset = data?.result
  if (!asset) return EMPTY_DETAIL

  const metadata = asset.content?.metadata
  const tokenInfo = asset.token_info
  const logoURI = asset.content?.links?.image ?? asset.content?.files?.[0]?.cdn_uri ?? null

  return {
    name: metadata?.name ?? null,
    symbol: metadata?.symbol ?? tokenInfo?.symbol ?? null,
    logoURI,
    decimals: tokenInfo?.decimals ?? null,
    tags: [],
    description: metadata?.description ?? null,
    website: asset.content?.links?.external_url ?? null,
    twitter: null,
    discord: null,
    coingeckoId: null,
    priceUsd: tokenInfo?.price_info?.price_per_token ?? null,
    fdv: null,
    mcap: null,
    liquidity: null,
    stats5m: EMPTY_PERIOD,
    stats1h: EMPTY_PERIOD,
    stats6h: EMPTY_PERIOD,
    stats24h: EMPTY_PERIOD,
  }
}

async function fetchFromJupiter(mint: string): Promise<TokenJupiterDetail> {
  const { data } = await axios.get(`https://lite-api.jup.ag/tokens/v2/search?query=${mint}`)
  if (!data) return EMPTY_DETAIL
  const d = data[0]
  return {
    name: d.name ?? null,
    symbol: d.symbol ?? null,
    logoURI: d.icon ?? d.logoURI ?? null,
    decimals: typeof d.decimals === 'number' ? d.decimals : null,
    tags: Array.isArray(d.tags) ? d.tags : [],
    description: d.extensions?.description ?? d.description ?? null,
    website: d.website ?? d.extensions?.website ?? null,
    twitter: d.twitter ?? d.extensions?.twitter ?? null,
    discord: d.discord ?? d.extensions?.discord ?? null,
    coingeckoId: d.extensions?.coingeckoId ?? null,
    priceUsd: typeof d.usdPrice === 'number' ? d.usdPrice : null,
    fdv: typeof d.fdv === 'number' ? d.fdv : null,
    mcap: typeof d.mcap === 'number' ? d.mcap : null,
    liquidity: typeof d.liquidity === 'number' ? d.liquidity : null,
    stats5m: parsePeriodStats(d.stats5m),
    stats1h: parsePeriodStats(d.stats1h),
    stats6h: parsePeriodStats(d.stats6h),
    stats24h: parsePeriodStats(d.stats24h),
  }
}

export async function fetchTokenJupiterDetail(
  mint: string,
  network: Network,
  heliusRpcUrl?: string,
): Promise<TokenJupiterDetail> {
  try {
    if (network === 'devnet') {
      if (!heliusRpcUrl) return EMPTY_DETAIL
      return await fetchFromHelius(mint, heliusRpcUrl)
    }
    return await fetchFromJupiter(mint)
  } catch {
    return EMPTY_DETAIL
  }
}
