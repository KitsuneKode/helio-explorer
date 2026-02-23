import { useCallback, useState } from 'react'
import { FlatList, Image, Pressable, View } from 'react-native'
import { router } from 'expo-router'
import {
  ArrowLeft01Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Exchange03Icon,
} from '@hugeicons/core-free-icons'
import { SafeAreaViewUniwind } from '@/components/styled-uniwind-components'
import { Text } from '@/components/ui/text'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Separator } from '@/components/ui/separator'
import { AnimatedCard } from '@/components/ui/animated-card'
import { ThemeToggle } from '@/components/theme-toggle-button'
import { useSwapHistoryStore, type SwapHistoryEntry } from '@/store/swap-history-store'
import { useNetwork } from '@/context/network-context'
import { Coins01Icon } from '@hugeicons/core-free-icons'

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function SwapTokenLogo({ uri, size = 28 }: { uri: string; size?: number }) {
  const [error, setError] = useState(false)
  if (!uri || error) {
    return (
      <View
        className="bg-muted items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        <Icon icon={Coins01Icon} className="text-muted-foreground size-3.5" />
      </View>
    )
  }
  return (
    <Image
      source={{ uri }}
      style={{ width: size, height: size, borderRadius: size / 2 }}
      onError={() => setError(true)}
    />
  )
}

export default function SwapHistoryScreen() {
  const { network } = useNetwork()
  const entries = useSwapHistoryStore((s) => s.data[network].entries)
  const clearSwapHistory = useSwapHistoryStore((s) => s.clearSwapHistory)

  const isEmpty = entries.length === 0

  const renderItem = useCallback(
    ({ item, index }: { item: SwapHistoryEntry; index: number }) => {
      const canNavigate = item.status === 'success' && item.signature
      return (
        <AnimatedCard delay={index * 60}>
          <Pressable
            onPress={
              canNavigate
                ? () =>
                    router.push({
                      pathname: '/transaction/[signature]',
                      params: { signature: item.signature! },
                    })
                : undefined
            }
            className="flex-row items-center px-4 py-3"
            style={!canNavigate ? { opacity: 0.85 } : undefined}
          >
            {/* Overlapping token logos */}
            <View className="relative" style={{ width: 40, height: 28 }}>
              <View style={{ position: 'absolute', left: 0, top: 0, zIndex: 1 }}>
                <SwapTokenLogo uri={item.fromToken.logo} size={28} />
              </View>
              <View
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 0,
                  zIndex: 0,
                  borderRadius: 14,
                  borderWidth: 1.5,
                  borderColor: 'transparent',
                }}
              >
                <SwapTokenLogo uri={item.toToken.logo} size={28} />
              </View>
            </View>

            {/* Center: symbols + amounts */}
            <View className="ml-3 flex-1">
              <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
                {item.fromToken.symbol} → {item.toToken.symbol}
              </Text>
              <Text className="text-muted-foreground text-xs" numberOfLines={1}>
                {item.fromAmount} {item.fromToken.symbol}
                {item.toAmount ? ` → ${item.toAmount} ${item.toToken.symbol}` : ''}
              </Text>
            </View>

            {/* Right: status + time */}
            <View className="items-end ml-2">
              <Icon
                icon={item.status === 'success' ? CheckmarkCircle01Icon : CancelCircleIcon}
                className={`size-4.5 ${item.status === 'success' ? 'text-primary' : 'text-destructive'}`}
              />
              <Text className="text-muted-foreground mt-0.5 text-[10px]">
                {timeAgo(item.timestamp)}
              </Text>
            </View>
          </Pressable>
        </AnimatedCard>
      )
    },
    [],
  )

  const renderSeparator = useCallback(() => <Separator />, [])

  return (
    <SafeAreaViewUniwind className="bg-background flex-1" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={() => router.back()} className="p-1 active:opacity-60">
          <Icon icon={ArrowLeft01Icon} className="text-foreground size-6" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">Swap History</Text>
        <ThemeToggle />
      </View>

      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-8">
          <Card className="w-full items-center border-dashed p-6">
            <Icon icon={Exchange03Icon} className="text-muted-foreground mb-3 size-10" />
            <Text className="text-muted-foreground text-center text-sm">
              No swaps yet. Your swap history will appear here after you make a trade.
            </Text>
          </Card>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListFooterComponent={
            <View className="items-center px-4 pt-6">
              <Pressable onPress={() => clearSwapHistory(network)}>
                <Text className="text-destructive text-sm font-medium">Clear Swap History</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </SafeAreaViewUniwind>
  )
}
