export type CookieConsentValue = "accepted" | "rejected";

export const COOKIE_CONSENT_KEY = "revelao-cookie-consent";
export const COOKIE_CONSENT_EVENT = "revelao-cookie-consent-change";
export const COOKIE_SETTINGS_EVENT = "revelao-cookie-settings-open";

export const getCookieConsent = (): CookieConsentValue | null => {
  return localStorage.getItem(COOKIE_CONSENT_KEY) as CookieConsentValue | null;
};

export const setCookieConsent = (value: CookieConsentValue) => {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
};

export const openCookieSettings = () => {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
};
