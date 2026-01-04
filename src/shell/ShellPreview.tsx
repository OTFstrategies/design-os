import { AppShell } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems = [
    { label: 'Proceshuisbeheer', href: '/proceshuisbeheer', icon: 'dashboard' as const, isActive: true },
    { label: 'Standaardzinnen', href: '/standaardzinnen', icon: 'library' as const },
    { label: 'Schrijfstandaard', href: '/schrijfstandaard', icon: 'document' as const },
    { label: 'AI-agents', href: '/ai-agents', icon: 'bot' as const },
  ]

  const user = {
    name: 'Jan de Vries',
    role: 'Proceseigenaar',
    avatarUrl: undefined,
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
            Proceshuisbeheer
          </h1>
          <p className="text-stone-600 dark:text-stone-400 mb-8">
            Dashboard met status van alle procedures, onderlinge relaties, versiebeheer en RACI-eigenaarschap.
          </p>

          {/* Placeholder content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Actieve procedures', value: '24', status: 'success' },
              { label: 'In review', value: '7', status: 'warning' },
              { label: 'Verouderd', value: '3', status: 'error' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-4"
              >
                <p className="text-sm text-stone-500 dark:text-stone-400">{stat.label}</p>
                <p className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 p-6">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">
              Recente activiteit
            </h2>
            <div className="space-y-3">
              {[
                { action: 'Procedure bijgewerkt', doc: 'WI-HEF-001', user: 'M. Jansen', time: '2 uur geleden' },
                { action: 'Review aangevraagd', doc: 'PR-OHD-012', user: 'K. de Wit', time: '4 uur geleden' },
                { action: 'Goedgekeurd', doc: 'WI-DISP-003', user: 'J. de Vries', time: 'gisteren' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
                      {activity.action}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      <code className="font-mono">{activity.doc}</code> — {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
