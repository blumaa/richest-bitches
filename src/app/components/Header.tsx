export function Header() {
  return (
    <header className="text-center pt-12 pb-6 px-4">
      <h1
        className="text-5xl sm:text-6xl text-primary"
        style={{
          fontWeight: "var(--app-heading-weight)" as unknown as number,
          letterSpacing: "var(--app-heading-tracking)",
          lineHeight: "var(--app-heading-leading)",
        }}
      >
        Richest Bitches
      </h1>
      <p className="mt-3 text-base text-secondary font-medium">
        Who can throw away the most money?
      </p>
    </header>
  );
}
