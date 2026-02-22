import { Pressable, View } from 'react-native'
import * as Linking from 'expo-linking'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { Separator } from '@/components/ui/separator'
import { AnimatedCard } from '@/components/ui/animated-card'

type ExplorerLinksCardProps = {
  signature: string
  delay: number
}

export function ExplorerLinksCard({ signature, delay }: ExplorerLinksCardProps) {
  return (
    <AnimatedCard delay={delay}>
      <Card className="mb-8 gap-0 overflow-hidden p-0">
        <Pressable
          onPress={() => Linking.openURL(`https://solscan.io/tx/${signature}`)}
          className="active:opacity-60"
        >
          <View className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center gap-3">
              <View className="bg-primary/10 h-8 w-8 items-center justify-center rounded-full">
                <Text className="text-primary text-xs font-bold">S</Text>
              </View>
              <Text className="text-foreground font-medium">View on Solscan</Text>
            </View>
            <Text variant="muted" className="text-base">
              ↗
            </Text>
          </View>
        </Pressable>
        <Separator className="mx-5" />
        <Pressable
          onPress={() => Linking.openURL(`https://explorer.solana.com/tx/${signature}`)}
          className="active:opacity-60"
        >
          <View className="flex-row items-center justify-between px-5 py-4">
            <View className="flex-row items-center gap-3">
              <View className="bg-muted h-8 w-8 items-center justify-center rounded-full">
                <Text className="text-muted-foreground text-xs font-bold">◎</Text>
              </View>
              <Text className="text-foreground font-medium">Solana Explorer</Text>
            </View>
            <Text variant="muted" className="text-base">
              ↗
            </Text>
          </View>
        </Pressable>
      </Card>
    </AnimatedCard>
  )
}
