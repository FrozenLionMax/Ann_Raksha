import { createContext, useContext, useState, useEffect } from 'react';

/**
 * #15 - Multi-Language Support (i18n)
 * Simple React context-based translation system for Hindi/English
 */

const translations = {
  en: {
    // Navbar
    'nav.dashboard': 'Dashboard',
    'nav.browse': 'Browse Donations',
    'nav.create': 'Create Donation',
    'nav.my_donations': 'My Donations',
    'nav.map': 'Map',
    'nav.leaderboard': 'Leaderboard',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.settings': 'Settings',

    // Dashboard
    'dash.welcome': 'Welcome back',
    'dash.subtitle': "Here's your food rescue impact at a glance",
    'dash.total_donations': 'Total Donations',
    'dash.claimed': 'Claimed',
    'dash.completed': 'Completed',
    'dash.impact_points': 'Impact Points',
    'dash.meals_provided': 'Meals Provided',
    'dash.co2_prevented': 'CO₂ Prevented',
    'dash.water_saved': 'Water Saved',
    'dash.quick_actions': 'Quick Actions',
    'dash.recent': 'Recent Activity',
    'dash.badges': 'Your Badges',
    'dash.env_impact': 'Your Environmental Impact',
    'dash.view_all': 'View All',

    // Browse
    'browse.title': 'Browse Donations',
    'browse.subtitle': 'Find and claim available food donations near you',
    'browse.search': 'Search by food name...',
    'browse.claim': 'Claim Donation',
    'browse.claiming': 'Claiming...',
    'browse.no_results': 'No donations found',

    // General
    'general.loading': 'Loading...',
    'general.save': 'Save Changes',
    'general.cancel': 'Cancel',
    'general.edit': 'Edit',
    'general.delete': 'Delete',
    'general.back': 'Back',
    'general.next': 'Next',
    'general.submit': 'Submit',
    'general.kg': 'kg',
    'general.serves': 'serves',
    'general.expires': 'Expires',
    'general.just_now': 'Just now',
  },

  hi: {
    // Navbar
    'nav.dashboard': 'डैशबोर्ड',
    'nav.browse': 'दान ब्राउज़ करें',
    'nav.create': 'दान बनाएं',
    'nav.my_donations': 'मेरे दान',
    'nav.map': 'नक्शा',
    'nav.leaderboard': 'लीडरबोर्ड',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.logout': 'लॉग आउट',
    'nav.settings': 'सेटिंग्स',

    // Dashboard
    'dash.welcome': 'वापसी पर स्वागत है',
    'dash.subtitle': 'आपके खाद्य बचाव प्रभाव की एक झलक',
    'dash.total_donations': 'कुल दान',
    'dash.claimed': 'दावा किया',
    'dash.completed': 'पूर्ण',
    'dash.impact_points': 'प्रभाव अंक',
    'dash.meals_provided': 'भोजन प्रदान',
    'dash.co2_prevented': 'CO₂ रोका',
    'dash.water_saved': 'पानी बचाया',
    'dash.quick_actions': 'त्वरित कार्य',
    'dash.recent': 'हालिया गतिविधि',
    'dash.badges': 'आपके बैज',
    'dash.env_impact': 'आपका पर्यावरणीय प्रभाव',
    'dash.view_all': 'सब देखें',

    // Browse
    'browse.title': 'दान ब्राउज़ करें',
    'browse.subtitle': 'अपने पास उपलब्ध खाद्य दान ढूंढें और दावा करें',
    'browse.search': 'खाद्य नाम से खोजें...',
    'browse.claim': 'दान का दावा करें',
    'browse.claiming': 'दावा हो रहा है...',
    'browse.no_results': 'कोई दान नहीं मिला',

    // General
    'general.loading': 'लोड हो रहा है...',
    'general.save': 'बदलाव सहेजें',
    'general.cancel': 'रद्द करें',
    'general.edit': 'संपादित करें',
    'general.delete': 'हटाएं',
    'general.back': 'पीछे',
    'general.next': 'आगे',
    'general.submit': 'जमा करें',
    'general.kg': 'किग्रा',
    'general.serves': 'लोगों के लिए',
    'general.expires': 'समाप्ति',
    'general.just_now': 'अभी',
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) return { lang: 'en', switchLanguage: () => {}, t: (k) => k };
  return context;
}

/**
 * Language Switcher Button Component
 */
export function LanguageSwitcher({ compact = false }) {
  const { lang, switchLanguage } = useTranslation();

  return (
    <button
      onClick={() => switchLanguage(lang === 'en' ? 'hi' : 'en')}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10 transition-all flex items-center gap-1.5"
      title={lang === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
    >
      {compact ? (
        <span>{lang === 'en' ? 'हिं' : 'EN'}</span>
      ) : (
        <span>{lang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
      )}
    </button>
  );
}
