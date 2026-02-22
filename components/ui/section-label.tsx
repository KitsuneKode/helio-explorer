import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'

type Props = { label: string; className?: string }

export function SectionLabel({ label, className }: Props) {
  return (
    <Text
      className={cn(
        'text-muted-foreground mb-3 text-xs font-semibold tracking-widest uppercase',
        className,
      )}
    >
      {label}
    </Text>
  )
}
