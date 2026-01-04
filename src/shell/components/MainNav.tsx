import {
  LayoutDashboard,
  Library,
  FileText,
  Bot,
  ChevronRight,
  Circle
} from 'lucide-react'

interface NavigationItem {
  label: string
  href: string
  icon?: 'dashboard' | 'library' | 'document' | 'bot' | string
  isActive?: boolean
}

interface MainNavProps {
  items: NavigationItem[]
  onNavigate?: (href: string) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  library: Library,
  document: FileText,
  bot: Bot,
}

export function MainNav({ items, onNavigate }: MainNavProps) {
  return (
    <nav className="flex-1 px-3 py-4">
      <ul className="space-y-1">
        {items.map((item) => {
          const Icon = (item.icon && iconMap[item.icon]) || Circle
          return (
            <li key={item.href}>
              <button
                onClick={() => onNavigate?.(item.href)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-colors
                  ${item.isActive
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-900 dark:text-stone-100'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.isActive && (
                  <ChevronRight className="w-4 h-4 text-stone-400 dark:text-stone-500" />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
