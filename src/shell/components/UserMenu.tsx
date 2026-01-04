import { LogOut, User } from 'lucide-react'

interface UserMenuProps {
  user?: {
    name: string
    role?: string
    avatarUrl?: string
  }
  onLogout?: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  if (!user) return null

  return (
    <div className="px-3 py-4 border-t border-stone-200 dark:border-stone-700">
      <div className="flex items-center gap-3 px-3 py-2">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-stone-300 dark:bg-stone-600 flex items-center justify-center">
            <User className="w-5 h-5 text-stone-600 dark:text-stone-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
            {user.name}
          </p>
          {user.role && (
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {user.role}
            </p>
          )}
        </div>
        <button
          onClick={onLogout}
          className="p-2 rounded-lg text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          title="Uitloggen"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
