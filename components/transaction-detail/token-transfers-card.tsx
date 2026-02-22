import { useState } from 'react'
import { Image, View } from 'react-native'
import { Coins01Icon } from '@hugeicons/core-free-icons'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { SectionLabel } from '@/components/ui/section-label'
import { AnimatedCard } from '@/components/ui/animated-card'
import { short } from '@/utils/format-text'
import type { TokenTransfer } from '@/components/transaction-detail/types'

function TokenTransferRow({ mint, delta, symbol, logoURI }: TokenTransfer) {
  const [imgError, setImgError] = useState(false)
  const sign = delta >= 0 ? '+' : ''
  const isPositive = delta >= 0
  const label = symbol || short(mint, 6)
  const showLogo = !!(logoURI && !imgError)

  return (
    <View className="flex-row items-center gap-3">
      <View className="bg-muted h-9 w-9 items-center justify-center overflow-hidden rounded-full">
        {showLogo ? (
          <Image
            source={{ uri: logoURI }}
            style={{ width: 36, height: 36 }}
            onError={() => setImgError(true)}
          />
        ) : (
          <Icon icon={Coins01Icon} className="text-muted-foreground size-4" />
        )}
      </View>
      <View className="flex-1">
        <Text className="text-foreground text-sm font-medium">{label}</Text>
        {!symbol && (
          <Text variant="muted" className="font-mono text-xs">
            {short(mint, 4)}
          </Text>
        )}
      </View>
      <Text
        className={[
          'text-sm font-semibold tabular-nums',
          isPositive ? 'text-green-500' : 'text-destructive',
        ].join(' ')}
      >
        {sign}
        {Math.abs(delta).toLocaleString(undefined, { maximumFractionDigits: 6 })}
      </Text>
    </View>
  )
}

type TokenTransfersCardProps = {
  transfers: TokenTransfer[]
  delay: number
}

export function TokenTransfersCard({ transfers, delay }: TokenTransfersCardProps) {
  if (transfers.length === 0) return null

  return (
    <AnimatedCard delay={delay}>
      <Card className="mb-4 overflow-hidden p-0">
        <View className="px-5 pt-4 pb-1">
          <SectionLabel label={`Token Transfers (${transfers.length})`} />
        </View>
        <CardContent className="gap-4 px-5 pb-5 pt-0">
          {transfers.map((t) => (
            <TokenTransferRow key={t.mint} {...t} />
          ))}
        </CardContent>
      </Card>
    </AnimatedCard>
  )
}
