import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { SectionLabel } from '@/components/ui/section-label'
import { AnimatedCard } from '@/components/ui/animated-card'
import { short } from '@/utils/format-text'

type Account = {
  address: string
  signer: boolean
  writable: boolean
}

type AccountsCardProps = {
  accounts: Account[]
  delay: number
}

export function AccountsCard({ accounts, delay }: AccountsCardProps) {
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? accounts : accounts.slice(0, 3)
  const hiddenCount = Math.max(0, accounts.length - 3)

  return (
    <AnimatedCard delay={delay}>
      <Card className="mb-4 gap-0 overflow-hidden p-0">
        <View className="px-5 pt-4 pb-1">
          <SectionLabel label={`Accounts (${accounts.length})`} />
        </View>
        <CardContent className="gap-3 px-5 pb-5 pt-0">
          {visible.map((acc, idx) => (
            <View key={acc.address} className="flex-row flex-wrap items-center gap-2">
              <Text className="text-foreground font-mono text-sm">
                {short(acc.address, 6)}
              </Text>
              {idx === 0 && (
                <View className="rounded bg-yellow-500/15 px-1.5 py-0.5">
                  <Text className="text-xs font-semibold text-yellow-500">FEE PAYER</Text>
                </View>
              )}
              {acc.signer && (
                <View className="bg-primary/10 rounded px-1.5 py-0.5">
                  <Text className="text-primary text-xs font-semibold">SIGNER</Text>
                </View>
              )}
              {acc.writable && (
                <View className="bg-muted rounded px-1.5 py-0.5">
                  <Text className="text-muted-foreground text-xs font-semibold">WRITABLE</Text>
                </View>
              )}
            </View>
          ))}
          {hiddenCount > 0 && (
            <Pressable onPress={() => setShowAll((p) => !p)} className="active:opacity-60">
              <Text className="text-primary text-sm">
                {showAll ? 'Show less ↑' : `+ ${hiddenCount} more ↓`}
              </Text>
            </Pressable>
          )}
        </CardContent>
      </Card>
    </AnimatedCard>
  )
}
