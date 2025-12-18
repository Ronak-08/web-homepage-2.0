import { browser } from "$app/environment";
const defaultSettings = {
  bgSource: 'bgImage',
  showClock: true,
  twelvehrClock: false,
  greeting: false,
  name: "User",
  bgImageDarken: true,
  bgImageBlur: 4,
  showWeather: false,
  showNews: false,
  city: null,
  quickLinks: true,
};


function loadSettings() {
  if(!browser) {
    return defaultSettings;
  }

  const savedSettings = localStorage.getItem('settings');

  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      return { ...defaultSettings, ...parsed };
    } catch (e) {
      console.error("Failed to parse settings from localStorage", e);
      return defaultSettings;
    }
  }
  return defaultSettings;
}

export const settings = $state(loadSettings());

