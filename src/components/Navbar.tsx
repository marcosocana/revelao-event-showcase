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
export const Navbar = ({ withTopBar = false }: { withTopBar?: boolean }) => {
  const { lang, setLang } = useI18n();
  const t = translations[lang];
  const accessDemoUrl = getAccessDemoUrl(lang);
  const adminLoginUrl = getAdminLoginUrl(lang);
  const currentFlag = languageOptions.find((option) => option.value === lang)?.flag ?? "🇪🇸";
  const eventsRoot = "/events";
  const eventsLabel = lang === "en" ? "Events" : lang === "it" ? "Eventi" : "Eventos";
  const eventsItems = [
    { label: lang === "en" ? "Weddings" : lang === "it" ? "Matrimoni" : "Bodas", href: `${eventsRoot}/boda` },
    { label: lang === "en" ? "Communions" : lang === "it" ? "Comunioni" : "Comuniones", href: `${eventsRoot}/comuniones` },
    { label: lang === "en" ? "Birthdays" : lang === "it" ? "Compleanni" : "Cumpleaños", href: `${eventsRoot}/cumpleanos` },
    { label: lang === "en" ? "Companies" : lang === "it" ? "Aziende" : "Empresa", href: `${eventsRoot}/empresa` },
    { label: lang === "en" ? "Conferences" : lang === "it" ? "Conferenze" : "Conferencias", href: `${eventsRoot}/conferencias` },
    { label: lang === "en" ? "Christmas Dinners" : lang === "it" ? "Cene di Natale" : "Cenas de navidad", href: `${eventsRoot}/cenas-navidad` },
  ];
  const showEventsMenu = false;

  return <nav className={`fixed left-0 right-0 z-[9999] bg-white backdrop-blur-xl border-b border-border/60 supports-[backdrop-filter]:bg-white ${withTopBar ? "top-10" : "top-0"}`}>
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
              <a href={withTopBar ? "/#casos-de-exito" : "#casos-de-exito"} className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.testimonials}
              </a>
              <a href={withTopBar ? "/#plantillas" : "#plantillas"} className="text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.templates}
              </a>
              {showEventsMenu ? (
                <div className="relative group">
                  <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                    {eventsLabel}
                  </button>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute left-0 top-full mt-2 w-56 rounded-xl border border-border bg-white shadow-xl transition-all duration-150 z-[10000]">
                    <div className="py-2">
                      {eventsItems.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
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
