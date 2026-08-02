import type { Metadata } from "next"

export type AudienceKey = "coaches" | "schools" | "athletic-programs"

export type AudienceBenefit = {
  title: string
  body: string
  icon: "profile" | "target" | "messages" | "checklist" | "shield" | "people"
}

export type AudienceContent = {
  key: AudienceKey
  label: string
  shortLabel: string
  path: `/${string}`
  eyebrow: string
  headline: string
  description: string
  metadataDescription: string
  primaryCta: string
  mailtoHref: `mailto:${string}`
  eventSource: string
  benefitsHeading: string
  benefitsDescription: string
  benefits: AudienceBenefit[]
  available: string[]
  unavailable: string[]
}

const pilotHref = (subject: string, prompts: string[]): `mailto:${string}` => {
  const body = prompts.join("\n")
  return `mailto:admin@onecommit.us?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export const audienceOrder: AudienceKey[] = [
  "coaches",
  "schools",
  "athletic-programs",
]

export const audiences: Record<AudienceKey, AudienceContent> = {
  coaches: {
    key: "coaches",
    label: "High school coaches",
    shortLabel: "Coaches",
    path: "/coaches",
    eyebrow: "For high school track and field coaches",
    headline: "Give every athlete a recruiting plan without becoming their recruiting agent.",
    description:
      "OneCommit gives athletes a structured place to build a D3-focused school list, prepare personal outreach, and keep replies organized. You guide the decisions while each athlete owns the account, message, and next move.",
    metadataDescription:
      "Give track and field athletes an athlete-owned recruiting workflow with D3-focused OneScore guidance, personal outreach, and organized reply history.",
    primaryCta: "Request a coach pilot conversation",
    mailtoHref: pilotHref("OneCommit coach pilot", [
      "School:",
      "Role:",
      "Athletes you support:",
      "Best time to talk:",
    ]),
    eventSource: "coaches",
    benefitsHeading: "Keep the check-in focused on decisions.",
    benefitsDescription:
      "OneCommit organizes the athlete's work before you meet, so the conversation can start with real profile details, school context, and communication history.",
    benefits: [
      {
        icon: "profile",
        title: "A profile the athlete reviews",
        body: "Riley-guided onboarding captures marks, academics, and preferences. The athlete reviews the details before using them.",
      },
      {
        icon: "target",
        title: "D3-focused OneScore context",
        body: "Athletes compare current D3 beta matches school by school instead of rebuilding a list from an empty spreadsheet.",
      },
      {
        icon: "messages",
        title: "Outreach stays athlete-owned",
        body: "The athlete reviews personal outreach, sends through a supported connected inbox, and keeps school communication history together.",
      },
    ],
    available: [
      "Athlete-owned accounts and profile review",
      "D3-focused OneScore matching and school lists",
      "Personal outreach through a supported connected inbox",
      "Communication history organized by school",
    ],
    unavailable: [
      "No coach or administrator dashboard",
      "No roster monitoring or team reporting",
      "No automatic outreach without athlete review",
      "No guaranteed replies, offers, or admissions outcomes",
    ],
  },
  schools: {
    key: "schools",
    label: "Schools and student support teams",
    shortLabel: "Schools",
    path: "/schools",
    eyebrow: "For high school athletic departments and student support teams",
    headline: "A clearer recruiting workflow for student-athletes—without another school portal.",
    description:
      "OneCommit gives track and field athletes one place to review their profile, compare D3 programs, prepare outreach, and keep replies organized. Coaches and counselors can support a consistent process without operating student accounts.",
    metadataDescription:
      "A structured, athlete-owned D3 recruiting workflow for high school track and field athletes, supported by coaches and counselors without a school portal.",
    primaryCta: "Discuss a school pilot",
    mailtoHref: pilotHref("OneCommit school pilot", [
      "School:",
      "Role:",
      "How you support student-athletes:",
      "Best time to talk:",
    ]),
    eventSource: "schools",
    benefitsHeading: "Give athletes a common starting point.",
    benefitsDescription:
      "The current product is an athlete workspace. A school pilot evaluates whether that shared structure makes existing coach and counselor conversations more useful.",
    benefits: [
      {
        icon: "checklist",
        title: "One repeatable athlete checklist",
        body: "Marks, academics, preferences, school research, and outreach live in one athlete-reviewed workflow.",
      },
      {
        icon: "target",
        title: "D3 scope stays explicit",
        body: "OneScore guidance is framed around the current D3 beta dataset rather than implying equal coverage across every division.",
      },
      {
        icon: "shield",
        title: "Clear adult and athlete roles",
        body: "Adults can guide the process, while the athlete owns the account and approves personal communication.",
      },
    ],
    available: [
      "Riley-guided athlete onboarding and profile review",
      "D3-focused school comparison",
      "Athlete-reviewed outreach preparation",
      "A consistent process for existing support conversations",
    ],
    unavailable: [
      "No school administrator dashboard",
      "No roster import, surveillance, or reporting",
      "No account provisioning or single sign-on",
      "No compliance certification or recruiting outcome promise",
    ],
  },
  "athletic-programs": {
    key: "athletic-programs",
    label: "Track and field programs",
    shortLabel: "Athletic programs",
    path: "/athletic-programs",
    eyebrow: "For high school track and field programs and clubs",
    headline: "Give your track program a repeatable recruiting rhythm.",
    description:
      "OneCommit helps athletes move from profile details to D3 school comparison, reviewed outreach, and reply history. Program leaders can reinforce a shared rhythm without becoming account managers or recruiting agents.",
    metadataDescription:
      "An athlete-owned D3 recruiting workflow for high school track and field programs and clubs, with structured profiles, school comparison, and outreach history.",
    primaryCta: "Discuss a program pilot",
    mailtoHref: pilotHref("OneCommit athletic program pilot", [
      "Program:",
      "Role:",
      "Athletes you support:",
      "Best time to talk:",
    ]),
    eventSource: "athletic_programs",
    benefitsHeading: "Add structure without taking over.",
    benefitsDescription:
      "The athlete does the recruiting work. Your program reinforces the same checkpoints and helps the athlete make informed decisions.",
    benefits: [
      {
        icon: "people",
        title: "An athlete-led process",
        body: "Each athlete owns the account, reviews profile details, and decides which schools and messages move forward.",
      },
      {
        icon: "target",
        title: "Track-specific D3 context",
        body: "The current matching experience starts with track and field marks, academics, preferences, and D3 beta data.",
      },
      {
        icon: "messages",
        title: "A visible communication trail",
        body: "Athletes can keep school outreach and reply history together instead of scattering it across disconnected notes.",
      },
    ],
    available: [
      "Athlete-owned profiles and school lists",
      "D3-focused OneScore context",
      "Personal outreach through a supported connected inbox",
      "School communication history for athlete check-ins",
    ],
    unavailable: [
      "No program dashboard or staff accounts",
      "No roster management or team analytics",
      "No multi-sport or all-division coverage claim",
      "No automatic campaigns or guaranteed outcomes",
    ],
  },
}

export function audienceMetadata(key: AudienceKey): Metadata {
  const audience = audiences[key]
  const canonical = `https://www.onecommit.us${audience.path}`
  const title = key === "athletic-programs" ? "For Athletic Programs" : `For ${audience.shortLabel}`

  return {
    title,
    description: audience.metadataDescription,
    alternates: { canonical },
    openGraph: {
      title: `${title} | OneCommit`,
      description: audience.metadataDescription,
      url: canonical,
      siteName: "OneCommit",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${audience.shortLabel} supporting an athlete-owned OneCommit recruiting workflow`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | OneCommit`,
      description: audience.metadataDescription,
      images: ["/opengraph-image"],
    },
  }
}
