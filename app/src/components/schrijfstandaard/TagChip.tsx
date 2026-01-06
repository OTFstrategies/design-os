'use client'

interface TagChipProps {
  label: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'pink' | 'stone'
  onClick?: () => void
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  stone: 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300',
}

export function TagChip({ label, color = 'stone', onClick }: TagChipProps) {
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      onClick={onClick}
      className={`
        inline-flex px-2 py-0.5 text-xs font-medium rounded-full
        ${colorClasses[color]}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
      `}
    >
      {label}
    </Component>
  )
}
