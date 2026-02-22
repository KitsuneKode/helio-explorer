import { useCallback, useRef } from 'react'
import { ActivityIndicator, FlatList, Pressable, ScrollView, View } from 'react-native'
import { SafeAreaViewUniwind } from '@/components/styled-uniwind-components'
import { Text } from '@/components/ui/text'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SectionLabel } from '@/components/ui/section-label'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeToggle } from '@/components/theme-toggle-button'
import { AnimatedCard } from '@/components/ui/animated-card'
import { WatchlistTokenItem } from '@/components/watchlist-screen/watchlist-token-item'
import { WatchlistAddressItem } from '@/components/watchlist-screen/watchlist-address-item'
import { useWatchlistScreen, type WatchlistToken } from '@/hooks/use-watchlist-screen'
import { ArrowLeft01Icon, FavouriteIcon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { useRouter } from 'expo-router'
import { useSharedValue } from 'react-native-reanimated'
import { BackToTopButton } from '@/components/back-to-top-button'

type SectionHeader = { type: 'section-header'; label: string; key: string }
type TokenRow = { type: 'token'; data: WatchlistToken; key: string }
type AddressRow = { type: 'address'; address: string; key: string }
type ListItem = SectionHeader | TokenRow | AddressRow

export default function Watchlist() {
  const { watchlist, visibleTokens, visibleWallets, loading, hasMore, loadMore, removeItem } =
    useWatchlistScreen()
  const router = useRouter()

  const scrollRef = useRef<ScrollView>(null)
  const scrollY = useSharedValue(0)

  const data: ListItem[] = []

  if (visibleTokens.length > 0) {
    data.push({ type: 'section-header', label: 'Tokens', key: 'sh-tokens' })
    for (const t of visibleTokens) {
      data.push({ type: 'token', data: t, key: `t-${t.address}` })
    }
  }

  if (visibleWallets.length > 0) {
    data.push({ type: 'section-header', label: 'Addresses', key: 'sh-addresses' })
    for (const w of visibleWallets) {
      data.push({ type: 'address', address: w, key: `a-${w}` })
    }
  }

  const renderItem = useCallback(
    ({ item, index }: { item: ListItem; index: number }) => {
      if (item.type === 'section-header') {
        return (
          <View className="px-4 pt-4">
            <SectionLabel label={item.label} />
          </View>
        )
      }

      if (item.type === 'token') {
        return (
          <AnimatedCard delay={index * 60}>
            <WatchlistTokenItem
              address={item.data.address}
              metadata={item.data.metadata}
              onRemove={removeItem}
            />
          </AnimatedCard>
        )
      }

      return (
        <AnimatedCard delay={index * 60}>
          <WatchlistAddressItem address={item.address} onRemove={removeItem} />
        </AnimatedCard>
      )
    },
    [removeItem],
  )

  const renderSeparator = useCallback(({ leadingItem }: { leadingItem: ListItem }) => {
    if (leadingItem.type === 'section-header') return null
    return <Separator />
  }, [])

  const isEmpty = watchlist.length === 0

  return (
    <SafeAreaViewUniwind className="bg-background flex-1" edges={['top']}>
      {/* Header */}

      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable onPress={() => router.back()} className="p-1 active:opacity-60">
          <Icon icon={ArrowLeft01Icon} className="text-foreground size-6" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">Watchlist</Text>
        <ThemeToggle />
      </View>

      {loading ? (
        <View className="gap-4 px-5 pt-4">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </View>
      ) : isEmpty ? (
        <View className="flex-1 items-center justify-center px-8">
          <Card className="w-full items-center border-dashed p-6">
            <Icon icon={FavouriteIcon} className="text-muted-foreground mb-3 size-10" />
            <Text className="text-muted-foreground text-center text-sm">
              No favorites yet. Tap the heart on any token or wallet to add it here.
            </Text>
          </Card>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          ItemSeparatorComponent={renderSeparator}
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            hasMore ? (
              <View className="items-center py-4">
                <ActivityIndicator />
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
      <BackToTopButton scrollY={scrollY} scrollRef={scrollRef} />
    </SafeAreaViewUniwind>
  )
}
