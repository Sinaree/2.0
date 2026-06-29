 import { useTranslation } from 'react-i18next'
 
 export default function LanguageSwitch() {
   const { i18n } = useTranslation()
   const current = i18n.language?.startsWith('zh') ? 'zh' : 'en'
 
   function toggle() {
     i18n.changeLanguage(current === 'zh' ? 'en' : 'zh')
   }
 
   return (
     <button
       onClick={toggle}
       className="text-sm text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
     >
       {current === 'zh' ? 'EN' : '中'}
     </button>
   )
 }
