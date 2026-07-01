import { useTranslation } from 'react-i18next'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TABS = [
  { key: 'home', icon: '🏠' },
  { key: 'calendar', icon: '📅' },
  { key: 'stats', icon: '📱' },
  { key: 'settings', icon: '⚙️' },
]

export default function Layout({ activeTab, onTabChange }: Props) {
  const { t } = useTranslation()
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100">
      <div className="flex">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors ${
              activeTab === tab.key ? 'text-luna-pink' : 'text-gray-400'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[10px] font-medium">{t(`nav.${tab.key}`)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
