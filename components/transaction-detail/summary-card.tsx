import { View } from 'react-native'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { SectionLabel } from '@/components/ui/section-label'
import { AnimatedCard } from '@/components/ui/animated-card'

type SummaryCardProps = {
  solChange: number
  fee: number
  delay: number
}

export function SummaryCard({ solChange, fee, delay }: SummaryCardProps) {
  return (
    <AnimatedCard delay={delay}>
      <Card className="mb-4 overflow-hidden p-0">
        <View className="px-5 pt-4 pb-1">
          <SectionLabel label="Summary" />
        </View>
        <CardContent className="px-5 pb-5 pt-0">
          <View className="flex-row">
            <View className="flex-1">
              <Text variant="muted" className="mb-1 text-xs uppercase tracking-wider">
                SOL Change
              </Text>
              <Text
                className={[
                  'text-lg font-bold tabular-nums',
                  solChange >= 0 ? 'text-green-500' : 'text-destructive',
                ].join(' ')}
              >
                {solChange >= 0 ? '+' : ''}
                {solChange.toFixed(6)} SOL
              </Text>
            </View>
            <View className="flex-1 items-end">
              <Text variant="muted" className="mb-1 text-xs uppercase tracking-wider">
                Network Fee
              </Text>
              <Text className="text-muted-foreground text-sm font-semibold tabular-nums">
                {fee.toFixed(6)} SOL
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    </AnimatedCard>
  )
}
