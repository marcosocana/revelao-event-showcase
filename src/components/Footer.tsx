import icon from "@/assets/ico.png";
export const Footer = () => {
  return <footer className="py-10 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-center gap-3">
          <img src={icon} alt="Revelao" className="h-6 w-auto" />
          <span className="text-lg font-bold text-foreground">Revelao.cam</span>
        </div>
      </div>
    </footer>;
};
