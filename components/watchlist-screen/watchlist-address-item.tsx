import { Pressable, View } from 'react-native'
import { router } from 'expo-router'
import { Text } from '@/components/ui/text'
import { Icon } from '@/components/ui/icon'
import { Wallet01Icon, FavouriteIcon } from '@hugeicons/core-free-icons'
import { short } from '@/utils/format-text'

type Props = {
  address: string
  onRemove: (address: string) => void
}

export function WatchlistAddressItem({ address, onRemove }: Props) {
  const handlePress = () => {
    router.push({ pathname: '/', params: { walletAddress: address } })
  }

  return (
    <Pressable onPress={handlePress} className="flex-row items-center px-4 py-3">
      <View className="bg-muted size-10 items-center justify-center rounded-full">
        <Icon icon={Wallet01Icon} className="text-muted-foreground size-5" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-foreground text-sm font-medium">{short(address, 6)}</Text>
        <Text className="text-muted-foreground text-xs">Tap to search</Text>
      </View>

      <Pressable onPress={() => onRemove(address)} hitSlop={12}>
        <Icon
          icon={FavouriteIcon}
          className="text-rose-500 size-5"
          fill="currentColor"
          strokeWidth={0}
        />
      </Pressable>
    </Pressable>
  )
}
