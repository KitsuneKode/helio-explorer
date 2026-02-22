import { cn } from '@/lib/utils'
import { Pressable, Text, View } from 'react-native'

type Props = {
  label: string
  right?: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  className?: string
}

export function SettingsRow({ label, className, onPress, disabled, right }: Props) {
  const content = (
    <View className={cn('flex-row items-center justify-between px-4 py-3', className)}>
      <Text className={`text-xl ${disabled ? 'text-muted-foreground' : 'text-foreground'}`}>
        {label}
      </Text>
      {right}
    </View>
  )

  if (onPress) {
    return (
      <Pressable onPress={onPress} disabled={disabled} className="active:opacity-60">
        {content}
      </Pressable>
    )
  }

  return content
}
