import { Mark } from "@/components/brand/mark";
import { FOOTER } from "@/content/site";

export const SiteFooter = () => (
  <footer className="footer">
    <div className="footer-inner">
      <Mark />
      <span>© {new Date().getFullYear()} Aminat Moldalieva</span>
      <span>{FOOTER.note}</span>
    </div>
  </footer>
);
