"use client"

import { CheckCircle2 } from "lucide-react"
import { container, eyebrow, h2, lede, section } from "@/components/home/tokens"
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal"

const useCases = [
  {
    badge: "Athletes",
    title: "Build a list you can defend",
    body: "Turn PRs, grades, location, and school preferences into a school list that explains why each program belongs there.",
    checks: ["OneScore by school", "Academic and athletic context", "D3-focused beta dataset"],
  },
  {
    badge: "Parents",
    title: "See the whole process in one place",
    body: "Keep the recruiting process organized without becoming the family spreadsheet manager.",
    checks: ["Saved schools", "Sent outreach", "Reply status"],
  },
  {
    badge: "Outreach",
    title: "Send emails that sound like a real athlete",
    body: "Draft personalized messages from the athlete's own profile, then send them through Outlook/Microsoft 365, the inbox provider currently offered in the beta app.",
    checks: ["Own-inbox delivery", "Personal context", "No passive profile waiting"],
  },
  {
    badge: "Onboarding",
    title: "Talk it through with Riley",
    body: "Use the Riley voice conversation to build an athlete profile, then review the captured details before moving on.",
    checks: ["Voice-guided setup", "Athlete-confirmed details", "Profile review before outreach"],
  },
]

export default function WorkspaceSection() {
  return (
    <section aria-labelledby="workspace-heading" className={section}>
      <div className={container}>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className={eyebrow}>Recruiting workspace</p>
          <h2 id="workspace-heading" className={`mt-4 ${h2}`}>
            Built for the messy middle of recruiting.
          </h2>
          <p className={`mt-4 ${lede}`}>
            OneCommit keeps the parts families usually scatter across notes, spreadsheets, inboxes, and memory in one
            focused workflow.
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {useCases.map((item) => (
            <RevealItem key={item.title} className="oc-raised flex h-full flex-col rounded-card bg-card p-7 shadow-soft ring-1 ring-line">
              <span className="inline-flex w-fit rounded-full bg-green-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-green">
                {item.badge}
              </span>
              <h3 className="mt-4 text-[19px] font-semibold tracking-[-0.01em] text-ink">{item.title}</h3>
              <p className="mb-5 mt-2 text-[15px] leading-relaxed text-ink-soft">{item.body}</p>
              <ul className="mt-auto flex flex-col gap-2.5 border-t border-line pt-5">
                {item.checks.map((check) => (
                  <li key={check} className="flex items-center gap-2.5 text-[14px] text-ink">
                    <CheckCircle2 size={15} aria-hidden="true" className="shrink-0 text-green-mid" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
