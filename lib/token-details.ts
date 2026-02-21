// Fetches rich single-token metadata from the Jupiter Tokens API.
// Provides social links, description, tags, and decimals for the token detail screen.

export type TokenJupiterDetail = {
  name: string | null
  symbol: string | null
  logoURI: string | null
  decimals: number | null
  tags: string[]
  description: string | null
  website: string | null
  twitter: string | null
  discord: string | null
  coingeckoId: string | null
}

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
}

export async function fetchTokenJupiterDetail(mint: string): Promise<TokenJupiterDetail> {
  try {
    const res = await fetch(`https://tokens.jup.ag/token/${mint}`)
    if (!res.ok) return EMPTY_DETAIL
    const d = await res.json()
    return {
      name: d.name ?? null,
      symbol: d.symbol ?? null,
      logoURI: d.logoURI ?? null,
      decimals: typeof d.decimals === 'number' ? d.decimals : null,
      tags: Array.isArray(d.tags) ? d.tags : [],
      description: d.extensions?.description ?? null,
      website: d.extensions?.website ?? null,
      twitter: d.extensions?.twitter ?? null,
      discord: d.extensions?.discord ?? null,
      coingeckoId: d.extensions?.coingeckoId ?? null,
    }
  } catch {
    return EMPTY_DETAIL
  }
}
