'use client'

import { usePathname, useRouter } from 'next/navigation'
import { AppShell } from './shell'

const navigationItems = [
  { label: 'Proceshuisbeheer', href: '/', icon: 'dashboard' as const },
  { label: 'Glossary', href: '/glossary', icon: 'library' as const },
  { label: 'AI-agents', href: '/ai-agents', icon: 'bot' as const },
]

const mockUser = {
  name: 'Demo User',
  role: 'Beheerder',
}

interface ShellWrapperProps {
  children: React.ReactNode
}

export function ShellWrapper({ children }: ShellWrapperProps) {
  const pathname = usePathname()
  const router = useRouter()

  const navItemsWithActive = navigationItems.map(item => ({
    ...item,
    isActive: pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)),
  }))

  const handleNavigate = (href: string) => {
    router.push(href)
  }

  const handleLogout = () => {
    // TODO: Implement logout when auth is added
    console.log('Logout clicked')
  }

  return (
    <AppShell
      navigationItems={navItemsWithActive}
      user={mockUser}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {children}
    </AppShell>
  )
}
