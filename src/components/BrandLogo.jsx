/** Gear mark only — sidebar / compact UI */
export function BrandMark({ className = "", size = 40, alt = "APBuddy" }) {
  return (
    <img
      className={`brand-mark ${className}`.trim()}
      src="/apbuddy-mark-sidebar.png"
      srcSet="/apbuddy-mark-sidebar.png 48w, /apbuddy-mark-192.png 192w, /apbuddy-mark.png 800w"
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={alt}
      decoding="async"
    />
  );
}

/** Full logo (icon + APBUDDY wordmark) — login / marketing */
export function BrandLogoFull({ className = "", width = 260, alt = "APBuddy" }) {
  return (
    <img
      className={`brand-logo-full ${className}`.trim()}
      src="/apbuddy-logo-login.png"
      srcSet="/apbuddy-logo-login.png 480w, /apbuddy-logo.png 1156w"
      sizes={`(max-width: 560px) min(72vw, 240px), ${width}px`}
      width={width}
      alt={alt}
      decoding="async"
    />
  );
}
