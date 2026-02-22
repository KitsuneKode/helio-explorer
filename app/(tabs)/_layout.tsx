import { Icon } from '@/components/ui/icon'
import { useWalletResetStore } from '@/store/wallet-reset-store'
import { THEME } from '@/lib/theme'
import { Exchange03Icon, Home12Icon, Settings01Icon } from '@hugeicons/core-free-icons'
import { Tabs } from 'expo-router'

export default function Layout() {
  const triggerReset = useWalletResetStore((s) => s.triggerReset)

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarActiveTintColor: `${THEME.dark.primary}`,
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon icon={Home12Icon} size={size} color={color} />,
          tabBarLabelStyle: { fontSize: 12 },
        }}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            const isFocused = navigation.isFocused()
            if (isFocused) {
              triggerReset()
            }
          },
        })}
      />
      <Tabs.Screen
        name="swap"
        options={{
          title: 'Swap',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon icon={Exchange03Icon} size={size} color={color} />,
          tabBarLabelStyle: { fontSize: 12 },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon icon={Settings01Icon} size={size} color={color} />,
          tabBarLabelStyle: { fontSize: 12 },
        }}
      />
    </Tabs>
  )
}
