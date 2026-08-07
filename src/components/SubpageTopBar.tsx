import { Link } from "react-router-dom";

export const SubpageTopBar = () => (
  <div className="fixed inset-x-0 top-0 z-[10000] h-10 bg-primary text-primary-foreground">
    <div className="container mx-auto flex h-full items-center justify-between px-4">
      <span className="text-sm font-semibold tracking-tight">Revelao.cam</span>
      <Link
        to="/"
        className="inline-flex h-7 items-center justify-center rounded-full bg-white px-4 text-xs font-semibold text-primary transition-colors hover:bg-white/90"
      >
        Volver a la web
      </Link>
    </div>
  </div>
);
