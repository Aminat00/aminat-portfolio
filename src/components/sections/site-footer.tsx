export const SiteFooter = () => (
  <footer
    style={{
      maxWidth: 1120,
      margin: "0 auto",
      padding: "var(--space-8) clamp(20px,5vw,64px)",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "var(--space-3)",
      alignItems: "center",
    }}
  >
    <span className="nav-brand" style={{ fontSize: 16 }}>
      aminat<span style={{ color: "var(--color-accent)" }}>.</span>
    </span>
    <span className="text-muted" style={{ fontSize: 12 }}>
      © {new Date().getFullYear()} Aminat Moldalieva · Software Engineer
    </span>
  </footer>
);
