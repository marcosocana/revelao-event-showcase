import { Button } from "@/components/ui/button";
import icon from "@/assets/ico.png";
import logoMini from "@/assets/logo-mini.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getAccessDemoUrl, getAdminLoginUrl, useI18n, translations, type Language } from "@/lib/i18n";

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
];
export const Navbar = () => {
  const { lang, setLang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
  const adminLoginUrl = getAdminLoginUrl(lang);
  const currentFlag = languageOptions.find((option) => option.value === lang)?.flag ?? "🇪🇸";

  return <nav className="fixed top-0 left-0 right-0 z-[9999] bg-white/70 backdrop-blur-xl border-b border-border/60 supports-[backdrop-filter]:bg-white/60">
      <div className="container px-4 mx-auto">
        <div className="flex items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <a href="#inicio" className="flex items-center gap-3">
              <img src={icon} alt="Revelao" className="h-8 w-auto hidden min-[1300px]:block" />
              <img src={logoMini} alt="Revelao" className="h-8 w-auto min-[1300px]:hidden" />
              <span className="sr-only">Revelao.cam</span>
              {/* text removed */}
            </a>
          </div>

          {/* Center: Menu */}
          <div className="hidden min-[1300px]:flex flex-1 justify-center">
            <div className="flex items-center gap-8">
              <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.how}
              </a>
              <a href="#precio" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.pricing}
              </a>
              <a href="#casos-de-exito" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.testimonials}
              </a>
              <a href="#plantillas" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.templates}
              </a>
              <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.blog}
              </a>
              <div className="flex items-center gap-3">
                <a href="#faqs" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t.nav.faqs}
                </a>
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-lg"
                    aria-label="Idioma"
                  >
                    {currentFlag}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languageOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setLang(option.value)}
                      className="cursor-pointer"
                    >
                      <span className="mr-2 text-base">{option.flag}</span>
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="hidden min-[1300px]:flex items-center gap-6 ml-auto">
            <a
              href={adminLoginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.access}
            </a>
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              asChild
            >
              <a href={accessDemoUrl} target="_blank" rel="noopener noreferrer">
                {t.nav.tryFree}
              </a>
            </Button>
          </div>

          {/* Mobile CTA Button */}
          <div className="min-[1300px]:hidden ml-auto flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-base"
                  aria-label="Idioma"
                >
                  {currentFlag}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languageOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setLang(option.value)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2 text-base">{option.flag}</span>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <a
              href={adminLoginUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.nav.accessShort}
            </a>
            <Button
              size="sm"
              className="navbarCtaMobile navCtaButton ctaRed rounded-full"
              asChild
            >
              <a
                href={accessDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-nav-cta
                className="navCtaLink"
              >
                {t.nav.tryShort}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>;
};
