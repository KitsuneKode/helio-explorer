import { useEffect } from 'react'
import { View } from 'react-native'
import { CheckmarkCircle01Icon, CancelCircleIcon } from '@hugeicons/core-free-icons'
import { AnimatedViewUniwind } from '@/components/styled-uniwind-components'
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { format } from 'date-fns'

type StatusHeroProps = {
  success: boolean
  blockTime: number | null
  txType: string
}

export function StatusHero({ success, blockTime, txType }: StatusHeroProps) {
  const scale = useSharedValue(0.5)
  const opacity = useSharedValue(0)
  const pulseScale = useSharedValue(1)
  const pulseOpacity = useSharedValue(0.4)
  const shakeX = useSharedValue(0)

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 })
    opacity.value = withTiming(1, { duration: 300 })

    if (success) {
      pulseScale.value = withRepeat(withTiming(1.5, { duration: 1200 }), -1, true)
      pulseOpacity.value = withRepeat(withTiming(0, { duration: 1200 }), -1, true)
    } else {
      shakeX.value = withSequence(
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(-6, { duration: 60 }),
        withTiming(6, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      )
    }
  }, [success])

  const iconStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
  }))

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }))

  return (
    <View className="items-center gap-3 py-8">
      <View className="items-center justify-center">
        {success && (
          <AnimatedViewUniwind
            style={[
              pulseStyle,
              {
                position: 'absolute',
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: 'rgba(34,197,94,0.2)',
              },
            ]}
          />
        )}
        <AnimatedViewUniwind style={iconStyle}>
          <View
            className={[
              'h-14 w-14 items-center justify-center rounded-full',
              success ? 'bg-green-500/10' : 'bg-destructive/10',
            ].join(' ')}
          >
            {success ? (
              <Icon icon={CheckmarkCircle01Icon} className="size-7 text-green-500" />
            ) : (
              <Icon icon={CancelCircleIcon} className="text-destructive size-7" />
            )}
          </View>
        </AnimatedViewUniwind>
      </View>

      <Text className="text-foreground text-xl font-semibold">
        {success ? 'Transaction Confirmed' : 'Transaction Failed'}
      </Text>

      <View className="bg-muted rounded-full px-4 py-1.5">
        <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          {txType}
        </Text>
      </View>

      {blockTime && (
        <Text variant="muted" className="text-sm">
          {format(new Date(blockTime * 1000), 'EEE, MMM d · h:mm a')}
        </Text>
      )}
    </View>
  )
}
