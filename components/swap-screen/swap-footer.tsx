import { Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { ZapIcon } from '@hugeicons/core-free-icons'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

export function SwapFooter() {
  return (
    <View className="mt-5 items-center gap-2">
      <Pressable onPress={() => router.push('/swap-history')} className="active:opacity-60">
        <Text className="text-muted-foreground text-xs">View Swap History</Text>
      </Pressable>
      <View className="flex-row items-center gap-1.5">
        <Icon icon={ZapIcon} className="text-primary size-3.5" />
        <Text className="text-muted-foreground text-xs font-semibold">
          Powered by <Text className="text-primary text-xs font-bold">Jupiter</Text>
        </Text>
      </View>
    </View>
  )
}
