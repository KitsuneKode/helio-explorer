export type TokenTransfer = {
  mint: string
  delta: number
  symbol?: string
  logoURI?: string
}

export type TxDetail = {
  success: boolean
  fee: number
  slot: number
  blockTime: number | null
  solChange: number
  tokenTransfers: TokenTransfer[]
  accounts: { address: string; signer: boolean; writable: boolean }[]
  signature: string
}
