'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

interface NavigationItem {
  label: string
  href: string
  icon: 'dashboard' | 'library' | 'document' | 'bot'
  isActive?: boolean
}

interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: {
    name: string
    role?: string
    avatarUrl?: string
  }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-700"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 font-semibold text-stone-900 dark:text-stone-100">
          Proceshuis HSF
        </span>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-stone-800
          border-r border-stone-200 dark:border-stone-700
          flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo area */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-stone-200 dark:border-stone-700">
          <span className="font-semibold text-stone-900 dark:text-stone-100">
            Proceshuis HSF
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <MainNav items={navigationItems} onNavigate={onNavigate} />

        {/* User menu at bottom */}
        <UserMenu user={user} onLogout={onLogout} />
      </aside>

      {/* Main content */}
      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  )
}
