import { Pressable, View, Image } from 'react-native'
import { Text } from '@/components/ui/text'
import { Icon } from '@/components/ui/icon'
import { Coins01Icon, FavouriteIcon } from '@hugeicons/core-free-icons'
import { useRouter } from 'expo-router'
import { TokenMetadata } from '@/types'

type Props = {
  address: string
  metadata: TokenMetadata
  onRemove: (address: string) => void
}

export function WatchlistTokenItem({ address, metadata, onRemove }: Props) {
  const router = useRouter()

  const handlePress = () => {
    router.push({ pathname: '/token/[mint]', params: { mint: address } })
  }

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center px-4 py-3"
    >
      {metadata.logoURI ? (
        <Image
          source={{ uri: metadata.logoURI }}
          className="size-10 rounded-full"
        />
      ) : (
        <View className="bg-muted size-10 items-center justify-center rounded-full">
          <Icon icon={Coins01Icon} className="text-muted-foreground size-5" />
        </View>
      )}

      <View className="ml-3 flex-1">
        <Text className="text-foreground text-sm font-semibold" numberOfLines={1}>
          {metadata.tokenName}
        </Text>
        <Text className="text-muted-foreground text-xs">
          ${metadata.symbol}
        </Text>
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
