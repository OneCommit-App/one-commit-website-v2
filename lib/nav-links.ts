/**
 * One navigation vocabulary for both headers.
 *
 * The two mobile menus used to ship different link sets — the homepage nav had
 * Features and Pricing but not About or Support, the shared header had About and
 * Support but not Features or Pricing — so the site had two information
 * architectures depending on which page you happened to be standing on. The menu
 * IS the navigation on a phone, so that is a real split, not a cosmetic one.
 *
 * Every href is absolute (`/#pricing`, not `#pricing`) so a hash link works from
 * any route, not only from the homepage.
 */
export type NavLink = { label: string; href: string }

export const mobileNavLinks: NavLink[] = [
  { label: "Coaches", href: "/coaches" },
  { label: "Schools", href: "/schools" },
  { label: "Athletic Programs", href: "/athletic-programs" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "For parents", href: "/parents" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
]
